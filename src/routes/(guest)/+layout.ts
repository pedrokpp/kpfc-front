import { redirect } from '@sveltejs/kit';
import { authSession } from '$lib/modules/auth-session';

export function load() {
	const nextPath = authSession.getAccessRedirect('guest');
	if (nextPath) {
		throw redirect(307, nextPath);
	}
}
