#!/bin/sh
set -e

if [ -n "$PORT" ]; then
  export SERVER_PORT="$PORT"
fi

# Build JDBC URL without embedded credentials (postgres://user:pass@host/db breaks JDBC parsing).
if [ -z "$SPRING_DATASOURCE_URL" ]; then
  if [ -n "$PGHOST" ] && [ -n "$PGDATABASE" ]; then
    pg_port="${PGPORT:-5432}"
    export SPRING_DATASOURCE_URL="jdbc:postgresql://${PGHOST}:${pg_port}/${PGDATABASE}"
  elif [ -n "$DATABASE_URL" ]; then
    raw="${DATABASE_URL#postgres://}"
    raw="${raw#postgresql://}"
    raw="${raw#*@}"
    host_part="${raw%%/*}"
    db_part="${raw#*/}"
    db_part="${db_part%%\?*}"
    case "$host_part" in
      *:*) export SPRING_DATASOURCE_URL="jdbc:postgresql://${host_part}/${db_part}" ;;
      *)   export SPRING_DATASOURCE_URL="jdbc:postgresql://${host_part}:5432/${db_part}" ;;
    esac
  fi
fi

exec java -jar /app/app.jar
