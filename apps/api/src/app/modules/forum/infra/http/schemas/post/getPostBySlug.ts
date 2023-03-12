export const getPostBySlugSchema = {
  tags: ['Posts'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      slug: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Returns post by slug',
      properties: {
        post: {
          type: 'object',
          // TODO: move to common schema
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            // TODO: move to common schema
            memberPostedBy: {
              type: 'object',
              properties: {
                reputation: { type: 'number' },
                user: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    isEmailVerified: { type: ['boolean', 'null'] },
                    isAdminUser: { type: ['boolean', 'null'] },
                    isDeleted: { type: ['boolean', 'null'] },
                  },
                },
              },
            },
            numComments: { type: 'number' },
            points: { type: 'number' },
            text: { type: 'string' },
            link: { type: 'string' },
            type: { type: 'string' },
            wasUpvotedByMe: { type: 'boolean' },
            wasDownvotedByMe: { type: 'boolean' },
          },
        },
      },
    },
  },
};
