const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  
  // 'image' is of type string
  image: {
    type: String
  },
  // `title` is required and of type String
  // We do not allow duplicate articles with same title
  title: {
    type: String,
    required: true,
    unique: true,
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `comment` is an object that stores a comment id
  // The ref property links the ObjectId to the comment model
  // This allows us to populate the Article with an associated comment
  comments: [
      {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
