const port = Number(Deno.env.get("PORT")) || 3000;

const server = Deno.listen({ port: port });
console.log(`server listening on http://localhost:${port}`);

for await (const conn of server) {
	// In order to not be blocking, we need to handle each connection individually without awaiting the function
	serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {

	// This "upgrades" a network connection into an HTTP connection.
	const httpConn = Deno.serveHttp(conn);

	// Each request sent over the HTTP connection will be yielded as an async iterator from the HTTP connection.
	for await (const requestEvent of httpConn) {

		// The native HTTP server uses the web standard `Request` and `Response` objects.
		const body = `Your user-agent is:\n\n${requestEvent.request.headers.get("user-agent") ?? "Unknown"}`;

		// The requestEvent's `.respondWith()` method is how we send the response back to the client.
		requestEvent.respondWith(new Response(body, {
			status: 200,
		}));
	}
}





















