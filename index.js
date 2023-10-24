const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const cors=require("cors")
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors())
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome and use GPT-3.5 Turbo only, not Davinci engine");
});

app.post('/generate-text', async (req, res) => {
  try {
    const userMessage = req.body.prompt; // Assuming the prompt comes from the request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": userMessage,
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const generatedText = response.choices[0].message.content;
    return res.json({ generatedText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Text generation failed' });
  }
});
// "https://api.openai.com/v1/chat/completions"
app.post('/summarize-text', async (req, res) => {
  const text = req.body.text;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant that summarizes text:",
        },
        {
          "role": "user",
          "content": text,
        }
      ],
      temperature: 1,
      max_tokens: 150,
    });

    const summarizedText = response.choices[0].message.content;
    res.json({ summarizedText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Text summarization failed' });
  }
});

app.post('/translate', async (req, res) => {
  const text = req.body.text;
  const sourceLanguage = req.body.sourceLanguage;
  const targetLanguage = req.body.targetLanguage;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": `Translate the following text from ${sourceLanguage} to ${targetLanguage}:`,
        },
        {
          "role": "user",
          "content": text,
        }
      ],
      temperature: 1,
      max_tokens: 150,
    });

    const translatedText = response.choices[0].message.content;
    res.json({ translatedText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Text translation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
