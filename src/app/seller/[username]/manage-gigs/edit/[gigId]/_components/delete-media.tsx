"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { api } from "@/../convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteMediaProps {
  storageId: string;
}

export const DeleteMedia = ({ storageId }: DeleteMediaProps) => {
  const { mutate, pending } = useApiMutation(api.gigMedia.remove);

  const onDelete = () => {
    mutate({ storageId })
      .then(() => toast.success("Media deleted"))
      .catch(() => toast.error("Failed to delete media file"));
  };

  return (
    <div className="z-10 cursor-pointer text-black absolute top-2 right-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Delete Media?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"This will delete the media file from the board."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={onDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
