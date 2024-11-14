"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import AnimatedLogo from "@/components/AnimatedLogo";

// Mock function to simulate AI response
const getAIResponse = async (message: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (message.toLowerCase().includes("roubo")) {
    return "Sinto muito pelo roubo. Você pode me dizer mais sobre o que foi roubado e quando aconteceu? Qualquer detalhe que você possa fornecer será útil para a investigação.";
  } else if (message.toLowerCase().includes("suspeita")) {
    return "Obrigado por relatar uma atividade suspeita. Você pode descrever em detalhes o que viu? Onde e quando isso ocorreu? Qualquer informação pode ser valiosa.";
  } else {
    return "Obrigado pelo seu relato. Toda informação ajuda a manter nossa comunidade segura. Pode fornecer mais detalhes sobre o que aconteceu? Lembre-se, não existe detalhe irrelevante em uma investigação.";
  }
};

export default function NewReport() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Olá! Estou aqui para ajudar você a fazer um relatório. O que você gostaria de relatar hoje? Seja um roubo, atividade suspeita ou qualquer outra coisa, estou aqui para ouvir e coletar os detalhes importantes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [reportDate, setReportDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    const aiResponse = await getAIResponse(input);
    setMessages((prev) => [...prev, { role: "system", content: aiResponse }]);
    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", {
      reportType,
      reportDetails,
      reportLocation,
      reportDate,
    });
    // Aqui você enviaria esses dados para o backend
    // Resetar formulário ou mostrar mensagem de sucesso
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/my-profile">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar a minha página
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">
            <AnimatedLogo className="inline" />
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Enviar Relatório</CardTitle>
            <CardDescription>
              Escolha como gostaria de fornecer informações para ajudar a
              polícia na investigação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai-chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat com IA
                </TabsTrigger>
                <TabsTrigger value="form">
                  <FileText className="h-4 w-4 mr-2" />
                  Formulário
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ai-chat">
                <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </span>
                    </div>
                  ))}
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem aqui..."
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="form">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="report-type">Tipo de Relatório</Label>
                    <Input
                      id="report-type"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      placeholder="ex.: Roubo, Atividade Suspeita"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-details">
                      Detalhes do Incidente
                    </Label>
                    <Textarea
                      id="report-details"
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Forneça o máximo de detalhes possível sobre o ocorrido"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-location">Local</Label>
                    <Input
                      id="report-location"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="Onde o incidente ocorreu?"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-date">Data e Hora</Label>
                    <Input
                      id="report-date"
                      type="datetime-local"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Relatório
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
