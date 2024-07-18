"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DescriptionEditor } from "./_components/description-editor";
import { TitleEditor } from "./_components/title-editor";
import { OffersEditor } from "./_components/offers-editor";
import { Images } from "@/components/images";

export default function Edit() {
  const params = useParams<{ username: string; gigId: string }>();

  const gig = useQuery(api.gig.get, {
    id: params.gigId as Id<"gigs">,
  });
  const gigPublished = useQuery(api.gig.isPublished, {
    id: params.gigId as Id<"gigs">,
  });
  const { mutate: remove, pending: removePending } = useApiMutation(
    api.gig.remove
  );
  const { mutate: publish, pending: publishPending } = useApiMutation(
    api.gig.publish
  );
  const { mutate: unpublish, pending: unpublishPending } = useApiMutation(
    api.gig.unpublish
  );
  const router = useRouter();

  const identity = useAuth();

  const generateUploadUrl = useMutation(api.gigMedia.generateUploadUrl);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const sendImage = useMutation(api.gigMedia.sendImage);

  if (!identity) {
    throw new Error("Unauthorized");
  }

  // still fetching
  if (gig === undefined || gigPublished === undefined) {
    return null;
  }

  // not found
  if (gig === null) {
    return <div className="">Gig not found</div>;
  }

  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    const postUrl = await generateUploadUrl();

    await Promise.all(
      selectedImages.map(async (image) => {
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        const json = await result.json();

        if (!result.ok) {
          throw new Error(`Upload failed: ${JSON.stringify(json)}`);
        }

        const { storageId } = json;

        await sendImage({ storageId, format: "image", gigId: gig._id }).catch(
          (error) => {
            console.error(error);
            toast.error("Maximum of 5 files");
          }
        );
      })
    );

    setSelectedImages([]);
    imageInput.current!.value = "";
  }

  const onPublish = async () => {
    if (!gigPublished) {
      publish({ id: params.gigId as Id<"gigs"> }).catch((error) => {
        console.error(error);
        toast.error("Failed to publish gig.");
      });
    } else {
      unpublish({ id: params.gigId as Id<"gigs"> }).catch((error) => {
        console.error(error);
        toast.error("Failed to unpublish gig.");
      });
    }
  };

  const onDelete = async () => {
    remove({ id: params.gigId as Id<"gigs"> }).catch((error) => {
      console.error(error);
      toast.error("Failed to delete gig.");
    });
    router.back();
  };

  return (
    <>
      <div className="space-y-12 xl:px-36 px-12">
        <div className="flex justify-end pr-2 space-x-2">
          <Button
            disabled={publishPending || unpublishPending}
            variant={"default"}
            onClick={onPublish}
          >
            {gigPublished ? "Unpublish" : "Publish"}
          </Button>
          <Link href={`/${gig.seller.username}/${gig._id}`}>
            <Button disabled={removePending} variant={"secondary"}>
              Preview
            </Button>
          </Link>
          <Button
            disabled={removePending}
            variant={"secondary"}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>

        <TitleEditor id={gig._id} title={gig.title} />
        <div className="w-[800px]">
          <Images images={gig.images} title={gig.title} allowDelete={true} />
        </div>
        <form onSubmit={handleSendImage} className="space-y-2">
          <Label className="font-normal">Add up to 5 images:</Label>
          <div className="flex space-x-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              ref={imageInput}
              onChange={(event) =>
                setSelectedImages(Array.from(event.target.files || []))
              }
              multiple
              className="cursor-pointer w-fit border-border"
              disabled={selectedImages.length !== 0}
            />
            <Button
              type="submit"
              disabled={selectedImages.length === 0}
              className="w-fit"
            >
              Upload Image
            </Button>
          </div>
        </form>
        <div className="flex rounded-md border border-border items-center space-x-4 w-fit p-2 cursor-default">
          <p className="text-muted-foreground">👨‍🎨 Creator: {"Vuk Rosic"}</p>
        </div>

        {/* <OffersEditor gigId={gig._id} /> */}

        <h2 className="font-semibold">About this gig</h2>
      </div>

      <DescriptionEditor
        initialContent={gig.description}
        editable={true}
        className="pb-40 mt-12 2xl:px-[200px] xl:px-[90px] xs:px-[17px]"
        gigId={gig._id}
      />
    </>
  );
}
