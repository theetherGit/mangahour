export interface Env {
	LiveReaders: DurableObjectNamespace;
}

export class LiveReaders {
	private conns = new Set<WebSocket>();

	constructor(private state: DurableObjectState, private env: Env) {}

	private broadcast(message: string) {
		for (const conn of this.conns) {
			// Check if the connection is still alive
			try {
				conn.send(message);
			} catch {
				// If the connection is closed, remove it from the Set
				this.conns.delete(conn);
			}
		}
	}

	async increment() {
		const count: number = (await this.state.storage.get('count')) ?? 0;
		const newCount = count + 1;
		await this.state.storage.put('count', newCount);

		// Broadcast the new count to all connected clients
		this.broadcast(JSON.stringify({ type: 'update/count', count: newCount }));

		return newCount;
	}

	async decrement() {
		const count: number = (await this.state.storage.get('count')) ?? 0;
		let newCount = 0;
		if (count >= 0) {
			newCount = count - 1;
			await this.state.storage.put('count', newCount);
		}
		// Broadcast the new count to all connected clients
		this.broadcast(JSON.stringify({ type: 'update/count', count: newCount }));

		return newCount;
	}

	async fetch(request: Request) {
		const webSocketPair = new WebSocketPair();
		const client = webSocketPair[0];
		const server = webSocketPair[1];

		server.addEventListener('message', async (event) => {
			// Messages are received/sent as strings, so we need to parse it into JSON
			// to use it as an object
			const action = JSON.parse(event.data as string);

			if (action.type === 'increment') {
				const newCount = await this.increment();
				server.send(JSON.stringify({ type: 'update/count', count: newCount }));
			} else if (action.type === 'decrement') {
				const newCount = await this.decrement();

				server.send(JSON.stringify({ type: 'update/count', count: newCount }));
			}
		});

		server.addEventListener('close', async () => {
			// Remove the session from the Set
			this.conns.delete(server);
			await this.decrement();
			if (this.conns.size === 0) {
				// When the client disconnects, we can delete all the data in Durable Object
				// Deleting all data automatically discards the Durable Object instance
				await this.state.storage.deleteAll();
			}
		});

		server.accept();

		// Add the session to the Set
		this.conns.add(server);

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const upgradeHeader = request.headers.get('Upgrade');

		// If the upgrade header is not set, or it's not set to "websocket", return 426
		if (!upgradeHeader || upgradeHeader !== 'websocket') {
			return new Response('Expected Upgrade: websocket', { status: 426 });
		}

		// Since we want all clients to connect to the same Durable Object instance, we'll use static string
		// instead of the client IP
		const counterId = env.LiveReaders.idFromName('MangaHour');
		const counter = env.LiveReaders.get(counterId);

		return await counter.fetch(request);
	},
};
