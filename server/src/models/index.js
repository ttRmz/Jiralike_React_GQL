import mongoose from 'mongoose'

import Todo from './todo'
import Comment from './comment'

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
    })
  }

  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  }
}

const models = { Todo, Comment }

export { connectDb }

export default models
