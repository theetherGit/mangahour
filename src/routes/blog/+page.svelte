<script>
	import * as Card from '$lib/components/ui/card';
</script>
<div class="mb-5 space-y-3">
    <Card.Root class="p-4">
        <div class="flex flex-wrap md:flex-nowrap">
            <div class="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                <span class="font-semibold capitalize">FAQ</span>
                <span>{new Intl.DateTimeFormat('en-US', {dateStyle: 'long'}).format(new Date('2023-09-12'))}</span>
            </div>
            <div class="md:flex-grow">
                <h2 class="mb-2 text-2xl font-medium">
                    MangaHour Data: The Technology which is meant to be yours.
                </h2>
                <div class="mb-6 flex flex-row space-x-2 md:mb-0">
                    MangaHour, Tech Stack, Web Development, Digital Infrastructure
                </div>
                <p class="leading-relaxed">
                    - Indexed DB <br />
                    - We use `Indexed DB` which is inbuilt in every browsers. Which remove the tracking dependency of your data on server.
                    - Drawback is it's not synced with other devices and browsers. It saves data in same browser. E.g. If you have Brave and Chrome in same device and you save data in chrome, you can't use same data in brave.
                </p>
            </div>
        </div>
    </Card.Root>
    <Card.Root class="p-4">
        <div class="flex flex-wrap md:flex-nowrap">
            <div class="mb-6 flex flex-shrink-0 flex-col md:mb-0 md:w-64">
                <span class="font-semibold capitalize">TechBite</span>
                <span>{new Intl.DateTimeFormat('en-US', {dateStyle: 'long'}).format(new Date('2023-09-10'))}</span>
            </div>
            <div class="md:flex-grow">
                <h2 class="mb-2 text-2xl font-medium">
                    MangaHour Decoded: The Technology Stack Unveiled
                </h2>
                <div class="mb-6 flex flex-row space-x-2 md:mb-0">
                    MangaHour, Tech Stack, Web Development, Digital Infrastructure
                </div>
                <p class="leading-relaxed">
                    - NodeJS <br />
                    - Sveltekit <br />
                    - Svelte <br />
                    - Tailwind CSS <br />
                    - Shadcn-ui (Shadcn-Svelte) <br />
                    - Web Workers <br />
                    - Dexie JS with Indexed DB<br />
                    - Orama Search <br />
                    - HonoJs <br />
                    - Cloudflare Workers <br />
                </p>
            </div>
        </div>
    </Card.Root>
</div>
