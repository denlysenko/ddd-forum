export const logoutSchema = {
  tags: ['Users'],
  response: {
    200: {
      type: 'object',
      description: 'User successfully logged out',
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
