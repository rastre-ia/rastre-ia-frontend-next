export async function cepLookup(cep: string) {
	const resp = await fetch('https://brasilapi.com.br/api/cep/v2/' + cep);
	const parsedResp = await resp.json();

	return parsedResp;
}
