import { getLanguages } from '../../server/translationGateway.mjs';
import {
  failureResponse,
  jsonResponse,
  methodNotAllowed,
} from '../../server/vercelAdapter.mjs';

export default {
  async fetch(request) {
    if (request.method !== 'GET') return methodNotAllowed(['GET']);
    try {
      const url = new URL(request.url);
      const data = await getLanguages(url.searchParams.get('model'));
      return jsonResponse(200, data);
    } catch (error) {
      return failureResponse(error);
    }
  },
};
