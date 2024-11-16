'use client';

import { FunctionComponent } from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Search, BarChart3, HelpCircle, Send } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LatLngExpression } from 'leaflet';

function MapEvents({
	onClick,
}: {
	onClick: (latlng: { lat: number; lng: number }) => void;
}) {
	useMapEvents({
		click: (e) => onClick(e.latlng),
	});
	return null;
}

interface RequestAssistanceProps {}

const RequestAssistance: FunctionComponent<RequestAssistanceProps> = () => {
	const [assistanceMessage, setAssistanceMessage] = useState('');
	const [center, setCenter] = useState<LatLngExpression>([51.505, -0.09]);
	const [radius, setRadius] = useState(1000);

	const handleSendAssistanceRequest = () => {
		console.log('Sending assistance request:', {
			center,
			radius,
			message: assistanceMessage,
		});
		// Here you would typically send this data to your backend
		setAssistanceMessage('');
	};

	const handleMapClick = (latlng: { lat: number; lng: number }) => {
		setCenter([latlng.lat, latlng.lng]);
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Request Citizen Assistance</CardTitle>
				<CardDescription>
					Select area and send alert to citizens
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="h-[300px]">
					<MapContainer
						center={center}
						zoom={13}
						style={{
							height: '100%',
							width: '100%',
						}}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						<Circle center={center} radius={radius} />
						<MapEvents onClick={handleMapClick} />
					</MapContainer>
				</div>
				<div>
					<Label htmlFor="radius">Radius (meters)</Label>
					<Slider
						id="radius"
						min={100}
						max={5000}
						step={100}
						value={[radius]}
						onValueChange={(value) => setRadius(value[0])}
					/>
				</div>
				<Textarea
					placeholder="Enter message for citizens..."
					value={assistanceMessage}
					onChange={(e) => setAssistanceMessage(e.target.value)}
				/>
				<Button
					onClick={handleSendAssistanceRequest}
					className="w-full"
				>
					<Send className="mr-2 h-4 w-4" />
					Send Assistance Request
				</Button>
			</CardContent>
		</Card>
	);
};

export default RequestAssistance;
