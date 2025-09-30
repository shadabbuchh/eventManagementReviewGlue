import createClient from 'openapi-fetch';

import type { paths } from '@app/openapi/generated-types';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
};

const client = createClient<paths>({
  baseUrl: '/api/v1',
  referrerPolicy: 'no-referrer-when-downgrade',
  headers: DEFAULT_HEADERS,
  credentials: 'include',
  querySerializer: {
    array: {
      style: 'form',
      explode: false,
    },
  },
});

// Middleware
client.use({
  // Middleware to format errors
  async onResponse({ request, response }) {
    if (response.ok) {
      return response;
    }

    // handle errors
    try {
      // attempt to parse the response body as JSON
      const body = await response.clone().json();

      // add code field to body
      body.code = response.status;
      body.requestId = request.headers.get('X-Request-Id');

      return new Response(JSON.stringify(body), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    } catch {
      // noop
    }

    return response;
  },
});

export const {
  DELETE: del,
  GET: get,
  HEAD: head,
  OPTIONS: options,
  PATCH: patch,
  POST: post,
  PUT: put,
  TRACE: trace,
} = client;
