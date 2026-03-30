"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; 
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./(auth)/signin/signin";
import { useTheme } from "next-themes";
import { useState } from "react";
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  SunIcon, 
  MoonIcon, 
  Search,
  FileBox,
  Trash2,
  ExternalLink,
  Link2,
  ChevronsUpDown,
  ArrowLeft,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

// --- FULL 2-COLUMN GOOGLE DOCS RESUME ---
const SAFE_RESUME_JSON = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { colwidth: [550] },
              content: [
                { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Your Name" }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit" }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "EXPERIENCE", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - PRESENT", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Company, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Job Title", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "EDUCATION", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "School Name, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Degree", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "School Name, Location", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Degree", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "MONTH 20XX - MONTH 20XX", marks: [{ type: "textStyle", attrs: { color: "#80868b" } }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam." }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "PROJECTS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph" },
                { type: "paragraph", content: [{ type: "text", text: "Project Name", marks: [{ type: "bold" }] }, { type: "text", text: " — " }, { type: "text", text: "Detail", marks: [{ type: "italic" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit." }] }
              ]
            },
            {
              type: "tableCell",
              attrs: { colwidth: [250] },
              content: [
                { type: "paragraph", content: [{ type: "text", text: "123 Your Street" }] },
                { type: "paragraph", content: [{ type: "text", text: "Your City, ST 12345" }] },
                { type: "paragraph", content: [{ type: "text", text: "(123) 456-7890", marks: [{ type: "bold" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "no_reply@example.com", marks: [{ type: "bold" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "SKILLS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit amet." }] },
                { type: "paragraph", content: [{ type: "text", text: "AWARDS", marks: [{ type: "textStyle", attrs: { color: "#1a73e8" } }, { type: "bold" }] }] },
                { type: "paragraph", content: [{ type: "text", text: "Lorem ipsum dolor sit", marks: [{ type: "bold" }] }, { type: "text", text: " amet" }] }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const SAFE_LETTER_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "Your Name\nYour Address\nCity, ST 12345" }] },
    { type: "paragraph", content: [{ type: "text", text: "Dear [Recipient Name]," }] },
    { type: "paragraph", content: [{ type: "text", text: "Write the body of your formal letter here." }] },
    { type: "paragraph", content: [{ type: "text", text: "Sincerely,\nYour Name" }] },
  ]
});

const SAFE_PROPOSAL_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Project Proposal" }] },
    { type: "paragraph", content: [{ type: "text", text: "Prepared for: Client Name", marks: [{ type: "bold" }] }] },
    { type: "horizontalRule" },
    { type: "paragraph", content: [{ type: "text", text: "Provide a brief overview of the project." }] }
  ]
});

const SAFE_NOTES_JSON = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Class / Meeting Notes" }] },
    { type: "paragraph", content: [{ type: "text", text: "Date: 09/04/20XX", marks: [{ type: "bold" }] }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Topic 1 discussed..." }] }] }] }
  ]
});

const TEMPLATE_CATEGORIES = [
  {
    category: "Recently used",
    templates: [
      { id: "blank", label: "Blank document", subLabel: "", isBlank: true, initialContent: null },
      { id: "resume_serif", label: "Resume", subLabel: "Serif", initialContent: SAFE_RESUME_JSON },
      { id: "letter_spearmint", label: "Letter", subLabel: "Spearmint", initialContent: SAFE_LETTER_JSON },
      { id: "proposal_tropic", label: "Project proposal", subLabel: "Tropic", initialContent: SAFE_PROPOSAL_JSON },
      { id: "brochure_geometric", label: "Brochure", subLabel: "Geometric", initialContent: SAFE_PROPOSAL_JSON },
    ]
  },
  {
    category: "CVs",
    templates: [
      { id: "cv_swiss", label: "Resume", subLabel: "Swiss", initialContent: SAFE_RESUME_JSON },
      { id: "cv_serif", label: "Resume", subLabel: "Serif", initialContent: SAFE_RESUME_JSON },
    ]
  },
  {
    category: "Work",
    templates: [
      { id: "work_meeting1", label: "Meeting notes", subLabel: "Tropic", initialContent: SAFE_NOTES_JSON },
    ]
  }
];

