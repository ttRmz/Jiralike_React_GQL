require('dotenv').config()
import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import { prepare } from '../utils/index'

const app = express()

app.use(cors())
const homePath = '/graphiql'
const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = process.env.MONGO_DB_URL

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)

    const Posts = db.collection('posts')
    const Comments = db.collection('comments')

    const typeDefs = [
      `
      type Query {
        getPost(_id: String): Post
        getAllPosts: [Post]
        getComment(_id: String): Comment
        getAllComments: [Comment]
      }

      type Post {
        _id: String
        title: String
        content: String
        comments: [Comment]
      }

      type Comment {
        _id: String
        postId: String
        content: String
        post: Post
      }

      type Mutation {
        deletePost(postId: String): Post
        createPost(title: String, content: String): Post
        createComment(postId: String, content: String): Comment
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `,
    ]

    const resolvers = {
      Query: {
        getPost: async (root, { _id }) => {
          return prepare(await Posts.findOne(ObjectId(_id)))
        },
        getAllPosts: async () => {
          return (await Posts.find({}).toArray()).map(prepare)
        },
        getComment: async (root, { _id }) => {
          return prepare(await Comments.findOne(ObjectId(_id)))
        },
        getAllComments: async () => {
          return (await Comments.find({}).toArray()).map(prepare)
        },
      },
      Post: {
        comments: async ({ _id }) => {
          return (await Comments.find({ postId: _id }).toArray()).map(prepare)
        },
      },
      Comment: {
        post: async ({ postId }) => {
          return prepare(await Posts.findOne(ObjectId(postId)))
        },
      },
      Mutation: {
        createPost: async (root, args, context, info) => {
          const res = await Posts.insertOne(args)
          return prepare(res.ops[0])
        },
        createComment: async (root, args) => {
          const res = await Comments.insert(args)
          return await Comments.findOne({ _id: res.insertedIds[1] })
        },
        deletePost: async (root, { _id }) => {
          // await Comments.findOneAndDelete
          return await Posts.findOneAndDelete(ObjectId(_id))
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
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })
  } catch (e) {
    console.log(e)
  }
}
