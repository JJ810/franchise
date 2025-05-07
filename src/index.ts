import bodyParser from "body-parser";
import express from "express";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
