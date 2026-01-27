const OLLAMA_URL = 'http://localhost:5000/api/chat';

export const generateTestCases = async (prompt, model = 'llama3.2') => {
  const systemPrompt = `You are a professional QA Engineer. 
  Your task is to generate detailed JSON test cases based on the user's feature description.
  You MUST return ONLY valid JSON.
  
  Expected JSON schema:
  {
    "testCases": [
      {
        "id": "TC_001",
        "title": "Short Title",
        "description": "What is being tested",
        "preConditions": ["Condition 1"],
        "steps": ["Step 1", "Step 2"],
        "expectedResult": "Expected outcome",
        "priority": "High"
      }
    ]
  }`;

  const payload = {
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    format: "json",
    stream: false,
    options: {
      temperature: 0.7
    }
  };

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        // Backend sends { error: "..." } or { message: "..." }
        errorMsg = errorData.error || errorData.message || JSON.stringify(errorData);
        console.error("Backend Error Details:", errorData);
      } catch (parseError) {
        console.warn("Could not parse backend error JSON:", parseError);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    try {
      // If the backend returns the structure directly (not wrapped in 'message.content')
      // We might need to adjust based on what server.js sends.
      // But assuming server.js sends Ollama response structure:
      const content = data.message?.content || JSON.stringify(data);
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse inner JSON", data);
      if (typeof data === 'object') return data;
      throw new Error("Invalid JSON received from model");
    }

  } catch (error) {
    console.error("Ollama Service Error:", error);
    throw error;
  }
};
