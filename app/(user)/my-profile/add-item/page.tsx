'use client';

import BarcodeScan from '@/components/BarcodeScan';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { FunctionComponent } from 'react';
import ObjectInfo from './ObjectInfo';

interface AddItemProps {}

const AddItem: FunctionComponent<AddItemProps> = () => {
	return (
		<Card className="max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle>Adicionar Item</CardTitle>
				<CardDescription>
					Registre itens a sua conta a possibilite a recuperação
					posterior.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col px-0 items-center">
				<ObjectInfo />

				<BarcodeScan />
			</CardContent>
		</Card>
	);
};

export default AddItem;
