import 'leaflet/dist/leaflet.css';
import {
	Search,
	BarChart3,
	HelpCircle,
	User,
	Shield,
	LogOut,
} from 'lucide-react';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Overview from './Overview';
import LlmSearch from './LlmSearch';
import RequestAssistance from './RequestAssistance';
import AnimatedLogo from '@/components/AnimatedLogo';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export default function PoliceDashboard() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<header className="flex justify-between items-center">
					<Link href="/">
						<h1 className="text-3xl font-bold text-primary">
							<AnimatedLogo className="inline" />
						</h1>
					</Link>
					<Popover>
						<PopoverTrigger>
							<Avatar className="">
								<AvatarFallback>
									<User className="h-12 w-12 bg-card" />
								</AvatarFallback>
							</Avatar>
						</PopoverTrigger>
						<PopoverContent className="max-w-sm">
							<form
								action={async () => {
									'use server';
									await signOut({ redirectTo: '/' });
								}}
							>
								<Button
									variant="ghost"
									type="submit"
									className="w-full"
								>
									<LogOut className="mr-2 h-4 w-4" />
									Sair
								</Button>
							</form>
						</PopoverContent>
					</Popover>
				</header>
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">
							<BarChart3 className="h-4 w-4 mr-2" />
							Overview
						</TabsTrigger>
						<TabsTrigger value="search">
							<Search className="h-4 w-4 mr-2" />
							Search
						</TabsTrigger>
						<TabsTrigger value="assistance">
							<HelpCircle className="h-4 w-4 mr-2" />
							Request Assistance
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<Overview />
					</TabsContent>

					<TabsContent value="search" className="space-y-4">
						<LlmSearch />
					</TabsContent>

					<TabsContent value="assistance" className="space-y-4">
						<RequestAssistance />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
