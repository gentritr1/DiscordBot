const openai = require("openai");
require("dotenv").config();

// TOOO: IMPLEMENT LATER ON, CHECK QUOTAS/TOKENS AVAILABILITY  AND COSTS!
const execute = async (message, args) => {
  const query = args.join(" ");

  /*// Initialize the OpenAI API client with your API key
  const client = new openai({
    apiKey: process.env.OPEN_AI_KEY,
  });

  try {
    const response = await client.completions.create({
      engine: "text-davinci-003",
      prompt: query,
      max_tokens: 100,
    });

    const gptResponse = response.choices[0].text.trim();
    message.reply(gptResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    message.reply("An error occurred while processing your request.");
  }*/

  message.reply("Underdevelopment due to exceeding quotas for API!");
};

module.exports = {
  name: "ask",
  description:
    "!ask <insert text>, it will use GPT API to give you its response , under development!",
  execute,
};
