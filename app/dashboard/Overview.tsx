'use client';

import { FunctionComponent } from 'react';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

import { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';
import { BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock function to get dashboard stats
const getDashboardStats = async () => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		activeCases: 42,
		solvedCases: 18,
		pendingReports: 7,
		recoveredItems: 15,
	};
};

// Mock function to get chart data
const getChartData = async () => {
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		barData: [
			{ name: 'Active Cases', value: 42 },
			{ name: 'Solved Cases', value: 18 },
			{ name: 'Pending Reports', value: 7 },
			{ name: 'Recovered Items', value: 15 },
		],
		lineData: Array(7)
			.fill(null)
			.map((_, i) => ({
				date: new Date(
					Date.now() - (6 - i) * 86400000
				).toLocaleDateString(),
				reports: Math.floor(Math.random() * 20) + 5,
				recoveries: Math.floor(Math.random() * 10),
			})),
		pieData: [
			{ name: 'Theft', value: 35 },
			{ name: 'Assault', value: 20 },
			{ name: 'Fraud', value: 15 },
			{ name: 'Vandalism', value: 10 },
			{ name: 'Other', value: 20 },
		],
	};
};

interface OverviewProps {}

interface ChartData {
	barData: { name: string; value: number }[];
	lineData: { date: string; reports: number; recoveries: number }[];
	pieData: { name: string; value: number }[];
}

const Overview: FunctionComponent<OverviewProps> = () => {
	interface Stats {
		activeCases: number;
		solvedCases: number;
		pendingReports: number;
		recoveredItems: number;
	}

	const [stats, setStats] = useState<Stats | null>(null);
	const [chartData, setChartData] = useState<ChartData>({
		barData: [],
		lineData: [],
		pieData: [],
	});

	useEffect(() => {
		getDashboardStats().then(setStats);
		getChartData().then(setChartData);
	}, []);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats &&
					Object.entries(stats).map(([key, value]) => (
						<Card key={key}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{key
										.replace(/([A-Z])/g, ' $1')
										.replace(/^./, function (str) {
											return str.toUpperCase();
										})}
								</CardTitle>
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{value}
								</div>
							</CardContent>
						</Card>
					))}
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Case Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={chartData.barData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="value"
										fill="hsl(var(--primary))"
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Weekly Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData.lineData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="reports"
										stroke="hsl(var(--primary))"
									/>
									<Line
										type="monotone"
										dataKey="recoveries"
										stroke="hsl(var(--secondary))"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Case Types Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={chartData.pieData}
										cx="50%"
										cy="50%"
										outerRadius={80}
										fill="hsl(var(--primary))"
										dataKey="value"
										label
									>
										{chartData.pieData.map(
											(entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={`hsl(${
														index * 45
													}, 70%, 60%)`}
												/>
											)
										)}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Overview;
