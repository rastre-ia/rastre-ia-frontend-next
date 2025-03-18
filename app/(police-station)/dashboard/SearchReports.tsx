'use client';

import {
	AlertTriangle,
	Car,
	ChevronLeft,
	ChevronRight,
	HelpCircle,
	Package2,
	PackageOpen,
	Search,
	Siren,
	Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { getReports } from '@/app/_helpers/db/reports';
import reportStatusTranslator from '@/app/_helpers/report-status-translator';
import {
	ReportAssistanceNeededEnum,
	ReportSchemaInterface,
	ReportStatusEnum,
	ReportTypeEnum,
} from '@/app/lib/schemas/Reports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

import reportTypeTranslator from '@/app/_helpers/report-type-translator';
import { AnswerRequestEventTypeEnum } from '@/app/lib/schemas/helpers/AnswerRequestsEnums';
import RequestAssistDialog from '@/components/RequestAssistDialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const iconesTipoRelato = {
	[ReportTypeEnum.STRANGE_ACTIVITY]: AlertTriangle,
	[ReportTypeEnum.TRAFFIC]: Car,
	[ReportTypeEnum.PEACE_DISTURBANCE]: Volume2,
	[ReportTypeEnum.PHYSICAL_ASSAULT]: Siren,
	[ReportTypeEnum.ROBBERY]: Package2,
	[ReportTypeEnum.OBJECT_FOUND]: PackageOpen,
	[ReportTypeEnum.OTHER]: HelpCircle,
};

const estilosTipoRelato = {
	[ReportTypeEnum.STRANGE_ACTIVITY]: 'border-l-4 border-l-yellow-500',
	[ReportTypeEnum.TRAFFIC]: 'border-l-4 border-l-blue-500',
	[ReportTypeEnum.PEACE_DISTURBANCE]: 'border-l-4 border-l-purple-500',
	[ReportTypeEnum.PHYSICAL_ASSAULT]: 'border-l-4 border-l-red-500',
	[ReportTypeEnum.ROBBERY]: 'border-l-4 border-l-black',
	[ReportTypeEnum.OBJECT_FOUND]: 'border-l-4 border-l-green-500',
	[ReportTypeEnum.OTHER]: 'border-l-4 border-l-gray-500',
};

const coresIconesTipoRelato = {
	[ReportTypeEnum.STRANGE_ACTIVITY]: 'text-yellow-500',
	[ReportTypeEnum.TRAFFIC]: 'text-blue-500',
	[ReportTypeEnum.PEACE_DISTURBANCE]: 'text-purple-500',
	[ReportTypeEnum.PHYSICAL_ASSAULT]: 'text-red-500',
	[ReportTypeEnum.ROBBERY]: 'text-black',
	[ReportTypeEnum.OBJECT_FOUND]: 'text-green-500',
	[ReportTypeEnum.OTHER]: 'text-gray-500',
};

export default function BuscarRelatos() {
	const [reports, setReports] = useState<ReportSchemaInterface[]>([]);
	const [paginaAtual, setPaginaAtual] = useState(1);
	const [pageCount, setPageCount] = useState<number>(1);
	const [perPage] = useState(12);

	const [statusFilter, setStatusFilter] = useState<ReportStatusEnum | null>(
		null
	);
	const [typeFilter] = useState<ReportTypeEnum | null>(null);

	const [busca, setBusca] = useState('');
	const [carregando, setCarregando] = useState(false);

	useEffect(() => {
		carregarRelatos();
	}, [paginaAtual, statusFilter, typeFilter]);

	const carregarRelatos = async () => {
		setCarregando(true);
		const response = await getReports(
			perPage,
			paginaAtual,
			statusFilter,
			typeFilter
		);

		setReports(response.reports);
		setPageCount(response.pageCount);
		setCarregando(false);
	};

	const handleBusca = () => {
		setPaginaAtual(1);
		carregarRelatos();
	};

	const handleAlterarFiltro = (valor: string) => {
		if (valor === 'todos') setStatusFilter(null);
		else {
			setStatusFilter(valor as ReportStatusEnum);
		}
		setPaginaAtual(1);
	};

	return (
		<TooltipProvider>
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

					<Select
						value={statusFilter?.toString() || 'todos'}
						onValueChange={handleAlterarFiltro}
					>
						<SelectTrigger>
							<SelectValue placeholder="Filtrar por status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="todos">Todos</SelectItem>
							{Object.values(ReportStatusEnum).map(
								(status, idx) => (
									<SelectItem
										key={`status-${idx}`}
										value={status}
									>
										{reportStatusTranslator(status)}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<ScrollArea>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{reports.map((relato, idx) => {
						if (
							relato._id === undefined ||
							relato.location === undefined
						)
							return null;
						const Icone = iconesTipoRelato[relato.type];
						return (
							<RequestAssistDialog
								location={relato.location}
								title={relato.title}
								id={relato._id}
								key={`RequestAssistDialog-${idx}`}
								type={AnswerRequestEventTypeEnum.REPORTS}
								formattedData={`Título: ${relato.title}\nDescrição: ${relato.description}`}
							>
								<Card
									key={`card-report-${idx}`}
									className={`${
										estilosTipoRelato[relato.type]
									} transition-all ease-in-out duration-100 hover:shadow-lg cursor-pointer`}
								>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-md font-medium">
											{relato.title}
										</CardTitle>
										<Tooltip delayDuration={0}>
											<TooltipTrigger>
												<Icone
													className={`h-4 w-4 ${
														coresIconesTipoRelato[
															relato.type
														]
													}`}
												/>
											</TooltipTrigger>
											<TooltipContent>
												{reportTypeTranslator(
													relato.type
												)}
											</TooltipContent>
										</Tooltip>
									</CardHeader>

									{relato.createdAt !== undefined && (
										<CardContent>
											<p className="text-xs text-muted-foreground">
												Enviado em{' '}
												{format(
													relato.createdAt,
													'dd/MM/yyyy HH:mm'
												)}
											</p>
											<p className="mt-2">
												{relato.description}
											</p>
										</CardContent>
									)}
									<CardFooter className="flex justify-between items-center">
										<Badge
											variant={
												relato.status ===
												ReportStatusEnum.PENDING
													? 'default'
													: relato.status ===
													  ReportStatusEnum.RESOLVED
													? 'secondary'
													: 'outline'
											}
										>
											{reportStatusTranslator(
												relato.status
											)}
										</Badge>
										{relato.assistanceNeeded ===
											ReportAssistanceNeededEnum.REQUIRE_ASSISTANCE && (
											<Badge variant="destructive">
												Precisa de assistência
											</Badge>
										)}
									</CardFooter>
								</Card>
							</RequestAssistDialog>
						);
					})}
				</div>
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
					Página {paginaAtual} / {pageCount}
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setPaginaAtual((prev) =>
								Math.min(prev + 1, pageCount)
							)
						}
						disabled={paginaAtual === pageCount}
					>
						Próxima
						<ChevronRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</Pagination>
		</TooltipProvider>
	);
}
