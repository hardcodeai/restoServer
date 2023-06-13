const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const { populateData } = require('./populateDummyData')
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/restaurant_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  populateData()
});

// Define GraphQL schema
const schema = buildSchema(`
  type Restaurant {
    _id: ID!
    name: String!
    dishes: [MenuItem!]
    image: String
  }

  type MenuItem {
    _id: ID!
    name: String!
    price: Float!
    quantity: Int
    image: String
  }

  type Cart {
    _id: ID!
    items: [MenuItem!]!
  }

  type Query {
    searchRestaurants(query: String!): [Restaurant!]
    getRestaurantDetails(restaurantId: ID!): Restaurant!
    getCart(cartId: ID, userId: ID): Cart!
    calculateTotalBill: Float!
  }

  type Mutation {
    addToCart(userId: ID, cartId: ID, menuItemId: ID!): Cart!
    updateItemQuantity(cartId: ID!, menuItemId: ID!, quantity: Int!): Cart!
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

app.use(cors());
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
app.listen(3200, () => {
  console.log('Server running on http://localhost:3200/graphql');
});
