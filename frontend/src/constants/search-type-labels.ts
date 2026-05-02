/**
 * Maps backend search-result `type` values to the
 * translation key under the `search.tabs.*`
 * namespace used to label suggest badges and
 * results-page tabs.
 *
 * @module constants/search-type-labels
 */

/** Translation-key map for entity types. */
export const TYPE_LABEL_KEY: Record<string, string> = {
  forum_posts: 'tabs.forum',
  wiki_pages: 'tabs.wiki',
  articles: 'tabs.blog',
  products: 'tabs.shop',
  gallery_items: 'tabs.gallery',
  users: 'tabs.people',
};

/** Tab keys (left → right) on the results page. */
export const RESULT_TABS = [
  'all', 'forum', 'wiki', 'blog',
  'shop', 'gallery', 'people',
] as const;

/** Map a tab key to the backend filter[type] value. */
export const TAB_TO_TYPE: Record<string, string> = {
  all: 'all',
  forum: 'forum_posts',
  wiki: 'wiki_pages',
  blog: 'articles',
  shop: 'products',
  gallery: 'gallery_items',
  people: 'users',
};

/** Map ES `_index` → frontend URL prefix. */
export const INDEX_TO_URL_PREFIX:
  Record<string, string> = {
    forum_posts: '/forum/threads/',
    wiki_pages: '/wiki/',
    articles: '/blog/',
    products: '/shop/products/',
    gallery_items: '/gallery/',
    users: '/profile/',
  };
