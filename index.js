const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.port || 5000;

app.get("/", (req, res) => {
	res.send("server running");
});

app.listen(port, () => {
	console.log({ port });
});