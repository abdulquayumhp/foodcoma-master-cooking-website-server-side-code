const express = require("express");
const cors = require("cors");
require("colors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const jwt = require("jsonwebtoken");

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

// function verifyUser(req, res, next) {
// 	const authHeader = req.headers.authorization;
// 	// console.log(authHeader);
// 	if (!authHeader) {
// 		return res.status(401).send({ message: "bag" });
// 	}
// 	const token = authHeader.split(" ")[1];
// 	jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
// 		const boc = (req.decoded = decoded);
// 		// console.log(boc);
// 		next();
// 	});
// }

// app.post("/jwt", async (req, res) => {
// 	const user = req.body;
// 	const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
// 	res.send({ token });
// });

app.post("/service", async (req, res) => {
	try {
		console.log(req.body);
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
		const serviceCard = await cursor.sort({ _id: -1 }).limit(3).toArray();
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
		const result = await user.sort({ _id: -1 }).toArray();
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

app.get("/myReviews", async (req, res) => {
	let query = {};
	// console.log(query);
	if (req.query.email) {
		query = {
			email: req.query.email,
		};
	}
	const cursor = CookReviewCollection.find(query);
	// console.log(cursor);
	const result = await cursor.toArray();
	// console.log(result);
	res.send(result);
});

// app.get("/myReview", verifyEmail, async (req, res) => {
// 	console.log(req.query);
// 	const decoded = req.decoded;
// 	if (decoded.email !== req.query.email) {
// 		res.status(403).send({ message: "unauthorized access" });
// 	}
// 	let query = {};
// 	if (req.query.email) {
// 		query = {
// 			email: req.query.email,
// 		};
// 	}
// 	const cursor = CookReviewCollection.find(query);
// 	const result = await cursor.sort({ _id: -1 }).toArray();
// 	console.log(result);
// 	res.send(result);
// });

app.delete("/delateReview/:id", async (req, res) => {
	const { id } = req.params;
	// console.log(id);
	const query = { _id: ObjectId(id) };
	// console.log(query);
	const result = await CookReviewCollection.deleteOne(query);
	res.send(result);
});

app.get("/users/:id", async (req, res) => {
	const { id } = req.params;
	// console.log(id);
	const query = { _id: ObjectId(id) };
	// console.log(query);
	const user = await CookReviewCollection.findOne(query);
	// console.log(user);
	res.send(user);
});

app.put("/users/:id", async (req, res) => {
	const { id } = req.params;
	const filter = { _id: ObjectId(id) };
	const user = req.body;
	const option = { upsert: true };
	const updatedUser = {
		$set: {
			rating: user.rating,
			shortText: user.shortText,
			detailsReview: user.detailsReview,
		},
	};
	const result = await CookReviewCollection.updateOne(
		filter,
		updatedUser,
		option
	);
	res.send(result);
	// console.log(user);
	// console.log(result);
});

app.get("/", (req, res) => {
	res.send("server running sorry");
});

app.listen(port, () => {
	console.log({ port });
});
