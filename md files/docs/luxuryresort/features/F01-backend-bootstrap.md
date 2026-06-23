# F01 — Backend bootstrap (Maven / Spring Boot)

## Related Execution Order step(s)

- **Step 1** — [promt.md](../../../promt.md) (Execution Order §1, Tech Stack)

## Status

`Done` (bootstrap + Maven Wrapper + Actuator; Lombok/MapStruct processors у `maven-compiler-plugin`)

## Spec source

- [promt.md](../../../promt.md) — **Tech Stack (non-negotiable)**, **Backend Package Structure** (корінь `com.luxuryresort`)

## Acceptance checklist

- [x] `pom.xml` для Java **21**, Spring Boot **3.x**, packaging JAR.
- [x] Залежності: Spring Web, Spring Security, Spring Data JPA, **PostgreSQL** driver, **Flyway**, **MapStruct**, **Lombok**, **springdoc-openapi**, **iTextPDF 7**, **Bucket4j** (rate limit).
- [x] Тести: JUnit 5, Mockito, **Spring Boot Test**, **Testcontainers** (у POM для F18).
- [x] Базові властивості: `application.yml` + профілі `dev` / `prod`, placeholder для datasource.
- [x] Головний клас `@SpringBootApplication` у пакеті `com.luxuryresort`.
- [x] Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`).
- [x] Annotation processors Lombok/MapStruct у `maven-compiler-plugin` (збірка Docker / JDK 21).
- [ ] Жодних порожніх заглушок у доменних сервісах — далі за F07+.

## Dependencies

- Немає (перший крок backend).

## Legacy (coursework) note

У курсовій — `legacy/backend/package.json`, Express, без Maven. Дипломний backend — **кореневий `backend/`** (Maven, Spring Boot 3, Java 21).

## Thesis section hint

Розділ про вибір технологій, середовище розробки, структуру проєкту (аналіз існуючого MERN vs цільовий Spring).

## Notes / Risks

- Переконатися, що версії Spring Boot 3 узгоджені з Java 21 у BOM.
- MapStruct потребує коректного шляху до `generated-sources` у IDE.
- Annotation processors Lombok/MapStruct увімкнені в `maven-compiler-plugin`; локально на **JDK 25** збірка може вимагати **JDK 21** (як у Docker-образі).
- На Windows `mvnw` може не знаходити класи wrapper, якщо шлях до проєкту містить не-ASCII символи; тоді збірку запускайте з ASCII-копії каталогу або з IDE з коректним `JAVA_HOME`.

**Spec:** [promt.md](../../../promt.md)
