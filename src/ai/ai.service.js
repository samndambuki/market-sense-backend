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

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
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
