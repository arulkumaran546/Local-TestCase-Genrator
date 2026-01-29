# Conversion SOP: Selenium Java to Playwright TS

## 1. Overview
This SOP defines the logical mapping and prompt engineering strategy for converting legacy Selenium Java (with TestNG) tests into modern Playwright TypeScript tests using **CodeLlama**.

## 2. Prompt Engineering Strategy
The system uses a "Role-Based Prompt" to instruct CodeLlama.

### System Prompt
```text
You are an expert test automation engineer specializing in Selenium Java and Playwright TypeScript.
Your task is to convert Selenium Java code into idiomatic Playwright TypeScript.
```

### Prompt Details
- **TestNG to Playwright:**
    - `@Test` -> `test('name', async ({ page }) => { ... })`
    - `@BeforeMethod` -> `test.beforeEach(async ({ page }) => { ... })`
    - `@AfterMethod` -> `test.afterEach(async ({ page }) => { ... })`
- **Locators:**
    - `driver.findElement(By.id("foo"))` -> `page.locator('#foo')`
    - `driver.findElement(By.xpath("//div"))` -> `page.locator('//div')`
- **Actions:**
    - `element.sendKeys("bar")` -> `await element.fill("bar")`
    - `element.click()` -> `await element.click()`
- **Assertions:**
    - `Assert.assertEquals(a, b)` -> `expect(a).toBe(b)`
    - `Assert.assertTrue(condition)` -> `expect(condition).toBeTruthy()`

## 3. Tool Logic (`converter_engine.py`)
1. **Input:** Raw Java String.
2. **Step 1:** Construct full prompt with few-shot examples.
3. **Step 2:** Call Ollama API (`/api/generate`) with `codellama`.
4. **Step 3:** Post-process output to strip markdown blocks if present.
5. **Step 4:** Save to file and return for UI display.

## 4. Edge Cases
- **Hard Sleeps:** `Thread.sleep(x)` -> `await page.waitForTimeout(x)` (but warn user to use auto-waiting).
- **Implicit Waits:** Remove Selenium implicit waits in favor of Playwright's auto-waiting.
- **Frames/Windows:** Use `page.frameLocator` or `context.waitForEvent('page')`.
