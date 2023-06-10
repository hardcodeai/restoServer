const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const { populateData } = require('./populateDummyData')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/restaurant_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  populateData()
});


// type Restaurant {
//     _id: ID!
//     name: String!
//     dishes: [MenuItem!]
//   }

// Define GraphQL schema
const schema = buildSchema(`
  type Restaurant {
    _id: ID!
    name: String!
  }

  type MenuItem {
    _id: ID!
    name: String!
    price: Float!
  }

  type Cart {
    _id: ID!
    items: [MenuItem!]!
  }

  type Query {
    searchRestaurants(query: String!): [Restaurant!]
    getMenuItems(restaurantId: ID!): [MenuItem!]!
    getCart(cartId: ID!): Cart!
    calculateTotalBill: Float!
  }

  type Mutation {
    addToCart(userId: ID!, menuItemId: ID!): MenuItem!
  }
`);

// Import resolvers
const restaurantResolvers = require('./resolvers/restaurantResolvers');
const cartResolvers = require('./resolvers/cartResolvers');

// Define root resolver
const rootResolver = {
  ...restaurantResolvers,
  ...cartResolvers,
};

// Create Express server
const app = express();

// Define GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true, // Enable GraphiQL for testing
  })
);

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/graphql');
});
