export const prepare = o => {
  o._id = o._id.toString()
  return o
}

export const getDate = () => {
  const date = new Date()
  return date.toString()
}
