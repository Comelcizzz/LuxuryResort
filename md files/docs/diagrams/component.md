# Компонентна діаграма розгортання

```mermaid
flowchart LR
    subgraph Client["Клієнт"]
        SPA[React SPA]
    end

    subgraph Backend["Spring Boot API"]
        REST[REST Controllers]
        SEC[JwtAuthFilter + SecurityConfig]
        SVC[Application Services]
        JPA[Spring Data JPA]
    end

    subgraph Data["Дані"]
        PG[(PostgreSQL)]
        FLY[Flyway міграції]
    end

    SPA -->|HTTPS JSON| REST
    REST --> SEC
    SEC --> SVC
    SVC --> JPA
    JPA --> PG
    FLY --> PG
```

**Пояснення для записки:** SPA спілкується лише з REST API; автентифікація станless (JWT); схема БД версіонується Flyway; чутливі операції захищені RBAC на рівні `SecurityConfig`.
