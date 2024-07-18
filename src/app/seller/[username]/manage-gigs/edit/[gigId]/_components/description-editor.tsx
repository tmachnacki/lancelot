"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface DescriptionEditorProps {
  gigId: Id<"gigs">;
  initialContent?: string;
  editable: boolean;
  className?: string;
}

export const DescriptionEditor = ({
  gigId,
  initialContent,
  editable,
  className,
}: DescriptionEditorProps) => {
  const { theme } = useTheme();
  const update = useMutation(api.gig.updateDescription);

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  const handleChange = () => {
    if (editor.document) {
      const contentLength = JSON.stringify(editor.document).length;
      if (contentLength < 20000) {
        update({
          id: gigId,
          description: JSON.stringify(editor.document, null, 2),
        });
      } else {
        toast.error("Unable to save: max content length exceeded.", {
          duration: 2000,
        });
      }
    }
  };

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={theme === "light" ? "light" : "dark"}
      onChange={handleChange}
      className={className}
    />
  );
};
