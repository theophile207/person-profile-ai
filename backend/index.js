import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/summarize", async (req, res) => {
  try {
    const profile = req.body;

    const prompt = `
Voici des informations publiques sur une personne :
${JSON.stringify(profile, null, 2)}

Fais :
- un résumé professionnel
- ses centres d’intérêt
- son ton de communication
- ses forces probables
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ summary: response.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "Erreur IA" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
