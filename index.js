const express = require("express");
const cors = require("cors");
require("colors");
const { MongoClient, ObjectId } = require("mongodb");
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
const CookReviewCollection = client
	.db("cookReviewCollection")
	.collection("CookReview");

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

app.get("/serviceCard", async (req, res) => {
	try {
		const cursor = await CookServiceCollection.find({});
		const result = await cursor.toArray();
		// console.log(result);
		// console.log("hello");

		res.send({
			success: true,
			message: `Successfully got the data`,
			data: result,
		});
	} catch (error) {
		console.log(error.name.bgRed, error.message.bold);

		res.send({
			success: false,
			message: error.message,
		});
	}
});

app.get("/details/:id", async (req, res) => {
	const { id } = req.params;
	// console.log(id);
	try {
		const idAdd = { _id: ObjectId(id) };
		// console.log(idAdd);
		const user = await CookServiceCollection.findOne(idAdd);
		if (!user?._id) {
			res.send({
				success: true,
				message: `User Id does't exist`,
			});
		} else {
			res.send(user);
		}
	} catch (error) {
		res.send({
			success: false,
			error: error.message,
		});
	}
});

// server to client card data load end
// server to client card data load end
// server to client card data load end

// review data to server start
// review data to server start
// review data to server start

app.post("/review", async (req, res) => {
	try {
		const result = await CookReviewCollection.insertOne(req.body);
		if (result.insertedId) {
			res.send({
				success: true,
				message: `Successfully create review`,
			});
		} else {
			res.send({
				success: false,
				message: "Couldn't create the review",
			});
		}
	} catch (error) {
		console.log(error.name);
		res.send({
			success: false,
			error: error.message,
		});
	}
});

app.get("/allReview", async (req, res) => {
	try {
		const user = await CookReviewCollection.find({});
		const result = await user.toArray();
		// console.log(result);

		res.send({
			success: true,
			message: `successfully got the data`,
			data: result,
		});
	} catch (error) {
		console.log(error.name);
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
