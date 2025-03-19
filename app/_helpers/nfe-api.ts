export interface NfeParams {
	nfeProc: {
		protNFe: {
			infProt: {
				nProt: number;
				digVal: string;
				dhRecbto: string;
				chNFe: string;
				xMotivo: string;
				cStat: number;
			};
		};
		NFe: {
			infNFe: {
				infAdic: {
					infCpl: string;
				};
				det: Array<{
					nItem: number;
					prod: {
						cEAN: string;
						cProd: number;
						qCom: number;
						cEANTrib: string;
						vUnTrib: number;
						qTrib: number;
						vProd: number;
						xProd: string;
						vUnCom: number;
						indTot: number;
						uTrib: string;
						NCM: number;
						uCom: string;
						CFOP: number;
						CEST: number;
					};
					imposto: {
						vTotTrib: number;
						ICMS: {
							ICMS00: {
								modBC: number;
								orig: number;
								CST: string;
								vBC: number;
								vICMS: number;
								pICMS: number;
							};
						};
						COFINS: {
							COFINSAliq: {
								vCOFINS: number;
								CST: string;
								vBC: number;
								pCOFINS: number;
							};
						};
						PIS: {
							PISAliq: {
								vPIS: number;
								CST: string;
								vBC: number;
								pPIS: number;
							};
						};
					};
				}>;
				total: {
					ICMSTot: {
						vCOFINS: number;
						vBCST: number;
						vICMSDeson: number;
						vProd: number;
						vSeg: number;
						vNF: number;
						vTotTrib: number;
						vPIS: number;
						vBC: number;
						vST: number;
						vICMS: number;
						vII: number;
						vDesc: number;
						vOutro: number;
						vIPI: number;
						vFrete: number;
					};
				};
				cobr: {
					dup: Array<{
						dVenc: string;
						nDup: string;
						vDup: number;
					}>;
				};
				Id: string;
				ide: {
					tpNF: number;
					mod: number;
					indPres: number;
					tpImp: number;
					nNF: number;
					cMunFG: number;
					procEmi: number;
					finNFe: number;
					dhEmi: string;
					tpAmb: number;
					indFinal: number;
					idDest: number;
					tpEmis: number;
					cDV: number;
					cUF: number;
					serie: number;
					natOp: string;
					cNF: string;
					verProc: string;
					indPag: number;
				};
				emit: {
					xNome: string;
					CRT: number;
					xFant: string;
					CNPJ: string;
					enderEmit: {
						fone: number;
						UF: string;
						xPais: string;
						cPais: number;
						xLgr: string;
						xMun: string;
						nro: number;
						cMun: number;
						xBairro: string;
						CEP: string;
					};
					IE: number;
				};
				dest: {
					xNome: string;
					CPF: number;
					enderDest: {
						fone: number;
						UF: string;
						xPais: string;
						cPais: number;
						xLgr: string;
						xMun: string;
						nro: string;
						cMun: number;
						xBairro: string;
						CEP: string;
					};
					indIEDest: number;
				};
				transp: {
					modFrete: number;
					vol: {
						pesoL: number;
						esp: string;
						qVol: number;
						pesoB: number;
					};
					transporta: {
						xNome: string;
					};
				};
			};
		};
		versao: string;
	};
}

export async function fetchNFEData(chaveAcesso: string): Promise<NfeParams> {
	const embeddings_url = process.env.EMBEDDING_ENDPOINT_URL || '';
	const url = embeddings_url + '/nfe';

	const body = JSON.stringify({ chave_acesso: chaveAcesso });

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	});

	if (!response.ok) {
		throw new Error('Erro ao buscar dados NFE');
	}

	const data = await response.json();
	return data;
}
