var express = require("express");
var router = express.Router();
const { getRagContext } = require("../modules/chat");

/* GET users listing. */
router.get("/test", function (req, res, next) {
  res.send("respond with a resource");
});

// import Anthropic from "@anthropic-ai/sdk";
const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory store for demo (use Redis/Postgres in prod)
// const messagesArray = [];

// // POST /chat - Chat with Claude
// POST /chat - Chat with Claude
router.post("/", async (req, res) => {
  const { sessionId, userMessage, messageHistoryArray } = req.body;

  console.log("- in POST /chat");
  console.log("sessionId: ", sessionId);

  let historyForClaudeArray = [];

  if (sessionId === 1) {
    // First turn: inject RAG context instead of raw user message
    const ragContext = await getRagContext(userMessage, 50);
    const newContent = `Here is some relevant context:\n${ragContext}\n\nQuestion: ${userMessage}`;

    historyForClaudeArray.push({ role: "user", content: newContent });

    // Append to the site-visible history with the display text preserved
    messageHistoryArray.push({
      id: sessionId,
      role: "user",
      content: newContent,
      messageBoxContent: userMessage,
    });
  } else {
    // Later turns: start from prior history...
    historyForClaudeArray = messageHistoryArray.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // ...and APPEND the new user turn to BOTH histories
    historyForClaudeArray.push({
      role: "user",
      content: userMessage,
    });

    messageHistoryArray.push({
      id: sessionId,
      role: "user",
      content: userMessage,
      messageBoxContent: userMessage,
    });
  }

  // Call Claude with complete history (including this new user turn)
  const completion = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: historyForClaudeArray,
  });

  if (!completion?.content?.[0]?.text) {
    console.log("No response from Claude");
    return res.json({ history: messageHistoryArray });
  }

  // Append Claude's reply with the next id
  const messageFromClaude = {
    id: sessionId + 1,
    role: "assistant",
    content: completion.content[0].text,
    messageBoxContent: completion.content[0].text,
  };

  const newMessageHistoryArrayAssistant = [
    ...messageHistoryArray,
    messageFromClaude,
  ];
  return res.json({ history: newMessageHistoryArrayAssistant });
});

// router.post("/", async (req, res) => {
//   const { sessionId, userMessage, messageHistoryArray } = req.body;

//   console.log("- in POST /chat");
//   console.log("sessionId: ", sessionId);
//   console.log("----- initial messageHistoryArray ----- ");
//   console.log(JSON.stringify(messageHistoryArray, null, 2));
//   console.log("-----  ----- ");

//   // 1) Retrieve session history
//   let historyForClaudeArray = [];

//   if (sessionId === 1) {
//     console.log("--- Adding message history ----");
//     // 2) Run RAG retrieval for the latest question
//     const ragContext = await getRagContext(userMessage, 50);
//     const newContent = `Here is some relevant context:\n${ragContext}\n\nQuestion: ${userMessage}`;

//     console.log("---- what is this ? ----");
//     console.log(newContent);
//     // 3) Append new user turn with RAG context
//     historyForClaudeArray.push({
//       role: "user",
//       content: newContent,
//       // content: userMessage
//     });
//     messageHistoryArray.push({
//       id: sessionId,
//       role: "user",
//       content: newContent,
//       messageBoxContent: userMessage,
//     });
//   } else {
//     historyForClaudeArray = messageHistoryArray.map((message) => {
//       return {
//         role: message.role,
//         content: message.content,
//       };
//     });
//   }

//   // 4) Call Claude
//   const completion = await anthropic.messages.create({
//     model: "claude-sonnet-4-20250514",
//     max_tokens: 1024,
//     messages: historyForClaudeArray,
//   });
//   console.log("----- reponse form claude ----- ");
//   if (!completion?.content[0]?.text) {
//     console.log("No response from Claude");
//     console.log(JSON.stringify(completion, null, 2));
//     return res.json({ history: messageHistoryArray });
//   } else {
//     console.log(JSON.stringify(completion.content[0].text, null, 2));
//   }

//   // 5) Save assistant reply to history
//   const messageFromClaude = {
//     id: sessionId + 1,
//     role: "assistant",
//     content: completion.content[0].text,
//     messageBoxContent: completion.content[0].text,
//   };
//   // sessions[sessionId] = history;

//   const newMessageHistoryArrayAssistant = [...messageHistoryArray];
//   // // ---- When testing, add a message from Claude ----
//   // newMessageHistoryArrayAssistant.push({
//   //   id: sessionId + 1,
//   //   role: "assistant",
//   //   content: "This is a test response from Claude",
//   //   messageBoxContent: `This is a test response from Claude ${sessionId + 1}`,
//   // });

//   newMessageHistoryArrayAssistant.push(messageFromClaude);

//   // console.log("------  Message history sent back -------");

//   // console.log(JSON.stringify(newMessageHistoryArrayAssistant, null, 2));
//   // console.log("-----  ----- ");

//   res.json({ history: newMessageHistoryArrayAssistant });
// });

// GET /request-available-models - List available Anthropic models
router.get("/request-available-models", async (req, res) => {
  try {
    const modelsResponse = await anthropic.models.list();
    res.json({ models: modelsResponse.data });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch models", details: err.message });
  }
});

module.exports = router;
