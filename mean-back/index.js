const { MongoClient, ObjectId, BSON } = require("mongodb");
const { BadRequestError, NotFoundError } = require("./custom-errors");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const mongoCLient = new MongoClient(process.env.DB_CONNECTION_STRING);
const products = mongoCLient.db("Database-0").collection("Products");

app.use(cors());
app.use(express.json());

app.get("/api/products", async (request, response) => {
  const cursor = products.find();
  const data = await cursor.toArray();
  return response.status(200).send(data);
});

app.post("/api/products", async (request, response) => {
  const { name, description, price } = request.body;
  let error;

  if (!name) {
    error = new BadRequestError(
      "Request is missing name of product to be added."
    );
  }

  if (!description) {
    error = new BadRequestError(
      "Request is missing description of product to be added."
    );
  }

  if (!price) {
    error = new BadRequestError(
      "Request is missing price of product to be added."
    );
  }

  if (error) {
    return next(error);
  }

  const newProduct = {
    name,
    description,
    price,
  };

  const dbResponse = await products.insertOne(newProduct);

  if (dbResponse.acknowledged) {
    console.log("Added product to database", newProduct);
    return response
      .status(201)
      .json({ message: "Successfully added product to database." });
  } else {
    console.log("Failed to add product to database", newProduct);
    return response
      .status(500)
      .json({ message: "Failed to add product to database." });
  }
});

app.delete("/api/products/:id", async (request, response, next) => {
  const id = request.params.id;

  if (!id) {
    const error = new BadRequestError(
      "Request is missing ID of product to be deleted."
    );
    return next(error);
  }

  try {
    const objectId = new ObjectId(id);
    const dbResponse = await products.deleteOne({ _id: objectId });

    if (dbResponse.deletedCount === 0) {
      const error = new NotFoundError(
        "A product with provided ID was not found. No records were deleted."
      );
      return next(error);
    }

    if (dbResponse.acknowledged && dbResponse.deletedCount > 0) {
      console.log(`Deleted product with ID ${id}.`);
      return response.sendStatus(204); // 204 No content (empty body).
    } else {
      console.log(`Failed to delete product with ID ${id}.`);
      return response
        .status(500)
        .json({ message: "Failed to delete product from database." });
    }
  } catch (error) {
    return next(error);
  }
});

// Error handling middleware.
app.use((error, request, response, next) => {
  if (error instanceof BSON.BSONError) {
    return response
      .status(400)
      .json({ error: "ID provided by request is not valid." });
  }

  return response.status(error.statusCode).json({ error: error.message });
});

// Clean up after receiving interrupt signal.
process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await mongoCLient.close();
  console.log("Exiting...");
  process.exit();
});

// Connect to database, then start Express server.
console.log("Attempting connection to database...");
mongoCLient
  .connect()
  .then(() => {
    console.log("Connection to database successful.");
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server running on port ${process.env.SERVER_PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });
