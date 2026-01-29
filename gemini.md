# gemini.md - Project Constitution

## 1. Data Schemas

### Conversion Request (Input)
```json
{
  "source_code": "string (Raw Selenium Java Code)",
  "target_language": "string ('javascript' | 'typescript')",
  "output_directory": "string (Absolute path to save converted files)"
}
```

### Conversion Response (Output)
```json
{
  "status": "string ('success' | 'error')",
  "converted_code": "string (Playwright JS/TS Code)",
  "file_path": "string (Absolute path where file was saved)",
  "logs": [
    "string (Conversion notes, warnings, or manual review items)"
  ]
}
```

## 2. Behavioral Rules
- **Completeness:** Convert everything.
- **Readability First:** Prioritize clear, idiomatic Playwright code over strict line-by-line translation.
- **UI Driven:** System must accept input via UI and display output in UI.
- **Dual Delivery:** Result must be shown in UI *and* saved to disk.
- **Local Intelligence:** Use Ollama API with `codellama` model for code conversion. Do not use external AI APIs.

## 3. Architectural Invariants
- **Layer 1:** Architecture (`architecture/`) - SOPs.
- **Layer 2:** Navigation - Reasoning.
- **Layer 3:** Tools (`tools/`) - Deterministic Python scripts (calling Ollama).
- **Data-First Rule:** Coding only begins once "Payload" shape is confirmed.
- **Self-Annealing:** Analyze error -> Patch script -> Update Architecture.
