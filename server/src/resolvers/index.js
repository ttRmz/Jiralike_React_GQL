import { GraphQLDateTime } from 'graphql-iso-date'

import todoResolvers from './todo'
import commentResolvers from './comment'

const customScalarResolver = {
  Date: GraphQLDateTime,
}

export default [customScalarResolver, todoResolvers, commentResolvers]
