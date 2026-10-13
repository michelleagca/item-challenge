/**
 * Exam Item Types
 */

import type { z } from "zod";
import type {
  AuditActionTypeSchema,
  ItemStatusSchema,
  ItemTypeSchema,
  SecurityLevelSchema,
} from "../schema/item.js";

export type ItemType = z.infer<typeof ItemTypeSchema>;
export type ItemStatus = z.infer<typeof ItemStatusSchema>;
export type SecurityLevel = z.infer<typeof SecurityLevelSchema>;
export type AuditActionType = z.infer<typeof AuditActionTypeSchema>;

export interface ExamItem {
  id: string;
  subject: string; // e.g., "AP Biology", "AP Calculus"
  itemType: ItemType; // "multiple-choice", "free-response", "essay"
  difficulty: number; // 1-5
  content: {
    question: string;
    options?: string[]; // For multiple choice
    correctAnswer: string;
    explanation: string;
  };
  metadata: {
    author: string;
    created: number; // timestamp
    lastModified: number; // timestamp
    version: number;
    status: ItemStatus; // "draft", "review", "approved", "archived"
    tags: string[];
  };
  securityLevel: SecurityLevel; // "standard", "secure", "highly-secure"
}

export interface CreateItemRequest {
  subject: string;
  itemType: ItemType;
  difficulty: number;
  content: {
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  };
  metadata: {
    author: string;
    status: ItemStatus;
    tags: string[];
  };
  securityLevel: SecurityLevel;
}

export interface UpdateItemRequest {
  subject?: string;
  itemType?: ItemType;
  difficulty?: number;
  content?: Partial<ExamItem["content"]>;
  metadata?: Partial<ExamItem["metadata"]>;
  securityLevel?: SecurityLevel;
}

export interface ListItemsQuery {
  limit?: number;
  offset?: number;
  subject?: string;
  status?: ItemStatus;
}
