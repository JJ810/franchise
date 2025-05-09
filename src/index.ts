import bodyParser from "body-parser";
import express from "express";
import hierarchyRoutes from "./routes/hierarchyRoutes";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/api", hierarchyRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
