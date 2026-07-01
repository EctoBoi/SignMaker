import express from "express";
import bassproRouter from "./routes/basspro.js";

const app = express();
app.use(express.json());

app.use("/api/basspro", bassproRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist"));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
