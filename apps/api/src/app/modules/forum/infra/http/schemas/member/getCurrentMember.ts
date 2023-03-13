export const getCurrentMemberSchema = {
  tags: ['Members'],
  response: {
    200: {
      type: 'object',
      description: 'Returns authenticated member',
      properties: {
        // TODO: move to common schema
        member: {
          type: 'object',
          properties: {
            reputation: { type: 'number' },
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
