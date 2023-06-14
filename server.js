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
  {
    id: 4,
    name: "Fyodor Dostoevsky",
  },
  {
    id: 5,
    name: "Charlotte Bronte",
  },
  {
    id: 6,
    name: "Mark Twain",
  },
  {
    id: 7,
    name: "Leo Tolstoy",
  },
  {
    id: 8,
    name: "Virginia Woolf",
  },
  {
    id: 9,
    name: "George Orwell",
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

  // Books by Fyodor Dostoevsky
  {
    id: 10,
    name: "Crime and Punishment",
    authorid: 4,
  },
  {
    id: 11,
    name: "The Brothers Karamazov",
    authorid: 4,
  },
  {
    id: 12,
    name: "Notes from Underground",
    authorid: 4,
  },

  // Books by Charlotte Bronte
  {
    id: 13,
    name: "Jane Eyre",
    authorid: 5,
  },
  {
    id: 14,
    name: "Villette",
    authorid: 5,
  },
  {
    id: 15,
    name: "Shirley",
    authorid: 5,
  },

  // Books by Mark Twain
  {
    id: 16,
    name: "The Adventures of Huckleberry Finn",
    authorid: 6,
  },
  {
    id: 17,
    name: "The Adventures of Tom Sawyer",
    authorid: 6,
  },
  {
    id: 18,
    name: "A Connecticut Yankee in King Arthur's Court",
    authorid: 6,
  },

  // Books by Leo Tolstoy
  {
    id: 19,
    name: "War and Peace",
    authorid: 7,
  },
  {
    id: 20,
    name: "Anna Karenina",
    authorid: 7,
  },
  {
    id: 21,
    name: "The Death of Ivan Ilyich",
    authorid: 7,
  },

  // Books by Virginia Woolf
  {
    id: 22,
    name: "To the Lighthouse",
    authorid: 8,
  },
  {
    id: 23,
    name: "Mrs Dalloway",
    authorid: 8,
  },
  {
    id: 24,
    name: "Orlando",
    authorid: 8,
  },

  // Books by George Orwell
  {
    id: 25,
    name: "1984",
    authorid: 9,
  },
  {
    id: 26,
    name: "Animal Farm",
    authorid: 9,
  },
  {
    id: 27,
    name: "Down and Out in Paris and London",
    authorid: 9,
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
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "A list of books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
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

const RootMutationType = new GraphQLObjectType({
  name: "mutation",
  description: "root mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorid: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => console.log("Server is running"));
