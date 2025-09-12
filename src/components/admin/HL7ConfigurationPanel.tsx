"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Simple toast function
const toast = {
  success: (message: string) => console.log('✅ Success:', message),
  error: (message: string) => console.error('❌ Error:', message),
  info: (message: string) => console.log('ℹ️ Info:', message)
};

interface HL7Endpoint {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  host: string;
  port: number;
  protocol: 'MLLP' | 'HTTPS';
  isActive: boolean;
  testConnection?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConnectionTest {
  success: boolean;
  responseTime: number;
  status: string;
  message: string;
  timestamp: string;
}

const HL7ConfigurationPanel: React.FC = () => {
  const [endpoints, setEndpoints] = useState<HL7Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<Partial<HL7Endpoint>>({});
  const [testingConnections, setTestingConnections] = useState<Record<string, boolean>>({});
  const [connectionResults, setConnectionResults] = useState<Record<string, ConnectionTest>>({});

  // Form state
  const [formData, setFormData] = useState({
    hospitalId: '',
    hospitalName: '',
    name: '',
    host: '',
    port: '',
    protocol: 'MLLP' as 'MLLP' | 'HTTPS',
    isActive: true,
    authType: 'basic' as 'basic' | 'token' | 'certificate',
    username: '',
    password: '',
    token: ''
  });

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/hl7/config');
      const data = await response.json();
      
      if (data.success) {
        setEndpoints(data.data.endpoints);
      } else {
        toast.error('Failed to load HL7 configurations');
      }
    } catch (error) {
      console.error('Error loading endpoints:', error);
      toast.error('Error loading HL7 configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (endpoint: HL7Endpoint) => {
    try {
      setTestingConnections(prev => ({ ...prev, [endpoint.id]: true }));
      
      const response = await fetch('/api/hl7/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointId: endpoint.id,
          host: endpoint.host,
          port: endpoint.port,
          protocol: endpoint.protocol
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionResults(prev => ({ ...prev, [endpoint.id]: data.data }));
        
        if (data.data.success) {
          toast.success(`Connection to ${endpoint.name} successful`);
        } else {
          toast.error(`Connection to ${endpoint.name} failed: ${data.data.message}`);
        }
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Error testing connection');
    } finally {
      setTestingConnections(prev => ({ ...prev, [endpoint.id]: false }));
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.hospitalName || !formData.name || !formData.host || !formData.port) {
        toast.error('Please fill in all required fields');
        return;
      }

      const endpoint = {
        hospitalId: formData.hospitalId || `hospital_${Date.now()}`,
        hospitalName: formData.hospitalName,
        name: formData.name,
        host: formData.host,
        port: parseInt(formData.port),
        protocol: formData.protocol,
        isActive: formData.isActive,
        authConfig: formData.authType === 'basic' ? {
          type: 'basic',
          credentials: {
            username: formData.username,
            password: formData.password
          }
        } : formData.authType === 'token' ? {
          type: 'token',
          credentials: {
            token: formData.token
          }
        } : undefined
      };

      const url = isEditing ? '/api/hl7/config' : '/api/hl7/config';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { ...endpoint, id: currentEndpoint.id } : endpoint;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEditing ? 'Endpoint updated successfully' : 'Endpoint created successfully');
        setIsDialogOpen(false);
        resetForm();
        loadEndpoints();
      } else {
        toast.error(data.error || 'Failed to save endpoint');
      }
    } catch (error) {
      console.error('Error saving endpoint:', error);
      toast.error('Error saving endpoint');
    }
  };

  const handleEdit = (endpoint: HL7Endpoint) => {
    setIsEditing(true);
    setCurrentEndpoint(endpoint);
    setFormData({
      hospitalId: endpoint.hospitalId,
      hospitalName: endpoint.hospitalName,
      name: endpoint.name,
      host: endpoint.host,
      port: endpoint.port.toString(),
      protocol: endpoint.protocol,
      isActive: endpoint.isActive,
      authType: 'basic',
      username: '',
      password: '',
      token: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (endpointId: string) => {
    if (!confirm('Are you sure you want to delete this endpoint?')) return;

    try {
      const response = await fetch(`/api/hl7/config?id=${endpointId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Endpoint deleted successfully');
        loadEndpoints();
      } else {
        toast.error(data.error || 'Failed to delete endpoint');
      }
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      toast.error('Error deleting endpoint');
    }
  };

  const resetForm = () => {
    setFormData({
      hospitalId: '',
      hospitalName: '',
      name: '',
      host: '',
      port: '',
      protocol: 'MLLP',
      isActive: true,
      authType: 'basic',
      username: '',
      password: '',
      token: ''
    });
    setIsEditing(false);
    setCurrentEndpoint({});
  };

  const getStatusBadge = (endpoint: HL7Endpoint) => {
    const testResult = connectionResults[endpoint.id];
    
    if (!testResult) {
      return (
        <Badge variant="outline" className="text-xs">
          {endpoint.isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    }

    if (testResult.success) {
      return <Badge className="bg-green-500 text-xs">Connected</Badge>;
    } else {
      return <Badge variant="destructive" className="text-xs">{testResult.status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading HL7 configurations...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>HL7 Integration Configuration</CardTitle>
              <CardDescription>
                Configure HL7 endpoints for EMR/RIS integration and automatic report transmission
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>Add Endpoint</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? 'Edit HL7 Endpoint' : 'Add New HL7 Endpoint'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure HL7 endpoint for automatic report transmission
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
                    <TabsTrigger value="auth">Authentication</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hospitalName">Hospital Name</Label>
                        <Input
                          id="hospitalName"
                          value={formData.hospitalName}
                          onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                          placeholder="General Hospital"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Endpoint Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Hospital EMR System"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host">Host</Label>
                        <Input
                          id="host"
                          value={formData.host}
                          onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                          placeholder="emr.hospital.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="port">Port</Label>
                        <Input
                          id="port"
                          type="number"
                          value={formData.port}
                          onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                          placeholder="6661"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="protocol">Protocol</Label>
                        <Select
                          value={formData.protocol}
                          onValueChange={(value: 'MLLP' | 'HTTPS') => setFormData(prev => ({ ...prev, protocol: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MLLP">MLLP</SelectItem>
                            <SelectItem value="HTTPS">HTTPS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active Endpoint</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="auth" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="authType">Authentication Type</Label>
                        <Select
                          value={formData.authType}
                          onValueChange={(value: 'basic' | 'token' | 'certificate') => setFormData(prev => ({ ...prev, authType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Authentication</SelectItem>
                            <SelectItem value="token">Bearer Token</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.authType === 'basic' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                              placeholder="username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="password"
                            />
                          </div>
                        </div>
                      )}

                      {formData.authType === 'token' && (
                        <div className="space-y-2">
                          <Label htmlFor="token">Bearer Token</Label>
                          <Input
                            id="token"
                            value={formData.token}
                            onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                            placeholder="Bearer token"
                          />
                        </div>
                      )}

                      {formData.authType === 'certificate' && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Certificate authentication coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {isEditing ? 'Update Endpoint' : 'Create Endpoint'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital / Endpoint</TableHead>
                <TableHead>Connection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{endpoint.hospitalName}</div>
                      <div className="text-sm text-muted-foreground">{endpoint.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{endpoint.host}:{endpoint.port}</div>
                      <Badge variant="outline" className="text-xs">{endpoint.protocol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(endpoint)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(endpoint.updatedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(endpoint)}
                        disabled={testingConnections[endpoint.id]}
                      >
                        {testingConnections[endpoint.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Test'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(endpoint)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(endpoint.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {endpoints.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-2xl mb-2">🔗</div>
              <p>No HL7 endpoints configured</p>
              <p className="text-sm">Add your first endpoint to enable automatic report transmission</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HL7ConfigurationPanel;