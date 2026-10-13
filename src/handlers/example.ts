/**
 * API Handlers for exam items.
 */

import { createStorage } from '../storage/index.js';

const storage = createStorage();

export async function getItemHandler(id: string) {
  try {
    const item = await storage.getItem(id);

    if (!item) {
      return {
        statusCode: 404,
        body: { error: 'Item not found' },
      };
    }

    return {
      statusCode: 200,
      body: item,
    };
  } catch (error) {
    console.error('Error getting item:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}

export async function createItemHandler(data: any) {
  try {
    // TODO: Add validation using Zod
    const item = await storage.createItem(data);

    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error('Error creating item:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}

// TODO: Implement other handlers:
// - updateItemHandler
// - listItemsHandler
// - createVersionHandler
// - getAuditTrailHandler
