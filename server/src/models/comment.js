import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    todoID: { type: mongoose.Schema.Types.ObjectId, ref: 'Todo' },
  },
  {
    timestamps: true,
  },
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
