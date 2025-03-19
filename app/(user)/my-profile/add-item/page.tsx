import BarcodeScan from '@/components/BarcodeScan';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Pencil, ScanBarcode } from 'lucide-react';
import { FunctionComponent } from 'react';

interface AddItemProps {}

const AddItem: FunctionComponent<AddItemProps> = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Adicionar Item</CardTitle>
				<CardDescription>
					Registre itens a sua conta a possibilite a recuperação
					posterior.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button>
					<ScanBarcode />
					Escanear nota fiscal
				</Button>
				<Button>
					<Pencil />
					Inserir manualmente
				</Button>

				<BarcodeScan />
			</CardContent>
		</Card>
	);
};

export default AddItem;
