export default {
  Query: {
    todos: async (parent, args, { models }) => {
      return await models.Todo.find()
    },
    todo: async (parent, { id }, { models }) => {
      return await models.Todo.findById(id)
    },
  },
  Mutation: {
    createTodo: async (parent, args, { models }) => {
      return await models.Todo.create({ ...args, state: TODO })
    },
    updateTodo: async (parent, { id, ...args }, { models }) => {
      return await models.Todo.findByIdAndUpdate(id, { ...args }, { new: true })
    },
    deleteTodo: async (parent, { id }, { models }) => {
      return await models.Todo.findByIdAndUpdate(id, { state: DISABLED })
    },
  },
  Todo: {
    comments: async (parent, args, { models }) => {
      return await models.Comment.find({
        todoID: parent.id,
      })
    },
  },
}
