const schemaUser = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    login: { type: 'string' },
    telegram: { type: 'string' },
    phone: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    role: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        value: { type: 'string' },
      },
    },
    balance: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        main_balance: { type: 'number' },
        description: { type: 'number' },
      },
    },
    profile: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        is_ban: { type: 'boolean' },
        over_user: { type: 'number' },
      },
    },
  },
  example: {
    id: 1,
    login: 'nickname',
    telegram: 'nickname_telegram',
    phone: '79221110500',
    created_at: '2023-07-14T08:56:34.922Z',
    updated_at: '2023-07-14T08:56:34.922Z',
    role: {
      id: 1,
      value: 'webmaster',
    },
    balance: {
      id: 1,
      main_balance: 0,
      hold_balance: 0,
    },
    profile: {
      id: 1,
      is_ban: false,
      over_user: 10,
    },
  },
};

const schemaUsers = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    rows: {
      type: 'array',
      items: {
        type: 'object',
        properties: schemaUser.properties,
      },
    },
  },
  example: {
    count: 1,
    rows: [
      {
        id: 1,
        login: 'nickname',
        telegram: 'nickname_telegram',
        phone: '79221110500',
        created_at: '2023-07-14T08:56:34.922Z',
        updated_at: '2023-07-14T08:56:34.922Z',
        role: {
          id: 1,
          value: 'webmaster',
        },
        balance: {
          id: 1,
          main_balance: 0,
          hold_balance: 0,
        },
        profile: {
          id: 1,
          is_ban: false,
          over_user: 10,
        },
      },
    ],
  },
};

const schemaUserWithOverUsers = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    login: { type: 'string' },
    telegram: { type: 'string' },
    phone: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    role: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        value: { type: 'string' },
      },
    },
    balance: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        main_balance: { type: 'number' },
        description: { type: 'number' },
      },
    },
    profile: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        is_ban: { type: 'boolean' },
        over_user: { type: 'number' },
        overUserProfile: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            is_ban: { type: 'boolean' },
            over_user: { type: 'number' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                login: { type: 'string' },
                telegram: { type: 'string' },
                phone: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' },
                role: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    value: { type: 'string' },
                  },
                },
              },
            },
            overUserProfile: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                is_ban: { type: 'boolean' },
                over_user: { type: 'null' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    login: { type: 'string' },
                    telegram: { type: 'string' },
                    phone: { type: 'string' },
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
                    role: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        value: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  example: {
    id: 2,
    login: 'web',
    telegram: 'web_telegram',
    phone: null,
    created_at: '2023-07-21T09:05:44.029Z',
    updated_at: '2023-07-21T09:05:44.029Z',
    role: {
      id: 1,
      value: 'webmaster',
    },
    balance: {
      id: 2,
      main_balance: 0,
      hold_balance: 0,
    },
    profile: {
      id: 2,
      is_ban: false,
      over_user: 3,
      overUserProfile: {
        id: 3,
        is_ban: false,
        over_user: 4,
        user: {
          id: 3,
          login: 'curator',
          telegram: 'curator_telegram',
          phone: null,
          created_at: '2023-07-21T09:19:02.525Z',
          updated_at: '2023-07-21T09:19:02.525Z',
          role: {
            id: 2,
            value: 'curator',
          },
        },
        overUserProfile: {
          id: 4,
          is_ban: false,
          over_user: null,
          user: {
            id: 4,
            login: 'teamlead',
            telegram: 'teamlead_telegram',
            phone: null,
            created_at: '2023-07-21T09:19:21.437Z',
            updated_at: '2023-07-21T09:19:21.437Z',
            role: {
              id: 3,
              value: 'teamlead',
            },
          },
        },
      },
    },
  },
};

export { schemaUser, schemaUsers, schemaUserWithOverUsers };
