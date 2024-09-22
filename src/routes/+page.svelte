<script>
	import * as Card from "$lib/components/ui/card";
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<Card.Root class="w-full md:w-1/4 bg-red-500">
		<Card.Header class="flex flex-col items-center justify-center">
			<Card.Title class="mx-auto text-red-950">Server Issue</Card.Title>
			<Card.Description class="text-center text-red-950">There is some issue with our backend and I'm trying to do my best to fix all this.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				We are now going to use manga dex API. It will take some time fix this till than you can see your fav list and read on other places.
			</p>
		</Card.Content>
		<Card.Footer class="items-center justify-center">
			<Button variant="destructive" href="/favourite">Favourites</Button>
		</Card.Footer>
	</Card.Root>
</div>