/**
 * Gallery domain types.
 * @module types/gallery
 */

/** A gallery album. */
export interface Album {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  coverPhotoId?: string;
  /** Resolved cover image URL for display. */
  coverUrl?: string;
  photoCount: number;
}

/** A photo inside an album with variants. */
export interface Photo {
  id: string;
  albumId: string;
  title?: string;
  caption?: string;
  variants: Record<string, string>;
}
