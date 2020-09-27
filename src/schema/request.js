const { gql } = require('apollo-server-express');

module.exports = gql`

    # subs
    extend type Subscription{

    }
    # custom types
    type Request {
        id: ID!
        requestedBy: User!
        product: Product!
        createdAt: String!
        requestStatus: String!
    }
    #input types


    

`;
