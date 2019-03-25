import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: false,
      required: true,
      maxlength: 80,
    },
    description: {
      type: String,
      unique: false,
      required: false,
      maxlength: 240,
    },
    state: {
      type: String,
      default: 'TODO',
    },
  },
  {
    timestamps: true,
  },
)

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
