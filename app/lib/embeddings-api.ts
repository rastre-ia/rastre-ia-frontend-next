export const EMBEDDINGS_URL = process.env.EMBEDDING_ENDPOINT_URL;
console.log('url:', EMBEDDINGS_URL);
export async function getTextEmbeddings(text: string): Promise<number[]> {
	const url = EMBEDDINGS_URL + '/text-embeddings/';
	console.log('url', url);
	const resp = await fetch(url, {
		method: 'POST',
		credentials: 'include',
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

export async function getLlamaSearch(query: string): Promise<any[]> {
	const resp = await fetch(EMBEDDINGS_URL + '/ai-search', {
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

export async function getWebscrap(search_term: string): Promise<any[]> {
	console.log(`Buscando por: ${search_term}`);
	const headers = {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
		Referer: 'https://www.olx.com.br/',
		Connection: 'keep-alive',
		'Content-Type': 'application/json',
	};
	const resp = await fetch(EMBEDDINGS_URL + '/webscrap', {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({
			search_term: search_term,
		}),
	});

	const parsedResp = await resp.json();

	if (!parsedResp.results) {
		console.error('Invalid API response:', parsedResp);
		throw new Error('Invalid API response: Missing results field');
	}

	return parsedResp.results;
}

export async function getMarkdown(
	embeddings_url: string,
	file: File
): Promise<any> {
	const formData = new FormData();
	formData.append('file', file);

	const headers = {
		Accept: 'application/json',
	};
	console.log(embeddings_url);
	const response = await fetch(embeddings_url + '/markdown', {
		method: 'POST',
		headers: headers,
		body: formData,
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Erro na API:', errorText);
		throw new Error(`Erro na API: ${response.status} - ${errorText}`);
	}

	return await response.json();
}

export async function getNFE(chave_acesso: string): Promise<any> {
	console.log(`Buscando NF-e para a chave de acesso: ${chave_acesso}`);

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};

	const response = await fetch(EMBEDDINGS_URL + '/nfe', {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({ chave_acesso }),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Erro na API:', errorText);
		throw new Error(`Erro na API: ${response.status} - ${errorText}`);
	}

	return await response.json();
}
