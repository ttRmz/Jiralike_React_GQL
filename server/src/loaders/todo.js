export const batchTodo = async (keys, models) => {
  const todos = await models.Todo.find({
    _id: {
      $in: keys,
    },
  })
  return keys.map(key => todos.find(todo => todo.id == key))
}
