/**
 * API Handler for retreiving the audit trail for an existing exam item.
 */

import { createStorage } from '../storage/index.js';

const storage = createStorage();

export async function getAuditTrailHandler(id: string) {
  try {
    // TODO: Add validation using Zod
    const item = await storage.getItem(id);

    return {
      statusCode: 201,
      body: item,
    };
  } catch (error) {
    console.error('Error getting item audit trail:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }
}
