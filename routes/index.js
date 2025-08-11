var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 🔹 POST /test: Test route
router.post("/test", async (req, res) => {
  const { question, k } = req.body;

  // Send Post request to chat route
  const response = await fetch(
    `${process.env.URL_BASE_API_RAG}/rag/build-prompt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, k }),
    }
  );

  try {
    const data = await response.json();
    console.log(data);
    // res.json({ result:true, question:data.question, k:data.k });
    res.json({ result: true, prompt: data.prompt });
  } catch (error) {
    console.log(error);
    res.json({ result: false, error });
  }
});

module.exports = router;
