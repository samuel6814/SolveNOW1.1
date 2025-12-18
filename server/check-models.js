require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("❌ No API Key found in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  console.log("🔍 Querying Google for available models...");

  try {
    // Using Node.js native fetch (no axios needed)
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const models = data.models;

    console.log("\n✅ AVAILABLE MODELS:");
    console.log("====================");
    models.forEach(m => {
        // Only show models that can generate text/content
        if (m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`- ${m.name.replace('models/', '')}`);
        }
    });
    console.log("====================");

  } catch (error) {
    console.error("❌ Failed to list models:", error.message);
  }
}

listModels();