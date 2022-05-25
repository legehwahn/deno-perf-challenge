import { privateEncrypt } from './cryptoHelpers.ts';

const keys = {
	publicKey: '',
	passphrase: '',
	privateKey: ''
};

async function encryptor(requestEvent: Deno.RequestEvent) {

	try {

		const { data } = await requestEvent.request.json();
		requestEvent.respondWith(new Response(await privateEncrypt(data), { status: 200 }));

	} catch (_error) {

		requestEvent.respondWith(new Response(null, { status: 418 }));
	}
}

export {
	encryptor
};