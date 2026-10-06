import axios from "axios";

export const generateMarketSummary = async (market) => {
  const prompt = `
Give me a concise market analysis.

Market Name: ${market.name}
Description: ${market.description}
Category: ${market.category}
Region: ${market.region}
Growth Rate: ${market.growthRate}%

Top Players: ${market.players?.map((player) => player.companyName).join(", ")}

Return:
- Short market summary
- Key opportunities
- Key risks
`;

  const groqApiUrl =
    process.env.GROQ_API_URL ||
    "https://api.groq.com/openai/v1/chat/completions";

  const response = await axios.post(
    groqApiUrl,
    {
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
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
    },
  );

  return response.data.choices[0].message.content;
};

export const generateCompetitorAnalysis = async (market) => {
  const players = market.players.map((player) => player.companyName).join(", ");

  const prompt = `
Act as a business analyst.

Analyze the competitive landscape of the following market.

Market: ${market.name}
Category: ${market.category}
Region: ${market.region}
Growth Rate: ${market.growthRate}%

Major Players:
${players}

Provide:

1. Major competitors
2. Competitive advantages
3. Market positioning
4. Emerging opportunities
5. Competitive risks

Keep the analysis concise and practical.
`;

  const groqApiUrl =
    process.env.GROQ_API_URL ||
    "https://api.groq.com/openai/v1/chat/completions";

  const response = await axios.post(
    groqApiUrl,
    {
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
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
    },
  );

  return response.data.choices[0].message.content;
};
