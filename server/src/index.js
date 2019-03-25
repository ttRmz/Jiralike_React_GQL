import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'
import DataLoader from 'dataloader'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { connectDb } from './models'
import loaders from './loaders'

const app = express()

app.use(cors())

app.use(morgan('dev'))

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message,
    }
  },
  context: async () => ({
    models,
    loaders: {
      todo: new DataLoader(keys => loaders.todo.batchTodo(keys, models)),
      comment: new DataLoader(keys => loaders.comment.batchTodo(keys, models)),
    },
  }),
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const isTest = !!process.env.TEST_DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 8000

connectDb().then(async () => {
  if (isTest || isProduction) {
    // reset database
    await Promise.all([
      models.Todo.deleteMany({}),
      models.Comment.deleteMany({}),
    ])

    createTodosWithComments(new Date())
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`)
  })
})

const createTodosWithComments = async () => {
  const todo1 = new models.Todo({
    title: 'First ticket',
    description: 'Lorem descripsium uno',
  })
  const todo2 = new models.Todo({
    title: 'Second ticket',
    description: 'Lorem descripsium dos',
  })
  const comment1 = new models.Comment({
    text: 'Published the Road to learn React',
    todoID: todo1.id,
  })

  const comment2 = new models.Comment({
    text: 'Happy to release ...',
    todoID: todo2.id,
  })

  const comment3 = new models.Comment({
    text: 'Published a complete ...',
    todoID: todo2.id,
  })

  await comment1.save()
  await comment2.save()
  await comment3.save()

  await todo1.save()
  await todo2.save()
}
