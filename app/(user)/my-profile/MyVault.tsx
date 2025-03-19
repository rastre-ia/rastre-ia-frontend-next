'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight, ScanBarcode, Vault } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';

interface MyVaultProps {}

const MyVault: FunctionComponent<MyVaultProps> = () => {
	const [showMyItems, setShowMyItems] = useState(false);

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
						Registre itens a sua conta a possibilite a recuperação
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
				LIST of ITEMS
			</div>
		</Card>
	);
};

export default MyVault;
