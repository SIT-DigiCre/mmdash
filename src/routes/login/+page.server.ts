import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validatePassword, setSessionCookie, validateSession } from '$lib/auth';

export const load: PageServerLoad = async ({ url, cookies }) => {
	if (validateSession(cookies)) {
		const redirectTo = url.searchParams.get('redirect') || '/';
		throw redirect(302, redirectTo);
	}

	return {
		redirectTo: url.searchParams.get('redirect') || '/'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString() || '';
		const redirectTo = data.get('redirect')?.toString() || '/';

		if (!validatePassword(password)) {
			return fail(401, {
				error: 'パスワードが正しくありません。',
				redirectTo
			});
		}

		setSessionCookie(cookies);

		throw redirect(302, redirectTo);
	}
};
