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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Check, ScanBarcode } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const WithInvoiceSchema = z.object({
	nfeKey: z
		.string()
		.min(44, 'Chave de acesso deve ter 44 dígitos')
		.regex(/^\d+$/, 'Apenas números são permitidos'),
	extraNotes: z.string().optional(),
	images: z
		.custom<FileList>()
		.refine(
			(files) => files.length > 0,
			'Pelo menos uma imagem é necessária'
		),
});

const WithoutInvoiceSchema = z.object({
	productName: z.string().min(2, 'Nome do produto é obrigatório'),
	brand: z.string().min(2, 'Marca é obrigatória'),
	model: z.string().min(2, 'Modelo é obrigatório'),
	serialNumber: z.string().optional(),
	description: z
		.string()
		.min(10, 'Descrição deve ter pelo menos 10 caracteres'),
	uniqueFeatures: z.string().min(10, 'Descreva características únicas'),
	extraNotes: z.string().optional(),
	images: z
		.custom<FileList>()
		.refine(
			(files) => files.length > 0,
			'Pelo menos uma imagem é necessária'
		),
});

interface ObjectInfoProps {}

const ObjectInfo: FunctionComponent<ObjectInfoProps> = () => {
	const withInvoiceForm = useForm<z.infer<typeof WithInvoiceSchema>>({
		resolver: zodResolver(WithInvoiceSchema),
		defaultValues: { nfeKey: '' },
	});
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const withoutInvoiceForm = useForm<z.infer<typeof WithoutInvoiceSchema>>({
		resolver: zodResolver(WithoutInvoiceSchema),
		defaultValues: {
			productName: '',
			brand: '',
			model: '',
			description: '',
			uniqueFeatures: '',
		},
	});

	const handleWithInvoiceSubmit = (
		data: z.infer<typeof WithInvoiceSchema>
	) => {
		console.log('With Invoice Data:', data);
		console.log('Image URL:', imageUrl);
	};

	const handleWithoutInvoiceSubmit = (
		data: z.infer<typeof WithoutInvoiceSchema>
	) => {
		console.log('Without Invoice Data:', data);
	};

	const formatNfeKey = (value: string) => {
		const cleanValue = value.replace(/\D/g, '').slice(0, 44);
		return cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
	};

	const handleScan = (decodedText: string) => {
		withInvoiceForm.setValue('nfeKey', decodedText);
	};

	return (
		<Tabs defaultValue="with-invoice" className="flex flex-col w-full">
			<TabsList className="mx-auto mb-4">
				<TabsTrigger value="with-invoice">
					Possuo a Nota Fiscal
				</TabsTrigger>
				<TabsTrigger value="without-invoice">
					Cadastrar sem Nota
				</TabsTrigger>
			</TabsList>

			{/* With Invoice Tab */}
			<div className="bg-black/5 p-2 sm:p-4 lg:p-6 border w-full space-y-3">
				<TabsContent value="with-invoice" className="space-y-4">
					<Form {...withInvoiceForm}>
						<form
							onSubmit={withInvoiceForm.handleSubmit(
								handleWithInvoiceSubmit
							)}
							className="space-y-6"
						>
							<div className="flex flex-col gap-4">
								<Dialog>
									<DialogTrigger asChild>
										<Button type="button">
											<ScanBarcode className="mr-2 h-4 w-4" />
											Escanear Nota Fiscal
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Escaneando Código de Barras
											</DialogTitle>
											<DialogDescription>
												Aponte a câmera para o código de
												barras na Nota Fiscal do
												produto.
											</DialogDescription>
										</DialogHeader>
										<BarcodeScan onScan={handleScan} />
									</DialogContent>
								</Dialog>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-background px-2 text-muted-foreground">
											ou
										</span>
									</div>
								</div>

								<FormField
									control={withInvoiceForm.control}
									name="nfeKey"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Chave de Acesso
											</FormLabel>
											<FormControl>
												<Input
													placeholder="xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx"
													value={formatNfeKey(
														field.value
													)}
													onChange={(e) =>
														field.onChange(
															e.target.value.replace(
																/\s/g,
																''
															)
														)
													}
												/>
											</FormControl>
											<FormDescription>
												Chave de 44 dígitos encontrada
												na nota fiscal
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={withInvoiceForm.control}
								name="extraNotes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Observações Adicionais
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Informações adicionais que possam ajudar na identificação"
												className="resize-none"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={withInvoiceForm.control}
								name="images"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2 mb-2">
											<Camera className="h-4 w-4" />
											Imagens
										</FormLabel>
										<CldUploadWidget
											uploadPreset="ml_default"
											onSuccess={(result) => {
												setImageUrl(
													// @ts-expect-error - result.info is not null
													result.info?.secure_url
												);
											}}
											onQueuesEnd={(
												result,
												{ widget }
											) => {
												widget.close();
											}}
										>
											{({ open }) => (
												<Button
													type="button"
													onClick={() => open()}
												>
													<Camera className="h-4 w-4 mr-2" />
													Upload da Foto
												</Button>
											)}
										</CldUploadWidget>
										<FormDescription>
											Adicione fotos que mostrem detalhes
											do produto
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex flex-row-reverse">
								<Button type="submit">
									<Check />
									Cadastrar Objeto
								</Button>
							</div>
						</form>
					</Form>
				</TabsContent>

				{/* Without Invoice Tab */}
				<TabsContent value="without-invoice" className="space-y-4">
					<Form {...withoutInvoiceForm}>
						<form
							onSubmit={withoutInvoiceForm.handleSubmit(
								handleWithoutInvoiceSubmit
							)}
							className="space-y-6"
						>
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={withoutInvoiceForm.control}
									name="productName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nome do Produto
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={withoutInvoiceForm.control}
									name="brand"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Marca</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={withoutInvoiceForm.control}
									name="model"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Modelo</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={withoutInvoiceForm.control}
									name="serialNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Número de Série (Opcional)
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={withoutInvoiceForm.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Descrição do Produto
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Descreva o produto em detalhes"
												className="resize-none h-32"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={withoutInvoiceForm.control}
								name="uniqueFeatures"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Características Únicas
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Descreva marcas, danos, personalizações ou outras características identificáveis"
												className="resize-none h-32"
											/>
										</FormControl>
										<FormDescription>
											Exemplos: "Arranhão na tampa
											traseira", "Adesivo personalizado",
											"Iniciais gravadas"
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={withoutInvoiceForm.control}
								name="extraNotes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Observações Adicionais
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Qualquer informação adicional relevante"
												className="resize-none"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={withoutInvoiceForm.control}
								name="images"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Fotos de Identificação
										</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												multiple
												onChange={(e) =>
													field.onChange(
														e.target.files
													)
												}
											/>
										</FormControl>
										<FormDescription>
											Adicione fotos claras mostrando o
											produto e suas características
											únicas
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit">Cadastrar Produto</Button>
						</form>
					</Form>
				</TabsContent>
			</div>
		</Tabs>
	);
};

export default ObjectInfo;
