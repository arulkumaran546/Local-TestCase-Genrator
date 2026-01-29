import urllib.request
import json

def test_ollama():
    url = "http://localhost:11434/api/generate"
    # Testing both lowercase and exact name from ollama list
    for model in ["codellama", "CodeLlama:latest"]:
        print(f"Testing model: {model}")
        payload = {
            "model": model,
            "prompt": "Say hello",
            "stream": False
        }
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                print(f"Success for {model}: {result.get('response')[:50]}...")
        except Exception as e:
            print(f"Failed for {model}: {e}")

if __name__ == "__main__":
    test_ollama()
