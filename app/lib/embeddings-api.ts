export const EMBEDDINGS_URL = process.env.EMBEDDING_ENDPOINT_URL;

export async function getTextEmbeddings(text: string): Promise<number[]> {
	const resp = await fetch(EMBEDDINGS_URL + '/text-embeddings', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			text: text,
		}),
	});

	const parsedResp = await resp.json();

	if (!resp.ok) {
		throw new Error(parsedResp.message);
	}

	const embeddings: number[] = parsedResp.embeddings;
	const embeddingsDimension: number = parsedResp.dimension;

	if (embeddings.length !== embeddingsDimension) {
		throw new Error('Embeddings dimension mismatch');
	}

	return embeddings;
}

export async function getImageEmbeddings(url: string): Promise<number[]> {
	const resp = await fetch(EMBEDDINGS_URL + '/image-embeddings', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			url: url,
		}),
	});

	const parsedResp = await resp.json();

	if (!resp.ok) {
		throw new Error(parsedResp.message);
	}

	const embeddings: number[] = parsedResp.embeddings;
	const embeddingsDimension: number = parsedResp.dimension;

	if (embeddings.length !== embeddingsDimension) {
		throw new Error('Embeddings dimension mismatch');
	}

	return embeddings;
}
