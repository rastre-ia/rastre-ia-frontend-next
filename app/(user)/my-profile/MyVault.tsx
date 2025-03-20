'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import Dropdown components from shadcn/ui
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	ChevronRight,
	EllipsisVertical,
	ScanBarcode,
	Search,
	Vault,
} from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
interface ItemInterface {
	title: string;
	status: 'stolen' | 'lost' | 'default';
}

const userItems: ItemInterface[] = [
	{
		title: 'Iphone 12 Pro Max 256GB',
		status: 'default',
	},
	{
		title: 'Apple Watch Series 6',
		status: 'lost',
	},
	{
		title: 'Bicicleta Caloi Elite 30',
		status: 'stolen',
	},
];

interface MyVaultProps {}

const MyVault: FunctionComponent<MyVaultProps> = () => {
	const [showMyItems, setShowMyItems] = useState(false);
	const [items, setItems] = useState<ItemInterface[]>(userItems);
	const handleStatusChange = (
		index: number,
		newStatus: 'stolen' | 'lost' | 'default'
	) => {
		const updatedItems = [...items];
		updatedItems[index].status = newStatus;
		setItems(updatedItems);
	};

	const handleDelete = (index: number) => {
		const updatedItems = items.filter((_, i) => i !== index);
		setItems(updatedItems);
	};

	return (
		<Card className="flex justify-between transition-all duration-500 ease-in-out flex-col sm:flex-row overflow-hidden">
			<div
				className={cn(
					'transition-all duration-500 ease-in-out',
					showMyItems ? 'w-full sm:w-2/5' : 'w-full'
				)}
			>
				<CardHeader>
					<div className="flex justify-between w-full">
						<CardTitle>Meu Cofre</CardTitle>
						<Button
							variant={'ghost'}
							size={'icon'}
							className={cn(
								'-mr-5 -mt-3',
								showMyItems ? '' : 'hidden'
							)}
							onClick={() => setShowMyItems(false)}
						>
							<ChevronRight />
						</Button>
					</div>
					<CardDescription>
						Registre itens a sua conta e possibilite a recuperação
						posterior.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className={cn('flex justify-center')}>
						<div
							className={cn(
								'flex',
								showMyItems
									? 'flex-row sm:flex-col gap-2'
									: 'flex-row sm:flex-row gap-6'
							)}
						>
							<Link href="/my-profile/add-item">
								<Button
									className={cn(
										'flex items-center justify-center w-full sm:w-auto',
										showMyItems
											? ''
											: 'h-full aspect-square flex-col space-y-6'
									)}
								>
									<ScanBarcode
										style={{
											scale: showMyItems ? 1 : 4,
											transition:
												'scale 200ms ease-in-out',
										}}
										className={cn(
											showMyItems ? '' : 'mt-5'
										)}
									/>
									<span className="text-sm">
										Adicionar Item
									</span>
								</Button>
							</Link>

							<Button
								variant="outline"
								className={cn(
									'flex items-center justify-center w-full sm:w-auto',
									showMyItems
										? ''
										: 'h-full aspect-square flex-col space-y-6'
								)}
								onClick={() => {
									if (!showMyItems) {
										setShowMyItems(true);
									} else {
										setShowMyItems(false);
									}
								}}
							>
								<Vault
									style={{
										scale: showMyItems ? 1 : 4,
										transition: 'scale 200ms ease-in-out',
									}}
									className={cn(showMyItems ? '' : 'mt-5')}
								/>
								<span className="text-sm">
									{showMyItems
										? 'Fechar Itens'
										: 'Ver Meus Itens'}
								</span>
							</Button>
						</div>
					</div>
				</CardContent>
			</div>
			<div
				className={cn(
					'bg-black/5 shadow-inner border-l transition-all duration-500 ease-in-out overflow-hidden w-full sm:w-0',
					showMyItems
						? 'max-h-screen sm:max-h-full sm:w-3/5'
						: 'max-h-0'
				)}
			>
				<div className="w-full p-2 flex gap-2">
					<Input
						placeholder="Buscar itens"
						className="w-full bg-white"
					/>
					<Button size={'icon'}>
						<Search />
					</Button>
				</div>
				{items.map((item, index) => (
					<div
						key={`user-item-${item.title}-${index}`}
						className={cn(
							'm-2 ml-0 rounded-r-xl flex py-1 px-2 border-b border-l-8 justify-between items-center transition-all duration-200 hover:scale-105 hover:shadow-md',
							item.status === 'stolen'
								? 'bg-red-100 border-red-500 text-red-500'
								: item.status === 'lost'
								? 'bg-yellow-100 border-yellow-500 text-yellow-500'
								: 'bg-gray-100 border-gray-700 text-gray-700'
						)}
					>
						<div>
							<h3 className="font-semibold">{item.title}</h3>
							<p className="text-sm">
								{item.status === 'default'
									? null
									: item.status === 'stolen'
									? 'Roubado'
									: 'Perdido'}
							</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant={'ghost'}
									size={'icon'}
									className="hover:bg-gray-200 rounded-full"
								>
									<EllipsisVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-40">
								<DropdownMenuItem
									className="cursor-pointer hover:bg-gray-100"
									onClick={() =>
										handleStatusChange(index, 'lost')
									}
								>
									Perdido
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-gray-100"
									onClick={() =>
										handleStatusChange(index, 'stolen')
									}
								>
									Roubado
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-gray-100"
									onClick={() =>
										handleStatusChange(index, 'default')
									}
								>
									Recuperado
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer text-red-600 hover:bg-red-50"
									onClick={() => handleDelete(index)}
								>
									Excluir
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				))}
			</div>
		</Card>
	);
};

export default MyVault;
