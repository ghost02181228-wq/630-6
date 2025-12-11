import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, never expose API keys on the client side.
// This should be proxied through a backend (e.g., Firebase Functions).
// For this demo, we assume the user provides the key via environment variable or prompt.
const API_KEY = process.env.API_KEY || ''; 

let genAI: GoogleGenAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenAI({ apiKey: API_KEY });
}

export const getFinancialAdvice = async (
  financialSummary: string
): Promise<string> => {
  if (!genAI) {
      // Fallback if no key is present in environment for the demo
      return "請配置 Gemini API Key 以獲得 AI 財務分析建議。目前無法連接到 AI 服務。";
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      作為一位專業的個人財務顧問，請根據以下財務數據摘要提供簡短、具體的理財建議。
      請關注資產配置、風險管理以及收支狀況。使用繁體中文回答。

      財務數據摘要:
      ${financialSummary}
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "無法生成建議。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務暫時無法使用，請稍後再試。";
  }
};