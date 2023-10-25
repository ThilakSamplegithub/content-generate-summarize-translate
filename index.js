const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors=require("cors")
const app = express();
app.use(express.json());
app.use(cors())
app.get("/", (req, res) => {
  res.status(201).send("Welcome, see endpoints");
});

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

app.post('/generate-text', async (req, res) => {
  try {
    const { prompt, max_tokens } = req.body;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data.choices[0].message.content,"is response")
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.message,"is error");
    res.status(500).json({ error: 'An error occurred while generating text.' });
  }
});

app.post('/summarize-text', async (req, res) => {
  try {
    const { text, max_tokens } = req.body;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Summarize the following text: ${text}` }
      ],
      max_tokens,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'An error occurred while summarizing text.' });
  }
});

app.post('/translate-text', async (req, res) => {
  try {
    const { text, target_language } = req.body;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Translate the following text to ${target_language}: ${text}` }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'An error occurred while translating text.' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
