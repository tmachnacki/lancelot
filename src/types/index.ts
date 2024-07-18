import { Doc, Id } from "@/../convex/_generated/dataModel";

export type ImageWithUrlT = Doc<"gigMedia"> & {
  url: string;
};

export type FullGigT = Doc<"gigs"> & {
  storageId?: Id<"_storage"> | undefined;
  favorited: boolean;
  offer: Doc<"offers">;
  reviews: Doc<"reviews">[];
  seller: Doc<"users">;
};

export type MessageWithUserT = Doc<"messages"> & {
  user: Doc<"users">;
};

export type GigWithImageT = Doc<"gigs"> & {
  images: Doc<"gigMedia">[];
};

export type UserWithCountryT = Doc<"users"> & {
  country: Doc<"countries">;
};

export type ReviewFullT = Doc<"reviews"> & {
  author: UserWithCountryT;
  image: ImageWithUrlT;
  offers: Doc<"offers">[];
  gig: Doc<"gigs">;
};

export type CategoriesFullT = Doc<"categories"> & {};
