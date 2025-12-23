
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Helper to convert URL to Base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/xyz;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    return "";
  }
};

export const getStylistAdvice = async (userQuery: string): Promise<string> => {
  if (!aiClient) {
    return "抱歉，目前 AI 造型師暫時無法使用（缺少 API 金鑰）。";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: `你是 "Lumi"，Twýst 品牌的高級、親切且優雅的時尚造型師。
        你的目標是幫助顧客挑選服裝、搭配飾品，並讓他們感到自信。
        請使用繁體中文回答。
        保持你的建議簡潔（100字以內）、充滿鼓勵且具時尚感。
        如果用戶詢問產品，請推薦符合我們商店美學的一般項目，如「真絲襯衫」、「金飾」或「真皮包包」。`,
      }
    });
    
    return response.text || "我正在為您思考完美的造型...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "目前連線到時尚主機時遇到一點問題，請稍後再試！";
  }
};

export const generateTryOn = async (
  userPhotoBase64: string, 
  productImageUrl: string, 
  productCategory: string
): Promise<string | null> => {
  if (!aiClient) return null;

  try {
    // 1. Convert product image URL to base64
    const productBase64 = await urlToBase64(productImageUrl);
    if (!productBase64) throw new Error("Failed to load product image");

    // 2. Prepare user photo (strip prefix if exists)
    const userBase64Data = userPhotoBase64.includes(',') 
      ? userPhotoBase64.split(',')[1] 
      : userPhotoBase64;

    // 3. Call Gemini 2.5 Flash Image for editing/generation
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: userBase64Data
            }
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: productBase64
            }
          },
          {
            text: `Expert photo editing task. 
            Image 1 is the user. Image 2 is the fashion product (${productCategory}).
            Goal: Digitally dress the user in Image 1 with the product from Image 2.
            
            Instructions:
            1. Identify the user's pose and body shape in Image 1.
            2. Replace the user's current ${productCategory} (or equivalent area) with the product from Image 2.
            3. Adjust lighting, shadows, and folds to make it look realistic.
            4. Keep the user's face, hair, and background exactly the same.
            5. If it's a dress, replace the whole outfit. If it's a shirt, replace the top.
            
            Return ONLY the edited image.`
          }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const base64ImageBytes = response.candidates[0].content.parts[0].inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Try-On Error:", error);
    return null;
  }
};
