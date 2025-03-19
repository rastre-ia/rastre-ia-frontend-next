'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Html5Qrcode,
	Html5QrcodeScanType,
	Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { QrCode, ShieldX } from 'lucide-react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const BarcodeScan: FunctionComponent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const scannerRef = useRef<Html5Qrcode | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const config: Html5QrcodeScannerConfig = {
		fps: 10,
		qrbox: 300,
		rememberLastUsedCamera: true,
		supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
		formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
		useBarCodeDetectorIfSupported: true,
		showTorchButtonIfSupported: true,
		videoConstraints: {
			frameRate: 10,
		},
	};
	const [scannedValue, setScannedValue] = useState('asdasdfasdf');

	const handleSubmit = async (decodedText: string) => {
		setIsLoading(true);

		console.log(decodedText);

		setError('');

		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsLoading(false);
	};

	const parseError = (error: unknown): string => {
		if (error instanceof Error) {
			switch (error.message) {
				case 'Permission denied':
					return 'Acesso à câmera negado';
				default:
					return error.message;
			}
		}
		return 'Erro desconhecido';
	};

	const startScanner = async () => {
		if (scannerRef.current) return;
		setIsLoading(true);
		setError('');

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			stream.getTracks().forEach((track) => track.stop());

			if (!containerRef.current) {
				throw new Error('Scanner container not found');
			}

			scannerRef.current = new Html5Qrcode(containerRef.current.id);
			await scannerRef.current.start(
				{ facingMode: 'environment' },
				config,
				(decodedText) => {
					setScannedValue(decodedText);

					handleSubmit(decodedText);
					stopScanner();
					console.log(decodedText);
				},
				() => {}
			);
		} catch (err) {
			console.error(err);
			setError(parseError(err));
		} finally {
			setIsLoading(false);
		}
	};

	const stopScanner = async () => {
		if (scannerRef.current) {
			try {
				await scannerRef.current.stop();
				scannerRef.current.clear();
				scannerRef.current = null;
			} catch (error) {
				console.error('Error stopping scanner:', error);
			}
		}
	};

	useEffect(() => {
		return () => {
			stopScanner();
		};
	}, []);

	return (
		<>
			<div
				ref={containerRef}
				id="qr-scanner"
				className="w-full rounded-md overflow-hidden shadow-md"
			/>

			{isLoading && (
				<div className="flex items-center gap-4">
					Abrindo a câmera...
					<RotatingLines
						ariaLabel="loading-spinner"
						strokeColor="white"
						width="24"
					/>
				</div>
			)}

			{!isLoading && !scannerRef.current && (
				<p className="text-sm">
					Para escanear o código, precisamos de acesso à sua câmera.
				</p>
			)}

			<div className="flex flex-col gap-3 w-full">
				{!scannerRef.current && (
					<Button
						onClick={startScanner}
						disabled={isLoading}
						className="w-full"
						variant={'outline'}
					>
						<QrCode className="mr-2" /> Escanear QR Code
					</Button>
				)}
			</div>

			{error && (
				<Alert variant="destructive" className="w-full">
					<ShieldX color="white" />
					<AlertTitle>Ops, algo deu errado!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div>{scannedValue}</div>
		</>
	);
};

export default BarcodeScan;
