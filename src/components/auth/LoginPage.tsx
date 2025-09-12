"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(formData.email, formData.password, formData.role);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const demoAccounts = [
    {
      role: "admin",
      email: "admin@teleradiology.com",
      name: "Dr. Sarah Wilson",
      description: "System Administrator"
    },
    {
      role: "radiologist",
      email: "radiologist@teleradiology.com",
      name: "Dr. Michael Chen",
      description: "Diagnostic Radiologist"
    },
    {
      role: "reviewer",
      email: "reviewer@teleradiology.com",
      name: "Dr. Emily Rodriguez",
      description: "Quality Reviewer"
    }
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setFormData({
      email: account.email,
      password: "demo123",
      role: account.role
    });
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f1ad24fc-ced6-4766-9609-6253a205ec8c.png" 
              alt="TeleRadiology Pro Logo" 
              className="w-10 h-10 text-white"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TeleRadiology Pro</h1>
          <p className="text-gray-600 mt-2">Professional Medical Imaging Platform</p>
        </div>

        <Card className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@hospital.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="radiologist">Radiologist</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="demo">
              <CardHeader>
                <CardTitle>Demo Accounts</CardTitle>
                <CardDescription>
                  Click on any account to try the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoAccounts.map((account) => (
                    <Card 
                      key={account.role} 
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fillDemoAccount(account)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          account.role === "admin" ? "bg-purple-500" :
                          account.role === "radiologist" ? "bg-blue-500" :
                          "bg-green-500"
                        }`}>
                          {account.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{account.name}</div>
                          <div className="text-xs text-gray-500">{account.description}</div>
                          <div className="text-xs text-gray-400">{account.email}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Demo Password:</strong> demo123
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Secure HIPAA-Compliant Platform</p>
          <p className="mt-1">© 2024 TeleRadiology Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}