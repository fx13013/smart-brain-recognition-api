#!/bin/sh

# Use this script to test if a given TCP host/port are available

set -e

HOST="$1"
PORT="$2"
shift 2
TIMEOUT="${WAITFORIT_TIMEOUT:-100}"
COMMAND="$@"

# Split the host and port from the remaining command
host_port="$HOST:$PORT"
remaining_command="$@"

echo "Waiting for $host_port to be available..."

for i in $(seq $TIMEOUT); do
  nc -z "$host_port" && break
  echo "$i/$TIMEOUT: Waiting for $host_port..."
  sleep 1
done

if [ "$i" = "$TIMEOUT" ]; then
  echo "Operation timed out" >&2
  exit 1
fi

echo "$host_port is available!"

# Execute the remaining command using the 'eval' function
eval "$remaining_command"
