/**
 * API Handler for listing exam items with pagination.
 */

import { createStorage } from '../storage/index.js';

const storage = createStorage();

export async function listItemsHandler(id: string) {
  try {
    // TODO: Add validation using Zod
    const item = await storage.getItem(id);

    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error('Error listing items with pagination:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
