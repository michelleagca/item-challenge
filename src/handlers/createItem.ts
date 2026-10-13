/**
 * API Handler for creating a new exam item.
 * POST /api/items
 *
 * Creates a version 1 item with item-created action for audit trail.
 *
 */

import { ZodError } from "zod";
import { CreateItemSchema } from "../schema/item.js";
import { getItemStorage } from "../storage/index.js";

const storage = getItemStorage();

export async function createItemHandler(data: any) {
  try {
    // Validate input
    const validatedData = CreateItemSchema.parse(data);
    // Call storage layer
    const item = await storage.createItem(validatedData);

    // Return success response
    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    // Handle errors appropriately
    if (error instanceof ZodError) {
      console.error("Validation failed");
      return {
        statusCode: 400,
        body: { error: "Validation error, invalid request" },
      };
    }

    console.error("Error creating item:", error);
    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    };
  }
}
