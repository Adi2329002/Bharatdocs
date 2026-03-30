import { v } from "convex/values";
import { action } from "./_generated/server";
import { Liveblocks } from "@liveblocks/node";
import { api } from "./_generated/api"; // Add this line
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export const auth = action({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) throw new Error("Unauthorized");

    // Fetch the document
    const document = await ctx.runQuery(api.documents.getById, { 
      documentId: args.roomId as any 
    });

    if (!document) throw new Error("Document not found");

    const userEmail = identity.email.toLowerCase();
    
    // Check access by Email instead of Subject ID
    const isOwner = document.ownerEmail?.toLowerCase() === userEmail;
    const isCollaborator = document.collaboratorEmails?.some(
      (email) => email.toLowerCase() === userEmail
    );

    if (!isOwner && !isCollaborator) {
      throw new Error("You do not have access to this document");
    }

    const session = liveblocks.prepareSession(identity.subject, {
      userInfo: {
        name: identity.name || "Anonymous",
        avatar: identity.pictureUrl,
      },
    });

    session.allow(args.roomId, session.FULL_ACCESS);
    const { body } = await session.authorize();
    return JSON.parse(body);
  },
});