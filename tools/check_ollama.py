import urllib.request
import json
import sys

OLLAMA_URL = "http://localhost:11434"
REQUIRED_MODEL = "codellama"

def check_ollama():
    print(f"Checking Ollama connection at {OLLAMA_URL}...")
    try:
        # Check connection and get tags
        with urllib.request.urlopen(f"{OLLAMA_URL}/api/tags") as response:
            if response.status != 200:
                print(f"Error: Ollama returned status code {response.status}")
                return False
            
            data = json.loads(response.read().decode())
            models = [model['name'] for model in data.get('models', [])]
            
            print("Connection successful.")
            print(f"Available models: {models}")
            
            # Check for required model (allows 'codellama:latest' etc)
            if any(REQUIRED_MODEL in m for m in models):
                print(f"SUCCESS: Model '{REQUIRED_MODEL}' found.")
                return True
            else:
                print(f"WARNING: Model '{REQUIRED_MODEL}' not found in list.")
                print(f"Please run: 'ollama pull {REQUIRED_MODEL}'")
                return False

    except urllib.error.URLError as e:
        print(f"CRITICAL: Could not connect to Ollama. Is it running? Error: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = check_ollama()
    if not success:
        sys.exit(1)
