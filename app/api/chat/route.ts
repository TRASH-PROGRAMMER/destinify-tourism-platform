import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Inicializamos el cliente. Automáticamente tomará la variable GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensajes inválido" }, { status: 400 });
    }

    // Convertimos los mensajes del frontend al formato que requiere Gemini
    // El frontend envía: { role: "user" | "assistant", content: "..." }
    // Gemini requiere: { role: "user" | "model", parts: [{ text: "..." }] }
    const history = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const MAX_RETRIES = 3;
    let response;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: history,
          config: {
            systemInstruction: `Eres "Destinify", un asistente experto en turismo exclusivo de Ecuador. 
            Tu tono debe ser amable, entusiasta y altamente útil. 
            Recomienda destinos, planifica itinerarios y menciona sitios turísticos ecuatorianos. 
            Usa formato Markdown para hacer tu texto fácil de leer (usa negritas para nombres de lugares).
            Sé conciso, tus respuestas no deben exceder los 3 o 4 párrafos cortos. No inventes lugares que no existan en Ecuador.`
          }
        });
        break; // Éxito, salimos del bucle
      } catch (err: any) {
        attempt++;
        const errMsg = err?.message || String(err);
        // Verificar si es un error de sobrecarga (503) o demasiadas peticiones (429)
        if ((errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) && attempt < MAX_RETRIES) {
          console.warn(`[Intento ${attempt}/${MAX_RETRIES}] Gemini API ocupada, reintentando en ${attempt * 1.5}s...`);
          await delay(attempt * 1500); // 1.5s, 3s
        } else {
          throw err; // Lanzar si es otro tipo de error o ya excedimos intentos
        }
      }
    }

    // Usar optional chaining por seguridad
    return NextResponse.json({ 
      content: response?.text || "Lo siento, la respuesta de la IA llegó vacía."
    });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ 
      error: "Ocurrió un error al procesar tu solicitud con la IA.",
      details: error.message
    }, { status: 500 });
  }
}
