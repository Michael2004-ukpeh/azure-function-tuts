const { app } = require("@azure/functions");
const mongoClient = require("../shared/mongo");
const { ObjectId } = require("mongodb");
app.http("deleteBook", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "books/{id}",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
      await mongoClient.connect();
      const { id } = request.params;

      const database = await mongoClient.db(process.env.MONGODB_ATLAS_DATABASE);

      const Book = database.collection("books");

      const deletedBook = await Book.findOneAndDelete({
        _id: new ObjectId(id),
      });
      mongoClient.close();
      return {
        status: 200,
        jsonBody: deletedBook,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: error.message,
      };
    }
  },
});
