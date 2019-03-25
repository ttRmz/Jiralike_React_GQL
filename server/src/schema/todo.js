import { gql } from 'apollo-server-express'

export default gql`
  enum State {
    TODO
    PROGRESS
    REVIEW
    DONE
    DISABLED
  }

  extend type Query {
    todos: [Todo!]
    todo(id: ID!): Todo!
  }

  extend type Mutation {
    deleteTodo(id: ID!): Todo
    createTodo(title: String!, content: String): Todo
    updateTodo(id: ID!, title: String, content: String, state: State!): Todo
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    comments: [Comment]
    state: State!
    createdAt: Date!
    updatedAt: Date
  }
`
