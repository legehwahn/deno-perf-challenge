import { encryptor } from './handlers.ts';

const port = Number(Deno.env.get('PORT')) || 3000;

const server = Deno.listen({ hostname: '0.0.0.0', port: port });
console.log(`server listening on http://localhost:${port}`);

for await (const conn of server) {
	
	// In order to not be blocking, we need to handle each connection individually without awaiting the function
	serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {

	// Deno.serveHttp(conn) "upgrades" a network TCP connection into an HTTP connection.
	// Each request sent over the HTTP connection will be yielded as an async iterator from the HTTP connection.
	for await (const requestEvent of Deno.serveHttp(conn)) {

		try {

			console.log(requestEvent.request.url);

			if (requestEvent.request.method !== 'POST') {
				
				requestEvent.respondWith(new Response(null, { status: 405 }));

			} else {

				const url = new URL(requestEvent.request.url);

				switch (url.pathname) {
	
					// case '/keys/private':
					// 	setPrivateKey(request, response);
					// 	break;
		
					// case '/keys/public':
					// 	setPublicKey(request, response);
					// 	break;
		
					case '/encrypt':
						encryptor(requestEvent);
						break;
		
					// case '/decrypt':
					// 	decryptor(request, response);
					// 	break;
		
					default:
						requestEvent.respondWith(new Response(null, { status: 418 }));
						break;
				}
			}
	
		} catch (error) {
	
			// The requestEvent's `.respondWith()` method is how we send the response back to the client.
			requestEvent.respondWith(new Response(JSON.stringify({
				code: error.code,
				message: error.message
			}), {
				status: 420
			}));
		}
	}
}