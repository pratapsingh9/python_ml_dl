const cluster = require("cluster");
const os = require("os");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  return res.json({
    main: "Hello World!",
    worker: `msg from ${process.pid}`, // Identifying the worker handling the request
  });
});

app.get("/name", (req, res) => {
  return res.json({
    name: "Rohit",
  });
});

// Each worker listens on the same port
app.listen(3000, () => {
  console.log(`App listening on port 3000! Worker ${process.pid}`);
});
