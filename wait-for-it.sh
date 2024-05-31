#!/bin/sh

# Use this script to test if a given TCP host/port are available

set -e

HOST="$1"
PORT="$2"
shift 2
TIMEOUT="${WAITFORIT_TIMEOUT:-100}"
COMMAND="$@"

# Check if HOST and PORT are not empty
if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Error: Host and port must be specified"
  exit 1
fi

echo "Waiting for $HOST:$PORT to be available..."

for i in $(seq $TIMEOUT); do
  if nc -z "$HOST" "$PORT"; then
    break
  fi
  echo "$i/$TIMEOUT: Waiting for $HOST:$PORT..."
  sleep 1
done

if [ "$i" = "$TIMEOUT" ]; then
  echo "Operation timed out" >&2
  exit 1
fi

echo "$HOST:$PORT is available!"

# Execute the remaining command using the 'eval' function
eval "$COMMAND"
