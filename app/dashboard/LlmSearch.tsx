'use client';

import { FunctionComponent } from 'react';
import { useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LlmSearchProps {}

const LlmSearch: FunctionComponent<LlmSearchProps> = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async () => {
		setIsSearching(true);
		setIsSearching(false);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>LLM-Assisted Search</CardTitle>
					<CardDescription>
						Search for items, reports, or any relevant information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex space-x-2">
						<Input
							type="text"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button onClick={handleSearch} disabled={isSearching}>
							{isSearching ? (
								'Searching...'
							) : (
								<Search className="h-4 w-4" />
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			<ScrollArea className="h-[400px]">
				<div className="space-y-4">
					{searchResults.map((item) => (
						<Card key={item.id}>
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
								<CardDescription>{item.type}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{item.description}</p>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Badge>{item.status}</Badge>
							</CardFooter>
						</Card>
					))}
				</div>
			</ScrollArea>
		</>
	);
};

export default LlmSearch;
