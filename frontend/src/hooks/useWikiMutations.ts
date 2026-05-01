'use client';

/**
 * Mutations for creating, updating, and deleting
 * wiki pages.
 * @module hooks/useWikiMutations
 */
import { useRouter } from 'next/navigation';
import {
  useCreateWikiPageMutation,
  useUpdateWikiPageMutation,
  useDeleteWikiPageMutation,
  type WikiPagePayload,
} from '@/store/api/wikiApi';

/** Return type of useWikiMutations. */
export interface UseWikiMutationsReturn {
  /** Submit a new page; navigates to it on success. */
  createPage: (p: WikiPagePayload) => Promise<void>;
  /** Submit an update; navigates to page on success. */
  updatePage: (
    slug: string, p: WikiPagePayload,
  ) => Promise<void>;
  /** Delete a page; navigates to /wiki on success. */
  deletePage: (slug: string) => Promise<void>;
  /** True while any mutation is in flight. */
  isSaving: boolean;
  /** Last error message, or null. */
  error: string | null;
}

/**
 * Provides create / update / delete actions for
 * wiki pages, with navigation side-effects.
 *
 * @param locale - Active locale for redirect URLs.
 * @returns Mutation callbacks + loading/error state.
 */
export function useWikiMutations(
  locale: string,
): UseWikiMutationsReturn {
  const router = useRouter();
  const [create, { isLoading: creating, error: ce }] =
    useCreateWikiPageMutation();
  const [update, { isLoading: updating, error: ue }] =
    useUpdateWikiPageMutation();
  const [remove, { isLoading: deleting, error: de }] =
    useDeleteWikiPageMutation();

  const err = ce ?? ue ?? de;

  const createPage = async (
    p: WikiPagePayload,
  ): Promise<void> => {
    await create(p).unwrap();
    router.push(`/${locale}/wiki/${p.slug}`);
  };

  const updatePage = async (
    slug: string, p: WikiPagePayload,
  ): Promise<void> => {
    await update({ slug, ...p }).unwrap();
    router.push(`/${locale}/wiki/${p.slug}`);
  };

  const deletePage = async (
    slug: string,
  ): Promise<void> => {
    await remove(slug).unwrap();
    router.push(`/${locale}/wiki`);
  };

  return {
    createPage,
    updatePage,
    deletePage,
    isSaving: creating || updating || deleting,
    error: err ? 'Failed to save page' : null,
  };
}

export default useWikiMutations;
