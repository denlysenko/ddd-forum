export const getCommentByCommentIdSchema = {
  tags: ['Comments'],
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['commentId'],
    properties: {
      commentId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      description: 'Comment by commentId',
      properties: {
        comment: {
          type: 'object',
          $id: 'comment',
          properties: {
            postSlug: { type: 'string' },
            postTitle: { type: 'string' },
            commentId: { type: 'string' },
            parentCommentId: { type: ['string', 'null'] },
            text: { type: 'string' },
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
