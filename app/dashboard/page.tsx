"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

//@ts-ignore
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { Search, BarChart3, Map, Package, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LatLng {
  lat: number;
  lng: number;
}

// Define tipos para os resultados da pesquisa
interface SearchResult {
  id: number;
  name: string;
  description: string;
  location: [number, number];
}

// Função simulada para consulta ao banco de dados vetorial
const searchVectorDB = async (query: string): Promise<SearchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 1,
      name: "iPhone 12",
      description: "Preto, 128GB",
      location: [-23.564, -46.652] as [number, number],
    },
    {
      id: 2,
      name: "MacBook Pro",
      description: "15 polegadas, 2019",
      location: [51.51, -0.1] as [number, number],
    },
    {
      id: 3,
      name: "Relógio Rolex",
      description: "Submariner, Aço",
      location: [51.515, -0.09] as [number, number],
    },
  ].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter(); // Use useRouter from Next.js
  //   const map = useMapEvents({
  //     click: () => {
  //       map.off();
  //     },
  //   });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    const results = await searchVectorDB(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleLogout = () => {
    console.log("Saindo");
    router.push("/login"); // Use router.push to navigate
  };

  const center: LatLng = { lat: -23.564, lng: -46.652 };

  const SidebarContent = () => (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start">
        <BarChart3 className="mr-2 h-4 w-4" />
        Itens roubados
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        Solicitar assistência pública
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        Colaboração civil
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-red-600"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {!isMobile && (
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md flex flex-col"
        >
          <h1 className="text-2xl font-bold text-primary mb-6">RastreIA</h1>
          <SidebarContent />
        </motion.aside>
      )}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    RastreIA
                  </h2>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Dashboard de Itens Roubados
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pesquisar Itens Roubados</CardTitle>
                <CardDescription>
                  Insira os detalhes do item para pesquisar no banco de dados
                  inteligente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Pesquisar itens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      "Buscando..."
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">
                  <Package className="mr-2 h-4 w-4" /> Lista de Itens
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="mr-2 h-4 w-4" /> Mapa de Calor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="map">
                <Card>
                  <CardContent className="p-0">
                    <div className="h-[400px] md:h-[600px]">
                      <MapContainer
                        center={center}
                        zoom={9}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <HeatmapLayer
                          points={searchResults}
                          longitudeExtractor={(m: any) => m.location[1]}
                          latitudeExtractor={(m: any) => m.location[0]}
                          intensityExtractor={(m: any) => 1}
                        />
                        {searchResults.map((item) => (
                          <Marker key={item.id} position={item.location}>
                            <Popup>
                              <b>{item.name}</b>
                              <br />
                              {item.description}
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
