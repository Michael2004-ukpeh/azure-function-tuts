const { app } = require("@azure/functions");
const mongoClient = require("../shared/mongo");
const { ObjectId } = require("mongodb");
app.http("createBook", {
  methods: ["POST"],
  route: "books",
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
      await mongoClient.connect();
      const database = await mongoClient.db(process.env.MONGODB_ATLAS_DATABASE);

      const Book = database.collection("books");
      const { title, author, description } = await request.json();

      // Create New Book
      const newBook = await Book.insertOne({
        title,
        author,
        description,
      });
      const newBookDoc = await Book.findOne({
        _id: new ObjectId(newBook.insertedId),
      });
      mongoClient.close();

      return {
        status: 201,
        jsonBody: newBookDoc,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: error.message,
      };
    }
  },
});
