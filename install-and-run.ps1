param(
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $projectRoot "installer.log"
$appUrl = "http://localhost:5173"
$backendHealthUrl = "http://localhost:8080/actuator/health"
$restartMarker = Join-Path $projectRoot ".restart-required"

function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdmin)) {
    Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        "`"$PSCommandPath`""
    )
    exit
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Add-Content -Path $logFile -Value $line -Encoding UTF8
}

function Write-Ui {
    param([string]$Message)
    Write-Output ("UI: {0}" -f $Message)
}

function Invoke-LoggedCommand {
    param(
        [string]$Title,
        [string]$FilePath,
        [string[]]$Arguments,
        [string]$WorkingDirectory = $projectRoot
    )

    Write-Log $Title
    Write-Ui $Title
    Write-Log ("Command: {0} {1}" -f $FilePath, ($Arguments -join " "))

    $stdoutPath = Join-Path $env:TEMP ("luxuryresort-out-{0}.log" -f ([guid]::NewGuid()))
    $stderrPath = Join-Path $env:TEMP ("luxuryresort-err-{0}.log" -f ([guid]::NewGuid()))

    try {
        $process = Start-Process `
            -FilePath $FilePath `
            -ArgumentList $Arguments `
            -WorkingDirectory $WorkingDirectory `
            -NoNewWindow `
            -Wait `
            -PassThru `
            -RedirectStandardOutput $stdoutPath `
            -RedirectStandardError $stderrPath

        foreach ($path in @($stdoutPath, $stderrPath)) {
            if (Test-Path $path) {
                Get-Content -Path $path -ErrorAction SilentlyContinue | ForEach-Object {
                    $text = $_.ToString()
                    if (-not [string]::IsNullOrWhiteSpace($text)) {
                        Write-Log $text
                    }
                }
            }
        }

        $exitCode = $process.ExitCode
    } finally {
        Remove-Item -Force -ErrorAction SilentlyContinue $stdoutPath, $stderrPath
    }

    if ($exitCode -ne 0) {
        throw "$Title failed with exit code $exitCode"
    }
}

function Test-CommandExists {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-DockerReady {
    try {
        docker info *> $null
        return $true
    } catch {
        return $false
    }
}

function Get-VirtualizationFirmwareState {
    try {
        $cpu = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1
        return [bool]$cpu.VirtualizationFirmwareEnabled
    } catch {
        return $null
    }
}

function Enable-RequiredWindowsFeatures {
    Write-Log "Checking Windows features required by Docker Desktop and WSL2."

    $features = @(
        "Microsoft-Windows-Subsystem-Linux",
        "VirtualMachinePlatform"
    )

    $changed = $false
    foreach ($feature in $features) {
        $state = (Get-WindowsOptionalFeature -Online -FeatureName $feature).State
        if ($state -ne "Enabled") {
            Write-Log "Enabling Windows feature: $feature"
            Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart | Out-Null
            $changed = $true
        } else {
            Write-Log "Windows feature already enabled: $feature"
        }
    }

    try {
        Invoke-LoggedCommand "Enabling Windows hypervisor startup" "bcdedit.exe" @("/set", "hypervisorlaunchtype", "auto")
    } catch {
        Write-Log "Could not set hypervisorlaunchtype. If Docker fails to start, check it manually." "WARN"
    }

    if ($changed) {
        "restart-required" | Set-Content -Path $restartMarker -Encoding UTF8
        throw "Required Windows features were enabled. Restart the computer, then run Start-LuxuryResort.cmd again."
    }
}

function Wait-Url {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 180
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                Write-Log "Ready: $Url"
                return
            }
        } catch {
            Write-Log "Waiting for $Url ..."
        }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for $Url"
}

try {
    Set-Location $projectRoot
    "Luxury Resort installer log" | Set-Content -Path $logFile -Encoding UTF8
    Write-Log "Project folder: $projectRoot"
    Write-Ui "Preparing installer"
    Write-Log "Installer is running with administrator privileges."

    if (-not (Test-Path (Join-Path $projectRoot "docker-compose.yml"))) {
        throw "docker-compose.yml was not found next to the installer. Do not move Start-LuxuryResort.cmd away from the project folder."
    }

    $virtualizationEnabled = Get-VirtualizationFirmwareState
    if ($virtualizationEnabled -eq $false) {
        Write-Log "Windows reports BIOS/UEFI virtualization as disabled. Continuing anyway because this check can be wrong after Docker/WSL changes. If Docker fails to start, enable Intel VT-x / Intel Virtualization Technology or AMD-V / SVM Mode in BIOS/UEFI." "WARN"
    } elseif ($virtualizationEnabled -eq $true) {
        Write-Log "BIOS/UEFI virtualization is enabled."
    } else {
        Write-Log "Could not automatically check BIOS virtualization. Continuing; Docker will show an error if it is disabled." "WARN"
    }

    Enable-RequiredWindowsFeatures

    if (-not (Test-CommandExists "docker")) {
        Write-Log "Docker Desktop was not found. Trying to install Docker Desktop with winget."
        Write-Ui "Installing Docker Desktop"
        if (-not (Test-CommandExists "winget")) {
            throw "Docker Desktop is missing and winget is not available on this Windows installation. Install Docker Desktop manually once, restart the computer, then run this installer again."
        }
        Invoke-LoggedCommand "Installing Docker Desktop" "winget" @(
            "install",
            "--exact",
            "--id",
            "Docker.DockerDesktop",
            "--accept-source-agreements",
            "--accept-package-agreements"
        )
        Write-Log "Docker Desktop was installed or was already present. If Windows asks for a restart, restart the computer and run this installer again."
    } else {
        Write-Log "Docker command found."
    }

    if (-not (Test-DockerReady)) {
        $dockerDesktop = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
        if (Test-Path $dockerDesktop) {
            Write-Log "Starting Docker Desktop."
            Write-Ui "Starting Docker Desktop"
            Start-Process -FilePath $dockerDesktop | Out-Null
        } else {
            Write-Log "Docker Desktop.exe was not found in the default folder. Waiting for Docker engine anyway." "WARN"
        }

        Write-Log "Waiting for Docker engine. First startup may take several minutes."
        Write-Ui "Waiting for Docker engine"
        $deadline = (Get-Date).AddMinutes(10)
        while (-not (Test-DockerReady)) {
            if ((Get-Date) -gt $deadline) {
                throw "Docker Desktop did not start. Open Docker Desktop, finish its first setup, accept all Windows/UAC prompts, then run Start-LuxuryResort.cmd again."
            }
            Start-Sleep -Seconds 5
            Write-Log "Docker is still starting..."
        }
    }
    Write-Log "Docker engine is ready."
    Write-Ui "Docker engine is ready"

    $envPath = Join-Path $projectRoot ".env"
    if (-not (Test-Path $envPath)) {
        Write-Log "Creating .env with local demo settings."
        @"
JWT_SECRET=dev_only_change_me_min_32_chars_______
CORS_ORIGINS=http://localhost:5173
"@ | Set-Content -Path $envPath -Encoding UTF8
    } else {
        Write-Log ".env already exists."
    }

    Invoke-LoggedCommand "Checking Docker Compose" "docker" @("compose", "version")
    Invoke-LoggedCommand "Building and starting database, backend, and frontend" "docker" @(
        "compose",
        "-p",
        "luxuryresort",
        "--profile",
        "app",
        "up",
        "-d",
        "--build"
    )

    Write-Log "Flyway migrations and demo seed data run automatically inside the backend container on first database start."
    Write-Ui "Waiting for backend and database"
    Wait-Url $backendHealthUrl 240
    Write-Ui "Waiting for frontend"
    Wait-Url $appUrl 120

    if (-not $NoBrowser) {
        Write-Log "Opening browser: $appUrl"
        Write-Ui "Opening browser"
        Start-Process $appUrl
    }

    Write-Log "Done. Application is running at $appUrl"
    Write-Ui "DONE: Application is running at $appUrl"
    Write-Host ""
    Write-Host "Done. Application is running at $appUrl"
    Write-Host "Log file: $logFile"
    Write-Host ""
} catch {
    Write-Log $_.Exception.Message "ERROR"
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "Log file: $logFile"
    Write-Host ""
    exit 1
}
