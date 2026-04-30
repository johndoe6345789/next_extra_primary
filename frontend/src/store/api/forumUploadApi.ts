/**
 * Forum file upload RTK Query endpoint.
 * Uses multipart/form-data via FormData.
 * @module store/api/forumUploadApi
 */
import { baseApi } from './baseApi';

/** Response from a successful forum file upload. */
export interface ForumUploadResponse {
  /** Public URL of the uploaded file. */
  url: string;
  /** Stored filename on the server. */
  filename: string;
}

/** Forum upload endpoint injected into baseApi. */
export const forumUploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Upload a file (image, attachment) for forum use.
     * Sends multipart/form-data; do not set Content-Type.
     *
     * @param formData - FormData with the file field.
     * @returns URL and filename of the stored file.
     */
    uploadForumFile: build.mutation<
      ForumUploadResponse,
      FormData
    >({
      query: (formData) => ({
        url: '/forum/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const {
  useUploadForumFileMutation,
} = forumUploadApi;
