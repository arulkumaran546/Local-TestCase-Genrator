from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Ensure tools directory is in path
sys.path.append(os.path.join(os.getcwd(), 'tools'))
from converter_engine import SeleniumToPlaywrightConverter

app = FastAPI(title="Selenium to Playwright Converter API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConvertRequest(BaseModel):
    source_code: str
    target_language: str = "typescript"
    output_directory: str = ".tmp/output"

class ConvertResponse(BaseModel):
    status: str
    converted_code: str
    file_path: str = ""
    logs: list[str]

@app.post("/convert", response_model=ConvertResponse)
async def convert_code(request: ConvertRequest):
    converter = SeleniumToPlaywrightConverter()
    result = converter.convert(request.source_code)
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["logs"][0])
    
    # Ensure output directory exists
    os.makedirs(request.output_directory, exist_ok=True)
    
    file_name = "converted_test.spec.ts" if request.target_language == "typescript" else "converted_test.spec.js"
    file_path = os.path.join(request.output_directory, file_name)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(result["converted_code"])
    
    return ConvertResponse(
        status="success",
        converted_code=result["converted_code"],
        file_path=os.path.abspath(file_path),
        logs=result["logs"]
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
