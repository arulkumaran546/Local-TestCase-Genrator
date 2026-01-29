import urllib.request
import json
import time

def test_backend():
    url = "http://localhost:8000/convert"
    payload = {
        "source_code": "@Test public void test() { driver.get('http://google.com'); }",
        "target_language": "typescript",
        "output_directory": ".tmp/output"
    }
    
    print("Sending conversion request to backend...")
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            print(f"Status: {status}")
            data = json.loads(response.read().decode())
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_backend()
