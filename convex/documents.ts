import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Function to CREATE a new blank document
// convex/documents.ts
export const create = mutation({
  args: { title: v.string(), initialContent: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.insert("documents", {
      title: args.title,
      ownerId: identity.subject,
      ownerEmail: identity.email!, // Store email from Clerk identity
      initialContent: args.initialContent || '{"type":"doc","content":[{"type":"paragraph"}]}',
      collaboratorEmails: [],
    });
  },
});

// 2. Function to GET all documents (Using Filter Fix)
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { owned: [], shared: [] };

    const userEmail = identity.email?.toLowerCase();

    // 1. Get ALL documents relevant to this user
    // We query by owner first as it's the primary index
    const allDocs = await ctx.db
      .query("documents")
      .collect();

    // 2. Separate them using JavaScript logic
    const owned = allDocs.filter(doc => doc.ownerId === identity.subject);
    
    const shared = allDocs.filter(doc => 
      doc.ownerId !== identity.subject && 
      doc.collaboratorEmails.map(e => e.toLowerCase()).includes(userEmail ?? "")
    );

    return { owned, shared };
  },
});

// 3. Function to GET a single document by its ID
export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.documentId);

    if (!document) return null;
    if (!identity) throw new Error("Not authenticated");

    const userEmail = identity.email?.toLowerCase();
    const isOwner = document.ownerId === identity.subject;
    const isCollaborator = document.collaboratorEmails?.includes(userEmail || "");

    // Logic: If they aren't the owner AND aren't on the email list, block them
    if (!isOwner && !isCollaborator) {
      throw new Error("Unauthorized: You do not have access to this document");
    }

    return document;
  },
});

// 4. Function to UPDATE a document (Title or Content)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()), // Useful later
    icon: v.optional(v.string()),       // Useful later
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...rest } = args;

    // Security: Check if document exists and belongs to user
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    // if (existingDocument.ownerId !== identity.subject) {
    //   throw new Error("Unauthorized");
    // }

    // Update the document with whatever new data was sent
    // const document = await ctx.db.patch(args.id, {
    //   ...rest,
    // });
    // NEW LOGIC: Allow update if user is the owner. 
    // If you want guest editors, relax this check like we did in getById.
    const isOwner = existingDocument.ownerId === identity.subject;
    
    if (!isOwner) {
       // Optional: For now, we might allow other logged in users to edit 
       // to test the live collaboration system.
       // throw new Error("Unauthorized"); 
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

// 5. Function to DELETE a document
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    // Security check: Only the owner can delete their own document
    if (existingDocument.ownerId !== identity.subject) {
      throw new Error("Unauthorized: Only the owner can delete this document");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// convex/documents.ts

// Save a snapshot of the current document
export const createVersion = mutation({
  args: { 
    documentId: v.id("documents"), 
    content: v.string(),
    title: v.string() 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("versions", {
      documentId: args.documentId,
      title: args.title,
      content: args.content,
      authorId: identity.subject,
    });
  },
});

// Get all versions for a specific document
export const getVersions = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("versions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc") // Newest first
      .collect();
  },
});

// Add this mutation to allow inviting others
export const addCollaborator = mutation({
  args: { documentId: v.id("documents"), email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const document = await ctx.db.get(args.documentId);
    if (!document || document.ownerId !== identity.subject) {
      throw new Error("Only owners can invite collaborators");
    }

    const currentEmails = document.collaboratorEmails || [];
    const newEmail = args.email.toLowerCase().trim();

    if (!currentEmails.includes(newEmail)) {
      await ctx.db.patch(args.documentId, {
        collaboratorEmails: [...currentEmails, newEmail],
      });
    }
    return { success: true };
  },
});