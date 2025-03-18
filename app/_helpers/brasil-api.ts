'use client';

export async function cepLookup(cep: string): Promise<{
	latitude: number;
	longitude: number;
}> {
	try {
		const url = `https://brasilapi.com.br/api/cep/v2/${cep}`;

		console.log('URL: ', url);

		const resp = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// If the response is not OK, handle the error
		if (!resp.ok) {
			console.error('Request failed with status:', resp.status);
			throw new Error(`Request failed with status: ${resp.status}`);
		}

		// Parse the response body to JSON
		const parsedResp = await resp.json();

		return {
			latitude: parsedResp.location.coordinates.latitude,
			longitude: parsedResp.location.coordinates.longitude,
		};
	} catch (error) {
		console.error('Error occurred during fetch:', error);
		throw new Error('Error occurred during fetch');
	}
}
