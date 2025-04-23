import requests
import json
import time
import sys

# Wait a bit for the server to start
print("Waiting for Flask server to start...")
time.sleep(3)

# Define the base URL
base_url = "http://localhost:8000"

# Test endpoints
endpoints = [
    "/generate-insights/1",
    "/kpi-data/1",
    "/luzmo-dashboard/1"
]

# Test each endpoint
for endpoint in endpoints:
    url = f"{base_url}{endpoint}"
    print(f"\nTesting endpoint: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

# Also test voice processing
voice_url = f"{base_url}/process-voice"
print(f"\nTesting voice processing: {voice_url}")
try:
    data = {
        "transcript": "Show me the engineering department statistics for last month",
        "context": {"currentView": "dashboard"}
    }
    response = requests.post(voice_url, json=data)
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {str(e)}")

print("\nTest completed.")