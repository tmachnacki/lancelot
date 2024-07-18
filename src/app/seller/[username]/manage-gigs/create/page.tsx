"use client";

import { CreateForm } from "@/components/forms/create-form";
import { useParams } from "next/navigation";

export default function CreateGig() {
  const params = useParams<{ username: string }>();
  return (
    <div className="w-full h-full grid place-items-center">
      <CreateForm username={params.username} />
    </div>
  );
}
