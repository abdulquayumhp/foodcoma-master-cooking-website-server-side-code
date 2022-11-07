const express = require("express");
const cors = require("cors");
require("colors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.port || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wtn02jv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function dbConnect() {
	try {
		await client.connect();
		console.log("Database Connected".cyan);
	} catch (error) {
		console.log(error.name.bgRed, error.message.bold.yellow, error.stack);
	}
}
dbConnect();

const CookServiceCollection = client.db("cookService").collection("CookCard");

app.post("/service", async (req, res) => {
	try {
		// console.log(req.body);
		const result = await CookServiceCollection.insertOne(req.body);
		if (result.insertedId) {
			res.send({
				success: true,
				message: `successfully created the ${req.body.dishesName}`,
			});
		} else {
			res.send({
				success: false,
				message: "could't create the product",
			});
		}
	} catch (error) {
		console.log(error.dishesName.bgRed, error.message.bold);
		res.send({
			success: false,
			error: error.message,
		});
	}
});

app.get("/servicesCardLimit", async (req, res) => {
	try {
		const cursor = await CookServiceCollection.find({});
		const serviceCard = await cursor.limit(3).toArray();
		res.send({
			success: true,
			message: `Successfully got the data`,
			data: serviceCard,
		});
	} catch (error) {
		console.log(error.name.bgRed, error.message.bold);
		res.send({
			success: false,
			error: error.message,
		});
	}
});

app.get("/", (req, res) => {
	res.send("server running");
});

app.listen(port, () => {
	console.log({ port });
});
