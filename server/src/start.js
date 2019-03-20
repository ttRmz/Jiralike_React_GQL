require('dotenv').config()
import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import { prepare, getDate } from '../utils/index'

const app = express()

app.use(cors())
const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = process.env.MONGO_DB_URL

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    const Todos = db.collection(process.env.TODOS_COLLECTION_NAME)
    const Comments = db.collection(process.env.COMMENTS_COLLECTION_NAME)
    const typeDefs = [
      `
      enum State {
        TODO
        PROGRESS
        REVIEW
        DONE
      }
      
      type Query {
        getTodo(_id: String): Todo!
        getAllTodos: [Todo]
        getComment(_id: String!): Comment!
        getAllComments: [Comment]
      }

      type Todo {
        _id: ID!
        title: String!
        content: String
        comments: [Comment]
        created: String!
        state: State!
        lastUpdate: String
      }

      type Comment {
        _id: ID!
        todoId: ID!
        content: String
        todo: Todo!
        created: String!
      }

      type Mutation {
        deleteTodo(todoId: ID!): Todo
        createTodo(title: String!, content: String): Todo
        createComment(todoId: ID!, content: String!): Comment
        updateState(todoId: ID!, state: State!): Todo
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `,
    ]

    const resolvers = {
      Query: {
        getTodo: async (root, { _id }) => {
          return prepare(await Todos.findOne(ObjectId(_id)))
        },
        getAllTodos: async () => {
          return (await Todos.find({}).toArray()).map(prepare)
        },
        getComment: async (root, { _id }) => {
          return prepare(await Comments.findOne(ObjectId(_id)))
        },
        getAllComments: async () => {
          return (await Comments.find({}).toArray()).map(prepare)
        },
      },
      Todo: {
        comments: async ({ _id }) => {
          return (await Comments.find({ todoId: _id }).toArray()).map(prepare)
        },
      },
      Comment: {
        todo: async ({ todoId }) => {
          return prepare(await Todos.findOne(ObjectId(todoId)))
        },
      },
      Mutation: {
        createTodo: async (root, { title, content }, context, info) => {
          const res = await Todos.insertOne({
            title,
            content,
            state: 'TODO',
            created: getDate(),
            lastUpdate: getDate(),
          })
          return await Todos.findOne({ _id: res.insertedId })
        },
        updateState: async (root, { todoId, state }, context, info) => {
          const res = await Todos.findOneAndUpdate(ObjectId(todoId), {
            $set: { state, lastUpdate: getDate() },
          })
          return await Todos.findOne({
            _id: res.value._id,
          })
        },
        createComment: async (root, { todoId, content }) => {
          const res = await Comments.insertOne({
            todoId,
            content,
            created: getDate(),
          })
          return await Comments.findOne({ _id: res.insertedId })
        },
        deleteTodo: async (root, { _id }) => {
          return await Todos.findOneAndDelete(ObjectId(_id))
        },
      },
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    })

    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

    app.use(
      homePath,
      graphiqlExpress({
        endpointURL: '/graphql',
      }),
    )

    app.listen(PORT, () => {
      console.log(`App is running on port : ${URL}:${PORT}${homePath} 🚀`)
    })
  } catch (e) {
    console.log(e)
  }
}
