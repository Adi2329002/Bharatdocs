import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()), 
    ownerId: v.string(),
    ownerEmail: v.string(), 
    // Best practice: Use a required array. Initialize as [] in your mutation.
    collaboratorEmails: v.array(v.string()), 
    roomId: v.optional(v.string())
  })
  .index("by_owner", ["ownerId"])
  .index("by_owner_email", ["ownerEmail"])
  // CRITICAL: This allows the 'Shared with Me' query to be instant
  .index("by_collaborator", ["collaboratorEmails"]),

  versions: defineTable({
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(), 
    authorId: v.string(),
  }).index("by_document", ["documentId"]),
});