"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User } from "lucide-react";
import { useRouter } from "next/navigation";

const formatCPF = (cpf: string) => {
  // Remove all non-numeric characters
  const cleanedCpf = cpf.replace(/\D/g, "");

  // Add formatting (XXX.XXX.XXX-XX)
  if (cleanedCpf.length <= 3) {
    return cleanedCpf;
  }
  if (cleanedCpf.length <= 6) {
    return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3)}`;
  }
  if (cleanedCpf.length <= 9) {
    return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(
      3,
      6
    )}.${cleanedCpf.slice(6)}`;
  }
  return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(
    3,
    6
  )}.${cleanedCpf.slice(6, 9)}-${cleanedCpf.slice(9, 11)}`;
};

const isValidCPF = (cpf: string) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
};

export default function CitizenLogin({}: {}) {
  const [cpf, setCpf] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Tentativa de login com:", cpf, password, "como cidadão");
    // Validate CPF format
    if (!isValidCPF(cpf)) {
      setError(
        "CPF inválido. Por favor, insira um CPF no formato XXX.XXX.XXX-XX."
      );
      return;
    }

    setError(""); // Clear error if CPF is valid
    router.push("/my-profile");
  };

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(event.target.value);
    setCpf(formattedCpf);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm">
            <span>{error}</span>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="cpf-citizen">CPF</Label>
          <Input
            id="cpf-citizen"
            type="text"
            placeholder="123.456.789-10"
            value={cpf}
            onChange={handleCpfChange}
            required
            maxLength={14} // CPF length including dots and hyphen
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-citizen">Senha</Label>
          <div className="relative">
            <Input
              id="password-citizen"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Ocultar senha" : "Mostrar senha"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full mt-6">
        <User className="mr-2 h-4 w-4" />
        Entrar como Cidadão
      </Button>
    </form>
  );
}
