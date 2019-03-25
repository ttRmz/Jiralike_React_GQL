export const batchComment = async (keys, models) => {
  const comments = await models.Comment.find({
    _id: {
      $in: keys,
    },
  })
  return keys.map(key => comments.find(comment => comment.id == key))
}
