import { gql } from 'apollo-server-express'

import todoSchema from './todo'
import commentSchema from './comment'

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`

export default [linkSchema, todoSchema, commentSchema]
