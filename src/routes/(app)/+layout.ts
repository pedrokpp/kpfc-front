import { redirect } from '@sveltejs/kit';
import { authSession } from '$lib/modules/auth-session';

export function load() {
	const nextPath = authSession.getAccessRedirect('authenticated');
	if (nextPath) {
		throw redirect(307, nextPath);
	}
}
