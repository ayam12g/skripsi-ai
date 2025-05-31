import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, major, method, university } = req.body;

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Buat skripsi akademik formal dengan topik "${topic}" jurusan ${major}, metode penelitian ${method || "deskriptif"}, Universitas ${university}. Minimal 5000 kata, struktur jelas, BAB I sampai Daftar Pustaka.`;

    const completion = await openai.createChatCompletion({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8192,
      temperature: 0.7,
    });

    res.status(200).json({ text: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ text: "Gagal menghasilkan skripsi" });
  }
}
