'use client';

import { FunctionComponent, useState, useEffect } from 'react';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

import 'leaflet/dist/leaflet.css';
import { BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Função simulada para obter estatísticas do painel
const obterEstatisticasDoPainel = async (): Promise<Estatisticas> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		casosAtivos: 42,
		casosResolvidos: 18,
		relatoriosPendentes: 7,
		itensRecuperados: 15,
	};
};

// Função simulada para obter dados dos gráficos
const obterDadosDosGraficos = async (): Promise<DadosGraficos> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		dadosBarra: [
			{ nome: 'Casos Ativos', valor: 42 },
			{ nome: 'Casos Resolvidos', valor: 18 },
			{ nome: 'Relatórios Pendentes', valor: 7 },
			{ nome: 'Itens Recuperados', valor: 15 },
		],
		dadosLinha: Array(7)
			.fill(null)
			.map((_, i) => ({
				data: new Date(
					Date.now() - (6 - i) * 86400000
				).toLocaleDateString('pt-BR'),
				relatorios: Math.floor(Math.random() * 20) + 5,
				recuperacoes: Math.floor(Math.random() * 10),
			})),
		dadosPizza: [
			{ nome: 'Roubo', valor: 35 },
			{ nome: 'Assalto', valor: 20 },
			{ nome: 'Fraude', valor: 15 },
			{ nome: 'Vandalismo', valor: 10 },
			{ nome: 'Outros', valor: 20 },
		],
	};
};

interface Estatisticas {
	casosAtivos: number;
	casosResolvidos: number;
	relatoriosPendentes: number;
	itensRecuperados: number;
}

interface DadosGraficos {
	dadosBarra: { nome: string; valor: number }[];
	dadosLinha: { data: string; relatorios: number; recuperacoes: number }[];
	dadosPizza: { nome: string; valor: number }[];
}

const VisaoGeral: FunctionComponent = () => {
	const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
	const [dadosGraficos, setDadosGraficos] = useState<DadosGraficos>({
		dadosBarra: [],
		dadosLinha: [],
		dadosPizza: [],
	});

	useEffect(() => {
		obterEstatisticasDoPainel().then(setEstatisticas);
		obterDadosDosGraficos().then(setDadosGraficos);
	}, []);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{estatisticas &&
					Object.entries(estatisticas).map(([chave, valor]) => (
						<Card key={chave}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{chave
										.replace(/([A-Z])/g, ' $1')
										.replace(/^./, (str) =>
											str.toUpperCase()
										)}
								</CardTitle>
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{valor}
								</div>
							</CardContent>
						</Card>
					))}
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Visão Geral dos Casos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={dadosGraficos.dadosBarra}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="nome" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="valor"
										fill="hsl(var(--primary))"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Tendências Semanais</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={dadosGraficos.dadosLinha}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="data" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="relatorios"
										stroke="hsl(var(--primary))"
									/>
									<Line
										type="monotone"
										dataKey="recuperacoes"
										stroke="hsl(var(--secondary))"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Distribuição dos Tipos de Casos</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={dadosGraficos.dadosPizza}
										cx="50%"
										cy="50%"
										outerRadius={80}
										fill="hsl(var(--primary))"
										dataKey="valor"
										label
									>
										{dadosGraficos.dadosPizza.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={`hsl(${
														index * 45
													}, 70%, 60%)`}
												/>
											)
										)}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default VisaoGeral;
