<script lang="ts">
	interface Props {
		content: string;
		revealCloze?: boolean;
	}

	let { content, revealCloze = true }: Props = $props();

	const rendered = $derived(renderContent(content, revealCloze));

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function renderContent(text: string, reveal: boolean): string {
		let html = escapeHtml(text);

		// Images: ![alt](url) → <img>
		html = html.replace(
			/!\[([^\]]*)\]\(([^)]+)\)/g,
			'<img src="$2" alt="$1" class="max-w-full rounded-md my-2" loading="lazy" />'
		);

		// Audio: [audio](url) → <audio>
		html = html.replace(
			/\[audio\]\(([^)]+)\)/g,
			'<audio controls src="$1" class="my-2 w-full max-w-sm"></audio>'
		);

		if (reveal) {
			// Show answer highlighted
			html = html.replace(
				/\{\{c\d+::([^:}]+)(?:::[^}]*)?\}\}/g,
				'<span class="font-semibold text-primary underline underline-offset-2">$1</span>'
			);
		} else {
			// Show hint if present, else [...]
			html = html.replace(
				/\{\{c\d+::[^:}]+::([^}]+)\}\}/g,
				'<span class="inline-block px-3 py-0.5 rounded bg-secondary/20 text-text/50 font-medium">[$1]</span>'
			);
			html = html.replace(
				/\{\{c\d+::[^}]+\}\}/g,
				'<span class="inline-block px-3 py-0.5 rounded bg-secondary/20 text-text/50 font-medium">[...]</span>'
			);
		}

		html = html.replace(/\n/g, '<br />');

		return html;
	}
</script>

{@html rendered}
