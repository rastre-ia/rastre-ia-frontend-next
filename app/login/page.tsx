"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, ArrowLeft, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (
    event: React.FormEvent,
    userType: "citizen" | "police"
  ) => {
    event.preventDefault();
    // Here you would typically validate the credentials against your backend
    console.log("Login attempted with:", email, password, "as", userType);
    // For demo purposes, we'll just redirect to the appropriate page
    if (userType === "citizen") {
      router.push("/my-page");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <Card className="w-full max-w-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">
              Welcome to RastreIA
            </CardTitle>
            <CardDescription className="text-center">
              Log in to access the RastreIA platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="police">Police Officer</TabsTrigger>
              </TabsList>
              <TabsContent value="citizen">
                <form onSubmit={(e) => handleSubmit(e, "citizen")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-citizen">Email</Label>
                      <Input
                        id="email-citizen"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-citizen">Password</Label>
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
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6">
                    <User className="mr-2 h-4 w-4" />
                    Log In as Citizen
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="police">
                <form onSubmit={(e) => handleSubmit(e, "police")}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-police">Email</Label>
                      <Input
                        id="email-police"
                        type="email"
                        placeholder="officer@police.gov"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-police">Password</Label>
                      <div className="relative">
                        <Input
                          id="password-police"
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
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-6">
                    <Shield className="mr-2 h-4 w-4" />
                    Log In as Police Officer
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </motion.div>
      </Card>
      <motion.div
        className="absolute top-4 left-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
