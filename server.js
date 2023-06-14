const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const authors = [
  {
    id: 1,
    name: "William Shakespeare",
  },
  {
    id: 2,
    name: "Jane Austen",
  },
  {
    id: 3,
    name: "Ernest Hemingway",
  },
];

const books = [
  // Books by William Shakespeare
  {
    id: 1,
    name: "Romeo and Juliet",
    authorid: 1,
  },
  {
    id: 2,
    name: "Hamlet",
    authorid: 1,
  },
  {
    id: 3,
    name: "Macbeth",
    authorid: 1,
  },

  // Books by Jane Austen
  {
    id: 4,
    name: "Pride and Prejudice",
    authorid: 2,
  },
  {
    id: 5,
    name: "Sense and Sensibility",
    authorid: 2,
  },
  {
    id: 6,
    name: "Emma",
    authorid: 2,
  },

  // Books by Ernest Hemingway
  {
    id: 7,
    name: "The Old Man and the Sea",
    authorid: 3,
  },
  {
    id: 8,
    name: "For Whom the Bell Tolls",
    authorid: 3,
  },
  {
    id: 9,
    name: "A Farewell to Arms",
    authorid: 3,
  },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book writter by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorid: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorid);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => author.id === book.authorid);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "A list of books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "A list of authors",
      resolve: () => authors,
    },
    message: {
      type: GraphQLString,
      resolve: () => "HelloWorld",
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => console.log("Server is running"));
