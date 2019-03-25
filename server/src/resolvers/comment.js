export default {
  Query: {
    comments: async (parent, args, { models }) => {
      return await models.Comment.find()
    },
    comment: async (parent, { id }, { models }) => {
      return await models.Comment.findById(id)
    },
  },
  Mutation: {
    createComment: async (parent, { text, todoID }, { models }) => {
      return await models.Comment.create({
        text,
        todoID,
      })
    },
    deleteComment: async (parent, { id }, { models }) => {
      const comment = await models.Comment.findById(id)
      if (comment) {
        await comment.remove()
        return true
      } else {
        return false
      }
    },
    updateComment: async (parent, { id, text }, { models }) => {
      return await models.Comment.findByIdAndUpdate(id, { text }, { new: true })
    },
  },
  // Comment: {
  //   todo: async (comment, args, { loaders }) => {
  //     return await loaders.todo.load(comment.todoID)
  //   },
  // },
  Comment: {
    todo: async (parent, args, { models }) => {
      return await models.Todo.findById(parent.todoID)
    },
  },
}
