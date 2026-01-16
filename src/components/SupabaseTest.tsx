import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseTest = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function testConnection() {
            try {
                // We just try to list potential tables or just do a simple query
                // This query might fail if there are no tables, but it verifies the client initialization and auth
                const { data, error } = await supabase.from('_test_connection_').select('*').limit(1);

                // If we get an error that isn't about the table missing, it might be a connection issue
                // But usually, even if the table doesn't exist, if the client is misconfigured (e.g. invalid URL), it will error out differently
                console.log('Supabase Test Result:', { data, error });

                if (error && error.code !== 'PGRST116' && error.message !== 'relation "_test_connection_" does not exist') {
                    setStatus('error');
                    setError(error.message);
                } else {
                    setStatus('success');
                }
            } catch (err: any) {
                setStatus('error');
                setError(err.message);
            }
        }

        testConnection();
    }, []);

    return (
        <div className="p-4 m-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-2">Supabase Connection Test</h2>
            {status === 'loading' && <p className="text-blue-500">Connecting to Supabase...</p>}
            {status === 'success' && (
                <p className="text-green-500">
                    Supabase client initialized successfully!
                    <br />
                    <span className="text-sm text-gray-500">(Verified client configuration and connection attempt)</span>
                </p>
            )}
            {status === 'error' && (
                <div className="text-red-500">
                    <p>Failed to connect to Supabase.</p>
                    <p className="text-sm font-mono">{error}</p>
                </div>
            )}
        </div>
    );
};
