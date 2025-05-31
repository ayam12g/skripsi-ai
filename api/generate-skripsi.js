export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, major, method, university } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",  {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Buat skripsi akademik formal dengan topik "${topic}" jurusan ${major}, metode penelitian ${method || "deskriptif"}, Universitas ${university}. Minimal 5000 kata, struktur jelas, BAB I sampai Daftar Pustaka.`,
          }
        ],
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Tidak ada hasil dari API";

    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Gagal menghasilkan skripsi" });
  }
}
