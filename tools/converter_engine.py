import urllib.request
import json
import os

class SeleniumToPlaywrightConverter:
    def __init__(self, ollama_url="http://localhost:11434", model="llama3.2:latest"):
        self.ollama_url = ollama_url
        self.model = model

    def generate_prompt(self, java_code):
        return f"""
You are an expert test automation engineer. Convert the following Selenium Java (TestNG) code into idiomatic Playwright TypeScript.

**Rules:**
1. Use `test` and `expect` from `@playwright/test`.
2. Convert Selenium `By` locators to Playwright `page.locator`.
3. Use `async/await` for all browser actions.
4. Prioritize readability over 1:1 mapping.
5. If the Java code uses TestNG annotations like @Test, @BeforeMethod, etc., map them to Playwright equivalents.
6. Provide ONLY the code block. No explanations.

**Source Java Code:**
{java_code}

**Converted Playwright TypeScript Code:**
"""

    def convert(self, java_code):
        prompt = self.generate_prompt(java_code)
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            req = urllib.request.Request(
                f"{self.ollama_url}/api/generate",
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            
            with urllib.request.urlopen(req, timeout=120) as response:
                result = json.loads(response.read().decode())
                converted_code = result.get("response", "").strip()
                
                # Robust cleaning of markdown blocks
                import re
                code_match = re.search(r'```(?:typescript|javascript)?\s*(.*?)\s*```', converted_code, re.DOTALL)
                if code_match:
                    converted_code = code_match.group(1).strip()
                
                return {
                    "status": "success",
                    "converted_code": converted_code,
                    "logs": [f"Conversion successful using {self.model}"]
                }
        except Exception as e:
            return {
                "status": "error",
                "converted_code": "",
                "logs": [f"Error during conversion: {str(e)}"]
            }

if __name__ == "__main__":
    # Test snippet
    java_test = """
    @Test
    public void searchTest() {
        driver.get("https://google.com");
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("Playwright");
        searchBox.submit();
        Assert.assertTrue(driver.getTitle().contains("Playwright"));
    }
    """
    converter = SeleniumToPlaywrightConverter()
    result = converter.convert(java_test)
    print(result["converted_code"])
