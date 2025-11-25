import { type Handle } from '@sveltejs/kit';
import { createUnauthorizedResponse, validateBasicAuth } from '$lib/basic-auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname !== '/') {
		// Basic 認証用のリクエストヘッダーを確認
		if (!validateBasicAuth(event.request)) {
			// 認証に失敗した場合は 401 Unauthorized レスポンスを返す
			return createUnauthorizedResponse();
		}
	}

	// 認証に成功した場合は処理を続行
	return resolve(event);
};
