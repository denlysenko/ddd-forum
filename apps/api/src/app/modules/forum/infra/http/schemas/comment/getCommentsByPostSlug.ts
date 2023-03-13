export const getCommentsByPostSlugSchema = {
  tags: ['Comments'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['slug'],
    properties: {
      slug: { type: 'string' },
      offset: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Post comments by post slug',
      properties: {
        comments: {
          type: 'array',
          items: {
            $id: 'comment',
            type: 'object',
            properties: {
              postSlug: { type: 'string' },
              postTitle: { type: 'string' },
              commentId: { type: 'string' },
              parentCommentId: { type: ['string', 'null'] },
              text: { type: 'string' },
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
              createdAt: { type: 'string', format: 'date-time' },
              childComments: {
                type: 'array',
                items: { $ref: 'comment#' },
              },
              points: { type: 'number' },
              wasUpvotedByMe: { type: 'boolean' },
              wasDownvotedByMe: { type: 'boolean' },
            },
          },
        },
      },
    },
    400: {
      type: 'object',
      description: 'Bad Request',
      properties: {
        statusCode: {
          type: 'number',
          const: 400,
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
