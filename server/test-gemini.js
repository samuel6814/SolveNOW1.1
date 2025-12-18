require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
  console.log("1. Checking API Key...");
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.error("❌ Error: No API Key found in .env");
    return;
  }
  console.log("   Key found (starts with):", key.substring(0, 8) + "...");

  console.log("2. Attempting to connect to Google...");
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Say 'Hello from Google' if you can hear me.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Google responded:");
    console.log("   Response:", text);
    
  } catch (error) {
    console.error("❌ CONNECTION FAILED");
    console.error("   Error Name:", error.name);
    console.error("   Error Message:", error.message);
    if (error.cause) console.error("   Cause:", error.cause);
  }
}

testConnection();