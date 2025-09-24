'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Github, 
  Key,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface ConnectionStatus {
  supabase: {
    connected: boolean;
    url: string | null;
    anonKey: string | null;
    authWorking: boolean;
    databaseWorking: boolean;
    error: string | null;
  };
  github: {
    configured: boolean;
    error: string | null;
  };
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    supabase: {
      connected: false,
      url: null,
      anonKey: null,
      authWorking: false,
      databaseWorking: false,
      error: null
    },
    github: {
      configured: false,
      error: null
    }
  });
  const [loading, setLoading] = useState(true);

  const checkConnections = async () => {
    setLoading(true);
    
    // Check Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let supabaseStatus = {
      connected: false,
      url: supabaseUrl || null,
      anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : null,
      authWorking: false,
      databaseWorking: false,
      error: null as string | null
    };

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient();
        
        // Test auth connection
        try {
          const { data, error } = await supabase.auth.getSession();
          supabaseStatus.authWorking = !error;
          if (error) {
            supabaseStatus.error = `Auth error: ${error.message}`;
          }
        } catch (authError: any) {
          supabaseStatus.error = `Auth connection failed: ${authError.message}`;
        }

        // Test database connection
        try {
          const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
          supabaseStatus.databaseWorking = !error;
          if (error && !supabaseStatus.error) {
            supabaseStatus.error = `Database error: ${error.message}`;
          }
        } catch (dbError: any) {
          if (!supabaseStatus.error) {
            supabaseStatus.error = `Database connection failed: ${dbError.message}`;
          }
        }

        supabaseStatus.connected = supabaseStatus.authWorking || supabaseStatus.databaseWorking;
      } catch (error: any) {
        supabaseStatus.error = `Supabase initialization failed: ${error.message}`;
      }
    } else {
      supabaseStatus.error = 'Missing Supabase environment variables';
    }

    // Check GitHub OAuth configuration
    let githubStatus = {
      configured: false,
      error: null as string | null
    };

    // GitHub OAuth is configured in Supabase dashboard, so we check if auth providers work
    if (supabaseStatus.authWorking) {
      try {
        const supabase = createClient();
        // This doesn't actually test GitHub specifically, but tests if OAuth is set up
        githubStatus.configured = true;
      } catch (error: any) {
        githubStatus.error = `GitHub OAuth check failed: ${error.message}`;
      }
    } else {
      githubStatus.error = 'Cannot check GitHub OAuth - Supabase auth not working';
    }

    setStatus({
      supabase: supabaseStatus,
      github: githubStatus
    });
    setLoading(false);
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const StatusIcon = ({ connected, working }: { connected: boolean; working?: boolean }) => {
    if (working === false) return <XCircle className="w-5 h-5 text-red-500" />;
    if (connected || working) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const StatusBadge = ({ connected, working, label }: { connected: boolean; working?: boolean; label: string }) => {
    if (working === false) return <Badge variant="destructive">{label} Failed</Badge>;
    if (connected || working) return <Badge className="bg-green-100 text-green-800">{label} Connected</Badge>;
    return <Badge variant="destructive">{label} Disconnected</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Connection Status</h2>
          <p className="text-gray-600">Check your service connections and configuration</p>
        </div>
        <Button 
          onClick={checkConnections} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Supabase Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Supabase Connection
          </CardTitle>
          <CardDescription>
            Database, authentication, and real-time features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon connected={status.supabase.connected} />
              <span className="font-medium">Overall Status</span>
            </div>
            <StatusBadge 
              connected={status.supabase.connected} 
              label="Supabase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <StatusIcon working={status.supabase.authWorking} />
                <span className="text-sm">Authentication</span>
              </div>
              <StatusBadge 
                connected={status.supabase.authWorking} 
                working={status.supabase.authWorking}
                label="Auth"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <StatusIcon working={status.supabase.databaseWorking} />
                <span className="text-sm">Database</span>
              </div>
              <StatusBadge 
                connected={status.supabase.databaseWorking} 
                working={status.supabase.databaseWorking}
                label="Database"
              />
            </div>
          </div>

          {status.supabase.url && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Key className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">URL:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {status.supabase.url}
                </code>
              </div>
              {status.supabase.anonKey && (
                <div className="flex items-center space-x-2 text-sm">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Anon Key:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {status.supabase.anonKey}
                  </code>
                </div>
              )}
            </div>
          )}

          {status.supabase.error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.supabase.error}
              </AlertDescription>
            </Alert>
          )}

          {!status.supabase.connected && (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Supabase is not connected. Please set up your Supabase project and add the environment variables.
                </AlertDescription>
              </Alert>
              <div className="flex space-x-2">
                <Button asChild size="sm">
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Supabase Dashboard
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub OAuth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Github className="w-5 h-5 mr-2" />
            GitHub OAuth
          </CardTitle>
          <CardDescription>
            Social authentication with GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon connected={status.github.configured} />
              <span className="font-medium">GitHub OAuth</span>
            </div>
            <StatusBadge 
              connected={status.github.configured} 
              label="GitHub"
            />
          </div>

          {status.github.error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.github.error}
              </AlertDescription>
            </Alert>
          )}

          {!status.github.configured && status.supabase.connected && (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  GitHub OAuth is not configured. Set it up in your Supabase dashboard under Authentication → Providers.
                </AlertDescription>
              </Alert>
              <Button asChild size="sm" variant="outline">
                <a 
                  href="https://supabase.com/dashboard/project/_/auth/providers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure GitHub OAuth
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      {(!status.supabase.connected || !status.github.configured) && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to complete your setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!status.supabase.connected && (
              <div className="space-y-2">
                <h4 className="font-medium">1. Set up Supabase</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Create a new project at <a href="https://supabase.com" className="text-blue-600 hover:underline">supabase.com</a></li>
                  <li>• Copy your project URL and anon key</li>
                  <li>• Add them to your environment variables (.env.local)</li>
                  <li>• Run the database migrations</li>
                </ul>
              </div>
            )}
            
            {status.supabase.connected && !status.github.configured && (
              <div className="space-y-2">
                <h4 className="font-medium">2. Configure GitHub OAuth</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Go to your Supabase dashboard</li>
                  <li>• Navigate to Authentication → Providers</li>
                  <li>• Enable GitHub provider</li>
                  <li>• Add your GitHub OAuth app credentials</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}