const TemplateMockup = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-full flex flex-col gap-1.5 p-1 px-2 opacity-60">
      <div className="h-3 w-1/2 bg-muted-foreground/30 rounded-sm mb-2" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
      <div className="h-1 w-5/6 bg-muted-foreground/20 rounded-full" />
      <div className="h-2 w-1/3 bg-muted-foreground/30 rounded-sm mt-3" />
      <div className="h-1 w-full bg-muted-foreground/20 rounded-full" />
    </div>
  );
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // FETCH BOTH OWNED AND SHARED DOCUMENTS
  const results = useQuery(api.documents.get);
  const createDocument = useMutation(api.documents.create);
  const removeDocument = useMutation(api.documents.remove); 

  const onCreateTemplate = (title: string, initialContent: string | null) => {
    createDocument({ title, initialContent: initialContent ?? "" })
      .then((documentId) => {
        window.location.href = `/documents/${documentId}`;
      })
      .catch((error) => {
        console.error("Error creating document:", error);
      });
  };

  const handleDelete = async (id: Id<"documents">) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await removeDocument({ id }); 
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/documents/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!"); 
  };

  // REUSABLE CARD FOR BOTH SECTIONS
  const DocumentCard = ({ doc, isShared = false }: { doc: any, isShared?: boolean }) => (
    <div 
      onClick={() => (window.location.href = `/documents/${doc._id}`)} 
      className="flex flex-col bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer overflow-hidden group"
    >
      <div className="h-36 bg-muted/30 border-b border-border flex items-center justify-center p-4">
        <div className="w-full h-full bg-background border border-border/50 shadow-sm rounded flex flex-col gap-2 p-3 overflow-hidden">
           <TemplateMockup type="recent" />
        </div>
      </div>
      
      <div className="p-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className={cn("w-4 h-4 shrink-0", isShared ? "text-purple-500" : "text-blue-500")} />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate text-foreground group-hover:text-blue-500 transition-colors">
              {doc.title || "Untitled Document"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate font-medium">
              {isShared ? `From: ${doc.ownerEmail}` : `Opened ${new Date(doc._creationTime).toLocaleDateString()}`}
            </span>
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1 z-50" align="end" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => window.open(`/documents/${doc._id}`, '_blank')} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-muted rounded-md text-left transition-colors text-foreground"><ExternalLink className="size-4 text-muted-foreground" /> Open in new tab</button>
              <button onClick={() => handleCopyLink(doc._id)} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-muted rounded-md text-left transition-colors text-foreground"><Link2 className="size-4 text-muted-foreground" /> Copy link</button>
              {!isShared && (
                <>
                  <div className="h-[1px] bg-border my-1 w-full" />
                  <button onClick={() => handleDelete(doc._id)} className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-red-500/10 text-red-600 rounded-md text-left transition-colors"><Trash2 className="size-4" /> Remove</button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SignedOut>
        <SignInPage />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen flex flex-col text-foreground">
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-10 object-contain" />
              <span className="font-bold text-xl text-[#F69836]">Bharat</span>
              <span className="text-xl text-[#2F87C7]">Docs</span>
            </div>
            <div className="hidden md:flex items-center relative max-w-md w-full mx-8">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input placeholder="Search documents..." className="w-full pl-10 bg-muted/50 border-transparent focus-visible:ring-blue-500 rounded-full h-10 text-sm" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-9 px-3 rounded-full">
                {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          {isGalleryOpen ? (
            <div className="flex-1 bg-muted/30 dark:bg-muted/10 pb-20">
              <div className="max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-10">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <Button variant="ghost" size="icon" onClick={() => setIsGalleryOpen(false)}><ArrowLeft className="size-5" /></Button>
                  <h1 className="text-2xl font-medium">Template gallery</h1>
                </div>
                {TEMPLATE_CATEGORIES.map((category) => (
                  <div key={category.category} className="flex flex-col gap-4">
                    <h3 className="text-sm font-medium text-foreground">{category.category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
                      {category.templates.map((t) => (
                        <div key={t.id} className="flex flex-col gap-2 w-[150px] shrink-0 text-left group">
                          <button onClick={() => onCreateTemplate(t.label, t.initialContent)} className="aspect-[3/4] w-full bg-card border border-border rounded-md flex items-center justify-center p-4 overflow-hidden relative transition-all group-hover:border-blue-500 shadow-sm">
                            {t.isBlank ? <Plus className="size-16 text-red-500" /> : <TemplateMockup type={t.id} />}
                          </button>
                          <span className="text-sm font-medium truncate">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <section className="bg-muted/30 dark:bg-muted/10 border-b border-border">
                <main className="max-w-5xl mx-auto p-6 md:px-10 md:py-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium">Start a new document</h2>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => setIsGalleryOpen(true)}>
                      Template gallery <ChevronsUpDown className="size-4 opacity-70" />
                    </Button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {TEMPLATE_CATEGORIES[0].templates.map((t) => (
                      <div key={t.id} className="flex flex-col gap-2 w-[140px] shrink-0 group">
                        <button onClick={() => onCreateTemplate(t.label, t.initialContent)} className="aspect-[3/4] w-full bg-card border border-border rounded-md flex items-center justify-center p-4 overflow-hidden relative transition-all group-hover:border-blue-500 shadow-sm">
                          {t.isBlank ? <Plus className="size-16 text-red-500" /> : <TemplateMockup type={t.id} />}
                        </button>
                        <span className="text-sm font-medium truncate">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </main>
              </section>

              <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:px-10 md:py-8 flex flex-col gap-10 mt-6">
                {/* OWNED SECTION */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-medium flex items-center gap-2"><FileText className="size-4 text-blue-500" /> My documents</h2>
                  {results === undefined ? (
                    <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>
                  ) : results.owned.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed"><FileBox className="w-10 h-10 mb-4 opacity-20" /><p className="text-xs">No documents found.</p></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {results.owned.map((doc: any) => <DocumentCard key={doc._id} doc={doc} />)}
                    </div>
                  )}
                </div>

                {/* SHARED SECTION */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-medium flex items-center gap-2 text-purple-600"><Users className="size-4" /> Shared with me</h2>
                  {results === undefined ? null : results.shared.length === 0 ? (
                    <div className="p-10 border border-dashed rounded-lg text-center text-xs opacity-50">No documents shared with you yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {results.shared.map((doc: any) => <DocumentCard key={doc._id} doc={doc} isShared />)}
                    </div>
                  )}
                </div>
              </main>
            </>
          )}
        </div>
      </SignedIn>
    </div>
  );
}