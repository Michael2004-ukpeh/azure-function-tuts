const { app } = require("@azure/functions");
const mongoClient = require("../shared/mongo");
app.http("getBooks", {
  methods: ["GET"],
  route: "books",
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
      await mongoClient.connect();
      const database = await mongoClient.db(process.env.MONGODB_ATLAS_DATABASE);

      const Book = database.collection("books");

      // Create New Book
      const books = await Book.find().toArray();
      mongoClient.close();
      return {
        status: 201,
        jsonBody: books,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: error.message,
      };
    }
  },
});
