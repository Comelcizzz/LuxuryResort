#!/bin/sh
set -e

if [ -n "$PORT" ]; then
  export SERVER_PORT="$PORT"
fi

resolve_pg_host() {
  host="$1"
  case "$host" in
    *.*) printf '%s' "$host" ;;
    *)
      region="${RENDER_REGION:-frankfurt}"
      printf '%s.%s-postgres.render.com' "$host" "$region"
      ;;
  esac
}

append_sslmode() {
  url="$1"
  case "$url" in
    *sslmode=*) printf '%s' "$url" ;;
    *\?*) printf '%s&sslmode=require' "$url" ;;
    *) printf '%s?sslmode=require' "$url" ;;
  esac
}

# JDBC URL must not embed user:password (breaks the PostgreSQL driver).
if [ -z "$SPRING_DATASOURCE_URL" ]; then
  if [ -n "$PGHOST" ] && [ -n "$PGDATABASE" ]; then
    pg_host="$(resolve_pg_host "$PGHOST")"
    pg_port="${PGPORT:-5432}"
    SPRING_DATASOURCE_URL="jdbc:postgresql://${pg_host}:${pg_port}/${PGDATABASE}"
    export SPRING_DATASOURCE_URL="$(append_sslmode "$SPRING_DATASOURCE_URL")"
    echo "PostgreSQL host: ${pg_host}"
  elif [ -n "$DATABASE_URL" ]; then
    raw="${DATABASE_URL#postgres://}"
    raw="${raw#postgresql://}"
    raw="${raw#*@}"
    host_part="${raw%%/*}"
    db_part="${raw#*/}"
    db_part="${db_part%%\?*}"
    pg_host="${host_part%%:*}"
    pg_port="${host_part#*:}"
    if [ "$pg_port" = "$host_part" ]; then
      pg_port="5432"
    fi
    pg_host="$(resolve_pg_host "$pg_host")"
    SPRING_DATASOURCE_URL="jdbc:postgresql://${pg_host}:${pg_port}/${db_part}"
    export SPRING_DATASOURCE_URL="$(append_sslmode "$SPRING_DATASOURCE_URL")"
    echo "PostgreSQL host: ${pg_host}"
  fi
fi

exec java -jar /app/app.jar
