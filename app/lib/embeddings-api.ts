export const EMBEDDINGS_URL = process.env.EMBEDDING_ENDPOINT_URL;

export async function getTextEmbeddings(text: string): Promise<number[]> {
	console.log('EMBEDDINGS_URL', EMBEDDINGS_URL);
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

export async function getVectorSearchResults(
	queryVector: number[],
	collection_name: string,
	numCandidates: number,
	limit: number
): Promise<any[]> {
	const resp = await fetch(EMBEDDINGS_URL + '/vector-search', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			queryVector: queryVector,
			collection_name: collection_name,
			numCandidates: numCandidates,
			limit: limit,
		}),
	});

	const parsedResp = await resp.json();

	if (!resp.ok) {
		throw new Error(parsedResp.message);
	}

	return parsedResp.results;
}

export async function getLlamaSearch(
	query: string
): Promise<any[]> {
	const resp = await fetch(EMBEDDINGS_URL + '/llama-search', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	});

	const parsedResp = await resp.json();
	console.log(parsedResp);
	if (!resp.ok) {
		throw new Error(parsedResp.message);
	}

	return parsedResp.response;
}