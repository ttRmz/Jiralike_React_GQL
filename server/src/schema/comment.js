import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    comments: [Comment!]
    comment(id: ID!): Comment!
  }

  extend type Mutation {
    createComment(text: String!): Comment!
    deleteComment(id: ID!): Boolean!
    updateComment(id: ID!, text: String): Comment!
  }

  type Comment {
    id: ID!
    text: String!
    todoID: ID!
    todo: Todo!
    createdAt: Date!
    updatedAt: Date
  }
`
