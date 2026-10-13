/**
 * API Handlers for retreiving exam items by ID.
 * GET /api/items/{id}
 */

import { ZodError } from "zod";
import { GetItemSchema } from "../schema/item.js";
import { getItemStorage } from "../storage/index.js";

const storage = getItemStorage();

export async function getItemHandler(id: string) {
  try {
    const validatedParams = GetItemSchema.parse(id);
    const item = await storage.getItem(validatedParams);

    if (!item) {
      return {
        statusCode: 404,
        body: { error: "Item not found" },
      };
    }

    return {
      statusCode: 200,
      body: item,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation failed");
      return {
        statusCode: 400,
        body: { error: "Validation error, invalid request" },
      };
    }

    console.error("Error getting item:", error);
    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    };
  }
}
