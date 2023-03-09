export const getUserByUsernameSchema = {
  tags: ['Users'],
  params: {
    type: 'object',
    additionalProperties: false,
    properties: {
      username: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'User by username',
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
    404: {
      type: 'object',
      description: 'Not found',
      properties: {
        statusCode: {
          type: 'number',
          const: 404,
        },
        error: {
          type: 'string',
          const: 'Not found',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
};
