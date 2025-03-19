'use client';

import { Button } from '@/components/ui/button';
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
		<div className="bg-black/5 p-2 sm:p-4 lg:p-6 -mx-6 border w-full">
			<h3 className="text w-full text-center font-semibold text-lg">
				Dados do objeto
			</h3>
			<div>
				<Tabs
					defaultValue="scan"
					className="w-full items-center flex flex-col justify-center"
				>
					<TabsList className="mx-auto">
						<TabsTrigger value="scan">
							Buscar nota fiscal
						</TabsTrigger>
						<TabsTrigger value="manual">
							Inserir Manualmente
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="scan"
						className="w-full h-full flex gap-2 items-center justify-center"
					>
						<Button>
							<ScanBarcode />
							Escanear nota fiscal
						</Button>
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
								Conjunto de números próximo ao código de barras.
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
