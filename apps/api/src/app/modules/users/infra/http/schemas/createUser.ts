export const createUserSchema = {
  tags: ['Users'],
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'User successfully created',
    },
    409: {
      type: 'object',
      description: 'Conflict',
      properties: {
        statusCode: {
          type: 'number',
          const: 409,
        },
        error: {
          type: 'string',
          const: 'Bad Request',
        },
        message: {
          type: 'string',
        },
      },
    },
  },
};
