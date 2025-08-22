'use strict';

const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY 
    , baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

router.post('/summary', async function (req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
      messages: [
        { role: 'system', content: 'Buat ringkasan deskripsi brand ini.' },
        { role: 'user', content: text },
      ],
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI API error' });
  }
});

module.exports = router;
