'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	Search,
	Filter,
	AlertTriangle,
	Car,
	Volume2,
	Siren,
	Package2,
	HelpCircle,
	ChevronRight,
	ChevronLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination } from '@/components/ui/pagination';

enum TipoRelato {
	ATIVIDADE_ESTRANHA = 'ATIVIDADE_ESTRANHA',
	TRANSITO = 'TRANSITO',
	DISTURBIO_PAZ = 'DISTURBIO_PAZ',
	AGRESSAO_FISICA = 'AGRESSAO_FISICA',
	ROUBO = 'ROUBO',
	OUTRO = 'OUTRO',
}

const iconesTipoRelato = {
	[TipoRelato.ATIVIDADE_ESTRANHA]: AlertTriangle,
	[TipoRelato.TRANSITO]: Car,
	[TipoRelato.DISTURBIO_PAZ]: Volume2,
	[TipoRelato.AGRESSAO_FISICA]: Siren,
	[TipoRelato.ROUBO]: Package2,
	[TipoRelato.OUTRO]: HelpCircle,
};

const estilosTipoRelato = {
	[TipoRelato.ATIVIDADE_ESTRANHA]: 'border-l-4 border-l-yellow-500',
	[TipoRelato.TRANSITO]: 'border-l-4 border-l-blue-500',
	[TipoRelato.DISTURBIO_PAZ]: 'border-l-4 border-l-purple-500',
	[TipoRelato.AGRESSAO_FISICA]: 'border-l-4 border-l-red-500',
	[TipoRelato.ROUBO]: 'border-l-4 border-l-green-500',
	[TipoRelato.OUTRO]: 'border-l-4 border-l-gray-500',
};

const coresIconesTipoRelato = {
	[TipoRelato.ATIVIDADE_ESTRANHA]: 'text-yellow-500',
	[TipoRelato.TRANSITO]: 'text-blue-500',
	[TipoRelato.DISTURBIO_PAZ]: 'text-purple-500',
	[TipoRelato.AGRESSAO_FISICA]: 'text-red-500',
	[TipoRelato.ROUBO]: 'text-green-500',
	[TipoRelato.OUTRO]: 'text-gray-500',
};

interface Relato {
	id: number;
	titulo: string;
	descricao: string;
	status: string;
	data: string;
	tipo: TipoRelato;
	precisaAssistencia: boolean;
}

// Função simulada para buscar relatos
const buscarRelatos = async (
	pagina: number,
	filtro: string
): Promise<{
	relatos: Relato[];
	totalPaginas: number;
}> => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		relatos: Array(12)
			.fill(null)
			.map((_, i) => ({
				id: i + 1 + (pagina - 1) * 12,
				titulo: `Relato ${i + 1 + (pagina - 1) * 12}`,
				descricao: `Descrição do Relato ${i + 1 + (pagina - 1) * 12}`,
				status: ['Ativo', 'Pendente', 'Resolvido'][
					Math.floor(Math.random() * 3)
				],
				data: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000)
				).toLocaleDateString(),
				tipo: Object.values(TipoRelato)[
					Math.floor(Math.random() * Object.values(TipoRelato).length)
				],
				precisaAssistencia: Math.random() > 0.5,
			})),
		totalPaginas: 10,
	};
};

export default function BuscarRelatos() {
	const [relatos, setRelatos] = useState<Relato[]>([]);
	const [paginaAtual, setPaginaAtual] = useState(1);
	const [totalPaginas, setTotalPaginas] = useState(1);
	const [filtro, setFiltro] = useState('todos');
	const [busca, setBusca] = useState('');
	const [carregando, setCarregando] = useState(false);

	useEffect(() => {
		carregarRelatos();
	}, [paginaAtual, filtro]);

	const carregarRelatos = async () => {
		setCarregando(true);
		const { relatos, totalPaginas } = await buscarRelatos(
			paginaAtual,
			filtro
		);
		setRelatos(relatos);
		setTotalPaginas(totalPaginas);
		setCarregando(false);
	};

	const handleBusca = () => {
		setPaginaAtual(1);
		carregarRelatos();
	};

	const handleAlterarFiltro = (valor: string) => {
		setFiltro(valor);
		setPaginaAtual(1);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Busca e Filtros</CardTitle>
					<CardDescription>
						Utilize as opções abaixo para encontrar relatos
						específicos.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex space-x-2">
						<Input
							type="text"
							placeholder="Buscar relatos..."
							value={busca}
							onChange={(e) => setBusca(e.target.value)}
							className="flex-grow"
						/>
						<Button onClick={handleBusca} disabled={carregando}>
							<Search className="h-4 w-4 mr-2" />
							Buscar
						</Button>
					</div>
					<Select value={filtro} onValueChange={handleAlterarFiltro}>
						<SelectTrigger>
							<SelectValue placeholder="Filtrar por status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							<SelectItem value="ativo">Ativo</SelectItem>
							<SelectItem value="pendente">Pendente</SelectItem>
							<SelectItem value="resolvido">Resolvido</SelectItem>
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<ScrollArea>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				>
					{relatos.map((relato) => {
						const Icone = iconesTipoRelato[relato.tipo];
						return (
							<Card
								key={relato.id}
								className={`${estilosTipoRelato[relato.tipo]}`}
							>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-md font-medium">
										{relato.titulo}
									</CardTitle>
									<Icone
										className={`h-4 w-4 ${
											coresIconesTipoRelato[relato.tipo]
										}`}
									/>
								</CardHeader>
								<CardContent>
									<p className="text-xs text-muted-foreground">
										Enviado em {relato.data}
									</p>
									<p className="mt-2">{relato.descricao}</p>
								</CardContent>
								<CardFooter className="flex justify-between items-center">
									<Badge
										variant={
											relato.status === 'Ativo'
												? 'default'
												: relato.status === 'Pendente'
												? 'secondary'
												: 'outline'
										}
									>
										{relato.status}
									</Badge>
									{relato.precisaAssistencia && (
										<Badge variant="destructive">
											Precisa de assistência
										</Badge>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</motion.div>
			</ScrollArea>

			<Pagination>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setPaginaAtual((prev) => Math.max(prev - 1, 1))
					}
					disabled={paginaAtual === 1}
				>
					<ChevronLeft className="h-4 w-4 mr-2" />
					Anterior
				</Button>
				<div className="mx-4">
					Página {paginaAtual} / {totalPaginas}
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setPaginaAtual((prev) =>
								Math.min(prev + 1, totalPaginas)
							)
						}
						disabled={paginaAtual === totalPaginas}
					>
						Próxima
						<ChevronRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</Pagination>
		</>
	);
}
