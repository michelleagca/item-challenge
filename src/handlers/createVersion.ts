/**
 * API Handler for creating a new version of an existing exam item.
 */

import { createStorage } from '../storage/index.js';

const storage = createStorage();

export async function createVersionHandler(data: any) {
  try {
    // TODO: Add validation using Zod
    const item = await storage.createItem(data);

    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error('Error creating item version:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
