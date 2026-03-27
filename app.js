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
app.post("/ai/market-summary", async (req, res) => {
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
        //creativity level
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
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

//api endpoint that asks ai model to analyse competitors in the market
app.post("/ai/competitor-analysis", async (req, res) => {
  try {
    const { market } = req.body;
    const prompt = `
    Act as a business analyst.
    Analyse the competitive landscape of ${market} market.
    Provide : 
    1. Major companies
    2. Competitive advantages
    3. Market positioning
    4. Emerging Competitors
    `;
    const response = await axios.post(
      //use grok api
      //allows you to use open source ai models
      "https://api.groq.com/openai/v1/chat/completions",
      {
        //which ai brain to use
        model: "llama-3.1-8b-instant",
        messages: [
          {
            //get message from user
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        //for security
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const aiText = response.data.choices[0].message.content;
    res.json({
      analysis: aiText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI Competitor Analysis Failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
