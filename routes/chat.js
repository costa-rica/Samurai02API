var express = require("express");
var router = express.Router();
const { User } = require("samurai02db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { checkBodyReturnMissing } = require("../modules/common");

/* GET users listing. */
router.get("/test", function (req, res, next) {
  res.send("respond with a resource");
});

// import Anthropic from "@anthropic-ai/sdk";
const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory store for demo (use Redis/Postgres in prod)
const sessions = {};

router.post("/", async (req, res) => {
  const { sessionId, userMessage } = req.body;

  // 1) Retrieve session history
  let history = sessions[sessionId] || [];

//   // 2) Run RAG retrieval for the latest question
//   const ragContext = await getRagContext(userMessage);

  // 3) Append new user turn with RAG context
  history.push({
    role: "user",
    // content: `Here is some relevant context:\n${ragContext}\n\nQuestion: ${userMessage}`
    content: userMessage
  });

  // 4) Call Claude
  const completion = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: history
  });

  // 5) Save assistant reply to history
  history.push({ role: "assistant", content: completion.content[0].text });
  sessions[sessionId] = history;

  res.json({ reply: completion.content[0].text });
});

// GET /request-available-models - List available Anthropic models
router.get("/request-available-models", async (req, res) => {
    try {
      const modelsResponse = await anthropic.models.list();
      res.json({ models: modelsResponse.data });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch models", details: err.message });
    }
  });


module.exports = router;
