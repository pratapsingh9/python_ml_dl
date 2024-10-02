#!/bin/bash

# Total number of requests
total_requests=10000
# Total duration in seconds
duration=60
# Number of concurrent requests
concurrency=100
# Base URL of your server
url="http://localhost:3000"  # Change this to your server's URL

# Calculate the number of requests to send per second
requests_per_second=$((total_requests / duration))

# Function to send requests
send_requests() {
  for ((i = 0; i < requests_per_second; i++)); do
    curl -s "$url" > /dev/null &  # Send request in the background
  done
}

# Run for the duration specified
for ((i = 0; i < duration; i++)); do
  send_requests
  sleep 1  # Wait for one second before sending the next batch
done

wait  # Wait for all background processes to finish

