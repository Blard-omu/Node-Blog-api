const userResponseWithRole = {
  _id: {
    type: "string",
    example: "60564fcb544047cdc3844818",
  },
  username: {
    type: "string",
    example: "John Snow",
  },
  email: {
    type: "string",
    example: "john.snow@email.com",
  },
  password: {
    type: "string",
    example: "442893aba778ab321dc151d9b1ad98c64ed56c07f8cbaed",
  },

  createdAt: {
    type: "string",
    example: "2021-03-20T19:40:59.495Z",
  },
  updatedAt: {
    type: "string",
    example: "2021-03-20T21:23:10.879Z",
  },
};

const internalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Internal Server Error",
          },
        },
      },
    },
  },
};

const userNotFound = {
  description: "User not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "User not found",
          },
        },
      },
    },
  },
};

const invalidUserData = {
  description: "Invalid User Data",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "The fields are required",
          },
        },
      },
    },
  },
};

const security = [
  {
    bearerAuth: [],
  },
];

const createUserBody = {
  type: "object",
  properties: {
    username: {
      type: "string",
      example: "John Snow",
    },
    email: {
      type: "string",
      example: "john.snow@email.com",
    },
    password: {
      type: "string",
      description: "unencrypted user's password",
      example: "password",
    },
  },
};
const loginUserBody = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "john.snow@email.com",
    },
    password: {
      type: "string",
      description: "unencrypted user's password",
      example: "442893aba778ab321dc151d9b1ad98c64ed56c07f8cbaed",
    },
  },
};

const updateUserBody = {
  type: "object",
  properties: {
    username: {
      type: "string",
      example: "John Snow",
    },
  },
};

const createUser = {
  tags: ["Auth"],
  description: "Create a new user in the system",
  operationId: "createUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createUserBody",
        },
      },
    },
    required: true,
  },
  responses: {
    201: {
      description: "User created successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "60564fcb544047cdc3844818",
              },
              username: {
                type: "string",
                example: "John Snow",
              },
              email: {
                type: "string",
                example: "john.snow@email.com",
              },
              password: {
                type: "string",
                example: "442893aba778ab321dc151d9b1ad98c64ed56c07f8cbaed",
              },

              createdAt: {
                type: "string",
                example: "2021-03-20T19:40:59.495Z",
              },
              updatedAt: {
                type: "string",
                example: "2021-03-20T21:23:10.879Z",
              },
            },
          },
        },
      },
    },
    422: invalidUserData,
    500: internalServerError,
  },
};

const loginUser = {
  tags: ["Auth"],
  description: "login a user",
  operationId: "loginUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/loginUserBody",
        },
      },
    },
    required: true,
  },
  responses: {
    201: {
      description: "User logged in successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "60564fcb544047cdc3844818",
              },
              username: {
                type: "string",
                example: "John Snow",
              },
              email: {
                type: "string",
                example: "john.snow@email.com",
              },
              password: {
                type: "string",
                example: "442893aba778ab321dc151d9b1ad98c64ed56c07f8cbaed",
              },

              createdAt: {
                type: "string",
                example: "2021-03-20T19:40:59.495Z",
              },
              updatedAt: {
                type: "string",
                example: "2021-03-20T21:23:10.879Z",
              },
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTNmODkyZTVjNTU2YzQ5NDg5MTU2NmEiLCJpYXQiOjE3MDA1NTgxMTQsImV4cCI6MTcwMTE2MjkxNH0.fC5h6_ofCjLHYs0kkZXDE4MidsR4K4jYYt9iC0AgBhw",
              },
            },
          },
        },
      },
    },
    422: invalidUserData,
    500: internalServerError,
  },
};

const getUsers = {
  tags: ["Users"],
  description: "Retrieve all the users",
  operationId: "getUsers",
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Users retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: userResponseWithRole,
            },
          },
        },
      },
    },
    500: internalServerError,
  },
};

const getUser = {
  tags: ["Users"],
  description: "Retrieve One User",
  operationId: "getUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "_id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "User retrieved successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: userResponseWithRole,
          },
        },
      },
    },
    404: userNotFound,
    500: internalServerError,
  },
};

const updateUser = {
  tags: ["Users"],
  description: "Update a user",
  operationId: "updateUser",
  security,
  parameters: [
    {
      name: "_id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateUserBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "User Updated Successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: userResponseWithRole,
          },
        },
      },
    },
    404: userNotFound,
    422: invalidUserData,
    500: internalServerError,
  },
};

const deleteUser = {
  tags: ["Users"],
  description: "Delete a User",
  operationId: "deleteUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "_id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "User deleted Successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "User deleted successfully!",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Internal Server Error",
              },
            },
          },
        },
      },
    },
  },
};

export {
  createUser,
  loginUser,
  createUserBody,
  loginUserBody,
  deleteUser,
  getUsers,
  getUser,
  updateUserBody,
  updateUser,
};
