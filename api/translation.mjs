import { translate } from '../backend/server/translationGateway.mjs';
import {
  failureResponse,
  jsonResponse,
  methodNotAllowed,
  readRequestJson,
} from '../backend/server/vercelAdapter.mjs';

export default {
  async fetch(request) {
    if (request.method !== 'POST') return methodNotAllowed(['POST']);
    try {
      const data = await translate(await readRequestJson(request));
      return jsonResponse(200, data);
    } catch (error) {
      return failureResponse(error);
    }
  },
};
