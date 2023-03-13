export const getRecentPostsSchema = {
  tags: ['Posts'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      offset: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Returns recent posts',
      properties: {
        posts: {
          type: 'array',
          items: {
            type: 'object',
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
                      isEmailVerified: { type: 'boolean' },
                      isAdminUser: { type: 'boolean' },
                      isDeleted: { type: 'boolean' },
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
  },
};
