const { app } = require("@azure/functions");
const mongoClient = require("../shared/mongo");
const { ObjectId } = require("mongodb");
app.http("updateBook", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "books/{id}",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
      await mongoClient.connect();
      const { id } = request.params;
      const updatedBookDoc = await request.json();
      const database = await mongoClient.db(process.env.MONGODB_ATLAS_DATABASE);

      const Book = database.collection("books");

      const updatedBook = await Book.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedBookDoc }
      );
      const updatedBookRes = await Book.findOne({
        _id: new ObjectId(updatedBook._id),
      });
      mongoClient.close();
      return {
        status: 200,
        jsonBody: updatedBookRes,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: error.message,
      };
    }
  },
});
