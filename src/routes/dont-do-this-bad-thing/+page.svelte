<script>
	import * as Card from "$lib/components/ui/card";
	import JSONTree from 'svelte-json-tree';

	export let data;

	console.log(JSON.stringify(data, undefined, 2));

</script>

<div class="h-[80vh] grid place-content-center">
	<Card.Root class="w-[calc(100vw-40px)] md:w-[400px]">
		<Card.Header>
			<Card.Title>Bad Behaviour Detected</Card.Title>
			<Card.Description>We have detected crawler or bad behaviour on this app so we are not allowing you to access it.</Card.Description>
		</Card.Header>
		<Card.Content >
			<p>Check you are a good user and uses a good browser and device.</p>
			<JSONTree value={data} />
		</Card.Content>
	</Card.Root>
</div>