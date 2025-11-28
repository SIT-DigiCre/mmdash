import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'auth_session';

export const validatePassword = (password: string) => {
	const adminPassword = env.ADMIN_PASSWORD;
	if (!adminPassword) {
		error(500, 'Server is not properly set up');
	}
	return password === adminPassword;
};

const generateSessionId = () => {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

const validateSessionId = (sessionId: string) => {
	if (!sessionId) return false;
	const parts = sessionId.split('-');
	if (parts.length < 2) return false;
	const timestamp = parseInt(parts[0], 10);
	const now = Date.now();
	const maxAge = 30 * 24 * 60 * 60 * 1000; // 30日
	return now - timestamp < maxAge;
};

export const setSessionCookie = (cookies: Cookies) => {
	const sessionId = generateSessionId();
	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 30 * 24 * 60 * 60 * 1000 // 30日
	});
};

export const validateSession = (cookies: Cookies) => {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) return false;
	return validateSessionId(sessionId);
};

export const clearSessionCookie = (cookies: Cookies) => {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
};
