'use client';

import { LatLng } from 'leaflet';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
	() => import('react-leaflet').then((mod) => mod.MapContainer),
	{ ssr: false }
);
const TileLayer = dynamic(
	() => import('react-leaflet').then((mod) => mod.TileLayer),
	{ ssr: false }
);
const Marker = dynamic(
	() => import('react-leaflet').then((mod) => mod.Marker),
	{ ssr: false }
);
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
	ssr: false,
});

interface LeafletMapProps {
	center: [number, number];
	onLocationChange: (latlng: { lat: number; lng: number }) => void;
}

const LeafletMap = ({ center, onLocationChange }: LeafletMapProps) => {
	return (
		<MapContainer
			center={center}
			zoom={13}
			style={{ height: '100%', width: '100%' }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker
				position={center}
				draggable={true}
				eventHandlers={{
					dragend: (e) => {
						const marker = e.target;
						const position = marker.getLatLng();
						onLocationChange(position);
					},
				}}
			>
				<Popup>Arraste o marcador para a localização correta</Popup>
			</Marker>
		</MapContainer>
	);
};

export default LeafletMap;
