'use client';
import 'leaflet/dist/leaflet.css';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

import 'leaflet-defaulticon-compatibility';

import { useEffect, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface LatLng {
	lat: number;
	lng: number;
}

interface LocationMarkerProps {
	position: LatLng | null;
	setPosition: (position: LatLng) => void;
}

const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

export default function LocationMarker({
	position,
	setPosition,
}: LocationMarkerProps) {
	const [address, setAddress] = useState<string | null>(null);

	const map = useMapEvents({
		locationfound(e) {
			setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	useEffect(() => {
		map.locate({ setView: true, maxZoom: 16 });
	}, [map]);

	const handleDrag = (event: {
		target: { getLatLng: () => { lat: number; lng: number } };
	}) => {
		const { lat, lng } = event.target.getLatLng();
		setPosition({ lat, lng });
	};

	const fetchAddress = async (lat: number, lng: number) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
			);
			const data = await response.json();
			const addressComponents = [
				data.address.road,
				data.address.neighbourhood,
				data.address.city,
				data.address.state,
				data.address.postcode,
			];
			setAddress(addressComponents.filter(Boolean).join(', '));
		} catch (error) {
			console.error('Erro ao buscar endereço:', error);
			setAddress('Endereço não encontrado');
		}
	};

	useEffect(() => {
		if (position) {
			fetchAddress(position.lat, position.lng);
		}
	}, [position]);

	return position === null ? null : (
		<Marker
			position={position}
			icon={customIcon}
			draggable
			eventHandlers={{ dragend: handleDrag }}
		>
			<Popup>{address || 'Carregando endereço...'}</Popup>
		</Marker>
	);
}
