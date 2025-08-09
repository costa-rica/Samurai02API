var express = require("express");
var router = express.Router();
const { User } = require("samurai02db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { checkBodyReturnMissing } = require("../modules/common");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ storage: multer.memoryStorage() });

// POST /data/receive-structured-data
router.post("/receive-structured-data", upload.single("file"), async (req, res) => {
  try {
    console.log("- in POST /data/receive-structured-data");

    // Validate env var
    const targetDir = process.env.PATH_TO_RAG_CONTEXT_DATA;
    if (!targetDir) {
      return res.status(500).json({ ok: false, error: "PATH_TO_RAG_CONTEXT_DATA env var is not set." });
    }

    // Validate that a file was provided
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file provided. Expecting field name 'file'." });
    }

    // Basic CSV validation by mimetype and filename extension
    const { originalname, mimetype, buffer } = req.file;
    const lower = (originalname || "").toLowerCase();
    const isCsvMime = mimetype === "text/csv" || mimetype === "application/vnd.ms-excel";
    const isCsvExt = lower.endsWith(".csv");

    if (!(isCsvMime || isCsvExt)) {
      return res.status(400).json({ ok: false, error: "Only CSV files are accepted." });
    }

    // Ensure directory exists
    fs.mkdirSync(targetDir, { recursive: true });

    const destPath = path.join(targetDir, "user_data.csv");

    // Write file to disk
    fs.writeFileSync(destPath, buffer);


    // Trigger rag context update with call to rag API build 
  const response = await fetch("http://localhost:5050/rag/build-index", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });



    return res.json({ ok: true, message: "CSV saved. Rag context updated.", path: destPath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Internal server error." });
  }
});

// GET /data/does-context-file-exist
router.get("/does-context-file-exist", async (req, res) => {
  try {
    console.log("- in GET /data/does-context-file-exist");

    const targetDir = process.env.PATH_TO_RAG_CONTEXT_DATA;
    if (!targetDir) {
      return res.status(500).json({ ok: false, error: "PATH_TO_RAG_CONTEXT_DATA env var is not set." });
    }

    const destPath = path.join(targetDir, "user_data.csv");

    if (fs.existsSync(destPath)) {
      return res.json({ ok: true, exists: true });
    } else {
      return res.json({ ok: true, exists: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Internal server error." });
  }
});

// DELETE /data/delete-context-file
router.delete("/delete-context-file", async (req, res) => {
  try {
    console.log("- in DELETE /data/delete-context-file");

    const targetDir = process.env.PATH_TO_RAG_CONTEXT_DATA;
    if (!targetDir) {
      return res.status(500).json({ ok: false, error: "PATH_TO_RAG_CONTEXT_DATA env var is not set." });
    }

    const destPath = path.join(targetDir, "user_data.csv");

    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
      return res.json({ ok: true, message: "Context file deleted." });
    } else {
      return res.json({ ok: true, message: "Context file does not exist." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Internal server error." });
  }
});

module.exports = router;

    