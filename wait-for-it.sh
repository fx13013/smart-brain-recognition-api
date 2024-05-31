#!/usr/bin/env bash
# Use this script to test if a given TCP host/port are available

set -e

HOST="$1"
PORT="$2"
shift 2
TIMEOUT="${WAITFORIT_TIMEOUT:-100}"
COMMAND="$@"

echo "Waiting for $HOST:$PORT to be available..."

for i in $(seq $TIMEOUT); do
  nc -z $HOST $PORT && break
  echo "$i/$TIMEOUT: Waiting for $HOST:$PORT..."
  sleep 1
done

if [ "$i" = "$TIMEOUT" ]; then
  echo "Operation timed out" >&2
  exit 1
fi

echo "$HOST:$PORT is available!"

exec $COMMAND
