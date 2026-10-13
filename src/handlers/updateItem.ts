/**
 * API Handler for updating an existing exam item.
 */

import { createStorage } from '../storage/index.js';

const storage = createStorage();

export async function updateItemHandler(data: any) {
  try {
    // TODO: Add validation using Zod
    const item = await storage.createItem(data);

    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error('Error updating an existing item:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
