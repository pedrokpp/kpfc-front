<script lang="ts">
	import { siteConfig } from '$lib/content/site';

	interface Props {
		title: string;
		description?: string;
		path?: string;
		robots?: string;
		ogType?: 'website' | 'article';
	}

	let {
		title,
		description = '',
		path = '/',
		robots = 'index,follow',
		ogType = 'website'
	}: Props = $props();

	const canonical = $derived(new URL(path, siteConfig.url).toString());
	const ogImage = `${siteConfig.url}/og-card.svg`;
	const fullTitle = $derived(title.includes(siteConfig.name) ? title : `${title} - ${siteConfig.name}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<meta name="theme-color" content="#122033" />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content={siteConfig.name} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: siteConfig.name,
			applicationCategory: 'EducationalApplication',
			operatingSystem: 'Web',
			description,
			url: canonical,
			image: ogImage,
			codeRepository: siteConfig.repository,
			author: {
				'@type': 'Person',
				name: 'Pedro',
				email: siteConfig.email.replace('mailto:', '')
			}
		})}
	</script>
</svelte:head>
