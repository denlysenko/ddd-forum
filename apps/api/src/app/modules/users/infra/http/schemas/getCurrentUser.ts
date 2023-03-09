export const getCurrentUserSchema = {
  tags: ['Users'],
  response: {
    200: {
      type: 'object',
      description: 'Returns authenticated user',
      properties: {
        user: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            isEmailVerified: { type: 'boolean' },
            isAdminUser: { type: 'boolean' },
            isDeleted: { type: 'boolean' },
          },
        },
      },
    },
    401: {
      type: 'object',
      description: 'Unauthorized',
      properties: {
        statusCode: {
          type: 'number',
          const: 401,
        },
        error: {
          type: 'string',
          const: 'Unauthorized',
        },
        message: {
          type: 'string',
          const: 'Unauthorized',
        },
      },
    },
  },
};
