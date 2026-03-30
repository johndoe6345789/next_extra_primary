/**
 * Contact API endpoint injected into baseApi.
 * @module store/api/contactApi
 */
import { baseApi } from './baseApi';

/** Contact form request shape. */
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

/** Contact endpoints: submit enquiry. */
export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Submit a contact form enquiry. */
    submitContact: build.mutation<
      { message: string },
      ContactRequest
    >({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubmitContactMutation } = contactApi;
