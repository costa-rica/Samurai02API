async function getRagContext(question, k) {
  console.log("---- in getRagContext -----");
  console.log("question: ", question);
  console.log("k: ", k);
  // Trigger rag context update with call to rag API build
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

  const data = await response.json();
  // console.log("---- what is this ? ----");
  // console.log("response: ", JSON.stringify(data, null, 2));
  return data.prompt;
}

module.exports = {
  getRagContext,
};
