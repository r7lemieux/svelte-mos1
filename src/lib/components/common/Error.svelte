<script>
	import { page } from '$app/state';

 
</script>

<svelte:head>
	<title>MoDefs</title>
	<meta name="description" content="metas" />
</svelte:head>

<div>
	<h2>Error</h2>
	<p>{page.status}: {page.error?.message}</p>
	<br/>
	<p>{JSON.stringify(page, null, 2)}</p>
</div>
