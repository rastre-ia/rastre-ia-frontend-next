'use client';

import BarcodeScan from '@/components/BarcodeScan';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScanBarcode } from 'lucide-react';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
	acessKey: z.string().min(2, {
		message: 'A chave deve conter 28 caracteres',
	}),
});
interface ObjectInfoProps {}

const ObjectInfo: FunctionComponent<ObjectInfoProps> = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			acessKey: '',
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
	}

	return (
		<div className="bg-black/5 p-2 sm:px-4 lg:px-6 -mx-6 border w-full space-y-3">
			<h3 className="text w-full text-center font-semibold text-lg">
				Dados do objeto
			</h3>
			<div>
				<Tabs
					defaultValue="scan"
					className="w-full items-center flex flex-col justify-center"
				>
					<TabsList className="mx-auto mb-4">
						<TabsTrigger value="scan">
							Buscar nota fiscal
						</TabsTrigger>
						<TabsTrigger value="manual">
							Inserir Manualmente
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="scan"
						className="w-full h-full flex flex-col sm:flex-row gap-2 items-center justify-center"
					>
						<Dialog>
							<DialogTrigger>
								<Button asChild>
									<span>
										<ScanBarcode />
										Escanear Nota Fiscal
									</span>
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Escaneando Código de Barras
									</DialogTitle>
									<DialogDescription>
										Aponte a câmera para o código de barras
										na Nota Fiscal do produto.
									</DialogDescription>
								</DialogHeader>
								<div className="-mx-4">
									<BarcodeScan />
								</div>
							</DialogContent>
						</Dialog>

						<p>ou</p>
						<div className="bg-white p-2 border rounded-lg flex flex-col gap-2 w-full">
							<div className="gap-2 flex w-full">
								<Input
									placeholder="xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx"
									className="w-full"
								/>
								<Button>Enviar</Button>
							</div>
							<p className="text-muted-foreground text-xs">
								[Chave de Acesso] Encontrada próximo ao código
								de barras.
							</p>
						</div>
					</TabsContent>
					<TabsContent value="manual">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-2/3 space-y-6"
							>
								<FormField
									control={form.control}
									name="acessKey"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Inserir Chave de Acesso
											</FormLabel>
											<FormControl>
												<Input
													placeholder="xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Conjunto de números próximo ao
												código de barras.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Submit</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ObjectInfo;
