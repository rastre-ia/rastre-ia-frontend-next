'use client';

import { AnswerRequestSchemaInterface } from '@/app/lib/schemas/AnswerRequests';
import { FunctionComponent } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { latLng } from 'leaflet';

interface ActiveAssistanceRequestsMapProps {
	requests: AnswerRequestSchemaInterface[];
}

const ActiveAssistanceRequestsMap: FunctionComponent<
	ActiveAssistanceRequestsMapProps
> = ({ requests }) => {
	return (
		<MapContainer
			center={[-15.776629, -47.962953]}
			zoom={6}
			style={{ height: '100%', width: '100%' }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{(requests || []).map((request) => (
				<Circle
					key={request._id as string}
					center={latLng(
						request.location.coordinates[1],
						request.location.coordinates[0]
					)}
					radius={request.requestRadius}
					pathOptions={{ color: 'red' }}
				>
					<Popup>
						<h3 className="font-bold">{request.title}</h3>
						<p>{request.message}</p>
					</Popup>
				</Circle>
			))}
		</MapContainer>
	);
};

export default ActiveAssistanceRequestsMap;
