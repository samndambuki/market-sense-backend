/**
 * OpenAPI 3.0 description of the MarketSense API.
 * Served as JSON at /api/docs.json and as Swagger UI at /api/docs.
 * When you add or change a route, update it here too.
 */

const errorResponse = (description, example) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
      example: { message: example },
    },
  },
});

const unauthorized = errorResponse(
  "Missing, invalid or expired token",
  "Invalid or expired token",
);
const forbidden = errorResponse(
  "Your role isn't allowed to do this",
  "Access denied",
);
const serverError = errorResponse(
  "Unexpected server error",
  "Something went wrong",
);

const idParam = (name, what) => ({
  name,
  in: "path",
  required: true,
  description: `${what} ID`,
  schema: { type: "integer", minimum: 1, example: 1 },
});

const openapi = {
  openapi: "3.0.3",
  info: {
    title: "MarketSense API",
    version: "1.0.0",
    description: [
      "API for MarketSense, an AI-powered market intelligence platform.",
      "",
      "**How to authorise:** call `POST /api/auth/login`, copy the `token` from the response,",
      "click **Authorize** (top right) and paste it. Swagger adds `Bearer` for you.",
      "",
      "**Roles:** `VIEWER` can read, `ANALYST` can also create and edit, `ADMIN` can do everything including delete.",
      "New accounts are always `VIEWER`.",
    ].join("\n"),
  },
  // Relative URL: works locally and on AWS without changes
  servers: [{ url: "/", description: "This server" }],
  tags: [
    { name: "Health", description: "Check the API and database are up" },
    { name: "Auth", description: "Create an account and sign in" },
    { name: "Markets", description: "Markets being tracked" },
    { name: "Market players", description: "Companies competing in a market" },
    {
      name: "AI",
      description: "AI-generated analysis (can take a few seconds)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token from POST /api/auth/login. Expires after 1 day.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"],
      },
      ValidationError: {
        type: "object",
        properties: {
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "riskLevel" },
                message: {
                  type: "string",
                  example:
                    'Invalid option: expected one of "LOW"|"MEDIUM"|"HIGH"',
                },
              },
            },
          },
        },
      },
      Role: { type: "string", enum: ["ADMIN", "ANALYST", "VIEWER"] },
      RiskLevel: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          fullName: { type: "string", example: "Amina Otieno" },
          email: {
            type: "string",
            format: "email",
            example: "amina@company.com",
          },
          role: { $ref: "#/components/schemas/Role" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: { type: "string", example: "Amina Otieno" },
          email: {
            type: "string",
            format: "email",
            example: "amina@company.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "Market2026!",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "amina@company.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "Market2026!",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login Successful" },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      MarketPlayer: {
        type: "object",
        properties: {
          id: { type: "integer", example: 3 },
          companyName: { type: "string", example: "Safaricom M-Pesa" },
          marketId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      MarketPlayerInput: {
        type: "object",
        required: ["companyName", "marketId"],
        properties: {
          companyName: { type: "string", example: "Safaricom M-Pesa" },
          marketId: { type: "integer", example: 1 },
        },
      },
      MarketInput: {
        type: "object",
        required: [
          "name",
          "category",
          "region",
          "growthRate",
          "description",
          "marketSize",
          "riskLevel",
        ],
        properties: {
          name: { type: "string", example: "Digital Payments" },
          category: { type: "string", example: "Fintech" },
          region: { type: "string", example: "East Africa" },
          growthRate: {
            type: "number",
            description: "Annual growth, in percent",
            example: 14.7,
          },
          description: {
            type: "string",
            example:
              "Digital payment services including mobile money and online transactions.",
          },
          marketSize: { type: "string", example: "$3.2B" },
          riskLevel: { $ref: "#/components/schemas/RiskLevel" },
        },
      },
      Market: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          { $ref: "#/components/schemas/MarketInput" },
          {
            type: "object",
            properties: {
              players: {
                type: "array",
                items: { $ref: "#/components/schemas/MarketPlayer" },
              },
            },
          },
        ],
      },
      AiAnalysis: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          analysis: {
            type: "string",
            description: "Markdown text written by the AI model",
            example: "## Market summary\nMobile money is the main way...",
          },
        },
      },
    },
  },
  // Every route requires a token unless it says `security: []`
  security: [{ bearerAuth: [] }],
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Check the API is running",
        security: [],
        responses: {
          200: {
            description: "API is up",
            content: {
              "application/json": {
                example: { message: "Market Sense api is running" },
              },
            },
          },
        },
      },
    },
    "/api/health/db": {
      get: {
        tags: ["Health"],
        summary: "Check the database connection",
        security: [],
        responses: {
          200: {
            description: "Database reachable",
            content: {
              "application/json": {
                example: { message: "PostgreSQL connection is working" },
              },
            },
          },
          500: errorResponse(
            "Database unreachable",
            "Database connection failed",
          ),
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Create an account",
        description:
          "New accounts always get the `VIEWER` role. An admin can change it later.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Account created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User registered successfully",
                    },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          409: errorResponse(
            "Email already registered",
            "Email already registered",
          ),
          500: serverError,
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Sign in and get a token",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Signed in. Use `token` with the Authorize button.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: errorResponse(
            "Wrong email or password",
            "Invalid email or password",
          ),
          500: serverError,
        },
      },
    },

    "/api/markets": {
      get: {
        tags: ["Markets"],
        summary: "List all markets",
        description:
          "Roles: VIEWER, ANALYST, ADMIN. Each market includes its players.",
        responses: {
          200: {
            description: "All markets",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Market" },
                },
              },
            },
          },
          401: unauthorized,
          500: serverError,
        },
      },
      post: {
        tags: ["Markets"],
        summary: "Create a market",
        description: "Roles: ANALYST, ADMIN.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MarketInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Market created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Market" },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
          401: unauthorized,
          403: forbidden,
          500: serverError,
        },
      },
    },
    "/api/markets/{id}": {
      parameters: [idParam("id", "Market")],
      get: {
        tags: ["Markets"],
        summary: "Get one market",
        description: "Roles: VIEWER, ANALYST, ADMIN. Includes its players.",
        responses: {
          200: {
            description: "The market",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Market" },
              },
            },
          },
          400: errorResponse(
            "ID isn't a positive whole number",
            "Invalid Market ID",
          ),
          401: unauthorized,
          404: errorResponse("No market with that ID", "Market Not Found"),
          500: serverError,
        },
      },
      put: {
        tags: ["Markets"],
        summary: "Update a market",
        description:
          "Roles: ANALYST, ADMIN. Send every field (full replacement).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MarketInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Market updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Market Updated Successfully",
                    },
                    market: { $ref: "#/components/schemas/Market" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid ID or input",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
              },
            },
          },
          401: unauthorized,
          403: forbidden,
          404: errorResponse("No market with that ID", "Market Not Found"),
          500: serverError,
        },
      },
      delete: {
        tags: ["Markets"],
        summary: "Delete a market",
        description: "Roles: ADMIN. Also deletes the market's players.",
        responses: {
          204: { description: "Deleted (no content)" },
          400: errorResponse(
            "ID isn't a positive whole number",
            "Market ID is invalid",
          ),
          401: unauthorized,
          403: forbidden,
          404: errorResponse("No market with that ID", "Market Not Found"),
          500: serverError,
        },
      },
    },

    "/api/marketPlayers": {
      get: {
        tags: ["Market players"],
        summary: "List all market players",
        description: "Roles: VIEWER, ANALYST, ADMIN.",
        responses: {
          200: {
            description: "All players",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/MarketPlayer" },
                },
              },
            },
          },
          401: unauthorized,
          500: serverError,
        },
      },
      post: {
        tags: ["Market players"],
        summary: "Add a company to a market",
        description: "Roles: ANALYST, ADMIN.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MarketPlayerInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Player created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MarketPlayer" },
              },
            },
          },
          401: unauthorized,
          403: forbidden,
          500: serverError,
        },
      },
    },
    "/api/marketPlayers/{id}": {
      parameters: [idParam("id", "Market player")],
      get: {
        tags: ["Market players"],
        summary: "Get one market player",
        description: "Roles: VIEWER, ANALYST, ADMIN.",
        responses: {
          200: {
            description: "The player",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MarketPlayer" },
              },
            },
          },
          401: unauthorized,
          404: errorResponse(
            "No player with that ID",
            "Market Player not found",
          ),
          500: serverError,
        },
      },
      put: {
        tags: ["Market players"],
        summary: "Update a market player",
        description: "Roles: ANALYST, ADMIN.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MarketPlayerInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Player updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MarketPlayer" },
              },
            },
          },
          401: unauthorized,
          403: forbidden,
          404: errorResponse(
            "No player with that ID",
            "Market Player Not Found",
          ),
          500: serverError,
        },
      },
      delete: {
        tags: ["Market players"],
        summary: "Delete a market player",
        description: "Roles: ADMIN.",
        responses: {
          204: { description: "Deleted (no content)" },
          401: unauthorized,
          403: forbidden,
          404: errorResponse(
            "No player with that ID",
            "Market Player Not found",
          ),
          500: serverError,
        },
      },
    },

    "/api/ai/market-summary/{id}": {
      parameters: [idParam("id", "Market")],
      get: {
        tags: ["AI"],
        summary: "AI summary of a market",
        description:
          "Any signed-in user. Returns Markdown: summary, opportunities and risks.",
        responses: {
          200: {
            description: "Summary generated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AiAnalysis" },
              },
            },
          },
          400: errorResponse(
            "ID isn't a positive whole number",
            "Invalid market id",
          ),
          401: unauthorized,
          404: errorResponse("No market with that ID", "Market not found"),
          500: errorResponse(
            "The AI service failed",
            "Failed to generate market summary",
          ),
        },
      },
    },
    "/api/ai/competitor-analysis": {
      get: {
        tags: ["AI"],
        summary: "AI competitor analysis for a market",
        description:
          "Any signed-in user. Finds the market by name (not case-sensitive).",
        parameters: [
          {
            name: "marketName",
            in: "query",
            required: true,
            schema: { type: "string", example: "Digital Payments" },
          },
        ],
        responses: {
          200: {
            description: "Analysis generated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AiAnalysis" },
              },
            },
          },
          400: errorResponse("marketName missing", "Market Name is required"),
          401: unauthorized,
          404: errorResponse("No market with that name", "Market Not found"),
          500: errorResponse(
            "The AI service failed",
            "Failed to generate competitor analysis",
          ),
        },
      },
    },
  },
};

export default openapi;
