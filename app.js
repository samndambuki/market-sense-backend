require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "API is running" });
});

/* AI Market Summary Endpoint */
app.post("/api/ai/market-summary", async (req, res) => {
  try {
    const market = req.body;

    const prompt = `
Give me a concise market analysis.

Market Name: ${market.name}
Description: ${market.description}
Category: ${market.category}
Region: ${market.region}
Growth Rate: ${market.growthRate}%

Top Players: ${market.metrics?.topPlayers?.join(", ")}

Return:
- Short market summary
- Key opportunities
- Key risks
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    res.json({
      success: true,
      analysis: aiText,
    });
  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
