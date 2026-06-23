#!/bin/sh
set -e

if [ -n "$PORT" ]; then
  export SERVER_PORT="$PORT"
fi

# Render Postgres: postgres://user:pass@host:port/db → jdbc:postgresql://…
if [ -n "$DATABASE_URL" ] && [ -z "$SPRING_DATASOURCE_URL" ]; then
  case "$DATABASE_URL" in
    postgres://*)
      export SPRING_DATASOURCE_URL="jdbc:postgresql://${DATABASE_URL#postgres://}"
      ;;
    postgresql://*)
      export SPRING_DATASOURCE_URL="jdbc:postgresql://${DATABASE_URL#postgresql://}"
      ;;
    jdbc:*)
      export SPRING_DATASOURCE_URL="$DATABASE_URL"
      ;;
  esac
fi

exec java -jar /app/app.jar
