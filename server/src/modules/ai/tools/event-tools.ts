export const EVENT_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'getUserEvents',
      description:
        'Get events where the current user is a participant or organizer.',
      parameters: {
        type: 'object',
        properties: {
          dateFrom: {
            type: 'string',
            description: 'Start date in ISO format. Omit if not needed.',
          },
          dateTo: {
            type: 'string',
            description: 'End date in ISO format. Omit if not needed.',
          },
          tag: {
            type: 'string',
            description:
              'Single tag name to filter by, e.g. "Tech". Omit if not needed.',
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getPublicEvents',
      description: 'Get all public events visible to everyone.',
      parameters: {
        type: 'object',
        properties: {
          dateFrom: {
            type: 'string',
            description: 'Start date in ISO format. Omit if not needed.',
          },
          dateTo: {
            type: 'string',
            description: 'End date in ISO format. Omit if not needed.',
          },
          tag: {
            type: 'string',
            description:
              'Single tag name to filter by, e.g. "Tech". Omit if not needed.',
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getEventDetails',
      description:
        'Get full details and participant list for a specific event by its name.',
      parameters: {
        type: 'object',
        properties: {
          eventName: {
            type: 'string',
            description: 'Full or partial event title to search for.',
          },
        },
        required: ['eventName'],
        additionalProperties: false,
      },
    },
  },
];
