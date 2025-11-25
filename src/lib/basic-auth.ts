import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** Basic 認証用の正しいリクエストヘッダーが含まれているか検証します。 */
export function validateBasicAuth(request: Request): boolean {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || !authHeader.startsWith('Basic ')) {
		return false;
	}
	const base64Credentials = authHeader.split(' ')[1];
	const credentials = atob(base64Credentials).split(':');
	const [username, password] = credentials;
	return isAdmin(username, password);
}

/** Basic 認証用のダイアログを表示するためのレスポンスを生成します。 */
export function createUnauthorizedResponse(): Response {
	return new Response('Not authorized', {
		status: 401,
		headers: { 'WWW-Authenticate': 'Basic realm="Member Only"' }
	});
}

/** ユーザー名とパスワードが正しいか検証します。 */
function isAdmin(username: string, password: string): boolean {
	const cred = env.ADMIN_CREDENTIALS;
	if (!cred) {
		error(500, 'Server is not properly set up');
	}
	return `${username}:${password}` === cred;
}
