#!/bin/sh
set -e

# Render sets PORT; Spring reads SERVER_PORT (see application.yml).
if [ -n "$PORT" ]; then
  export SERVER_PORT="$PORT"
fi

# Render Postgres provides postgres://… — convert for Spring JDBC if needed.
if [ -n "$DATABASE_URL" ] && [ -z "$SPRING_DATASOURCE_URL" ]; then
  case "$DATABASE_URL" in
    postgres://*)
      export SPRING_DATASOURCE_URL="jdbc:postgresql://${DATABASE_URL#postgres://}"
      ;;
    postgresql://*)
      export SPRING_DATASOURCE_URL="jdbc:postgresql://${DATABASE_URL#postgresql://}"
      ;;
  esac
fi

exec java -jar /app/app.jar
