import { z } from 'zod';

// Defined constants from glossary and example input.
export const ITEM_TYPES = [
  'multiple-choice',
  'free-response',
  'essay',
] as const;
export const ITEM_STATUSES = [
  'draft',
  'review',
  'approved',
  'archived',
] as const;
export const SECURITY_LEVELS = ['standard', 'secure', 'highly-secure'] as const;
// For audit trail purposes (create, update, and create version are separate events).
export const AUDIT_ACTION_TYPES = [
  'item-created',
  'item-updated',
  'item-version-created',
] as const;

export const ItemTypeSchema = z.enum(ITEM_TYPES);
export const ItemStatusSchema = z.enum(ITEM_STATUSES);
export const SecurityLevelSchema = z.enum(SECURITY_LEVELS);
export const AuditActionTypeSchema = z.enum(AUDIT_ACTION_TYPES);

export const CreateItemSchema = z.object({
  subject: z.string().trim(),
  itemType: ItemTypeSchema,
  difficulty: z.number().int().min(1).max(5),
  content: z.object({
    question: z.string().trim(),
    options: z.array(z.string().trim()).optional(), // Options only for multiple choice
    correctAnswer: z.string().trim(), // Correct answer applies only if there are answer options
    explanation: z.string().trim(),
  }),
  metadata: z.object({
    author: z.string().trim(),
    status: ItemStatusSchema,
    tags: z.array(z.string().trim()),
  }),
  securityLevel: SecurityLevelSchema,
});

export const GetItemSchema = z.string().uuid();

/**
 * Example response
 {
  "id": "f6517a43-b7c9-4e87-ab07-d3ea6d0c9259",
  "subject": "AP Biology",
  "itemType": "multiple-choice",
  "difficulty": 3,
  "content": {
    "question": "What is photosynthesis?",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "correctAnswer": "A",
    "explanation": "Photosynthesis is..."
  },
  "metadata": {
    "author": "test-author",
    "status": "draft",
    "tags": [
      "biology",
      "photosynthesis"
    ],
    "created": 1791876507359,
    "lastModified": 1791876507359,
    "version": 1
  },
  "securityLevel": "standard"
}
 * 
 */
export const itemSchema = z.object({
  id: z.string().uuid(),
  subject: z.string().trim(),
  itemType: ItemTypeSchema,
  difficulty: z.number().int().min(1).max(5),
  content: z.object({
    question: z.string().trim(),
    options: z.array(z.string().trim()).optional(), // Options only for multiple choice
    correctAnswer: z.string().trim(), // Correct answer applies only if there are answer options
    explanation: z.string().trim().optional(),
  }),
  metadata: z.object({
    author: z.string().trim(),
    status: ItemStatusSchema,
    tags: z.array(z.string().trim()),
    created: z.number().int(), // TODO: Zod Codec epochMillisToDate?
    lastModified: z.number().int(), // TODO: Zod Codec epochMillisToDate?
    version: z.number().int(),
  }),
  securityLevel: SecurityLevelSchema,
});
