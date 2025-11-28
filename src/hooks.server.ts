import { redirect, type Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// ログインページ自体は認証不要
	if (event.url.pathname === '/login') {
		return resolve(event);
	}

	// トップページは認証不要
	if (event.url.pathname === '/') {
		return resolve(event);
	}

	// セッションを確認
	if (!validateSession(event.cookies)) {
		// 未認証の場合はログインページにリダイレクト（リダイレクト先をクエリパラメータに含める）
		const redirectTo = event.url.pathname + event.url.search;
		throw redirect(302, `/login?redirect=${encodeURIComponent(redirectTo)}`);
	}

	// 認証に成功した場合は処理を続行
	return resolve(event);
};
