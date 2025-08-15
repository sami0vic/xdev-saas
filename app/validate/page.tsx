'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function ValidateCertificate() {
    const [certificateKey, setCertificateKey] = useState('');
    const [validationResult, setValidationResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const supabase = createClientComponentClient();

    const validateCertificate = async () => {
        if (!certificateKey.trim()) {
            setError('Please enter a certificate key');
            return;
        }

        setIsLoading(true);
        setError('');
        setValidationResult(null);
        setHasSearched(false);

        try {
            const { data, error: supabaseError } = await supabase
                .from('certificates')
                .select('*')
                .eq('certificate_key', certificateKey.trim())
                .single();

            if (supabaseError && supabaseError.code !== 'PGRST116') {
                // PGRST116 is "not found" error, which is expected for invalid keys
                throw supabaseError;
            }

            // Set the result regardless of whether data exists or not
            setValidationResult(data);
            setHasSearched(true);

        } catch (err: any) {
            setError(err.message || 'An error occurred while validating the certificate');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateCertificate();
    };

    return (
        <main>
            <div className="home-section">
                <div className="w-full max-w-2xl mx-auto">
                    <h1 className="text-center mb-8">Certificate Validation</h1>

                    <div className="course-list">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="certificateKey" className="block text-sm font-semibold mb-2">
                                    Certificate Key
                                </label>
                                <div className="relative">
                                    <Input
                                        id="certificateKey"
                                        type="text"
                                        value={certificateKey}
                                        onChange={(e) => setCertificateKey(e.target.value)}
                                        placeholder="Enter certificate key to validate"
                                        className="pr-12"
                                        disabled={isLoading}
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !certificateKey.trim()}
                                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Validate Certificate
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Validation Results */}
                    {hasSearched && (
                        <div className="mt-8">
                            {validationResult ? (
                                <div className="rounded-border bg-green-50 border-green-300 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                        <h2 className="text-xl font-bold text-green-800">Certificate Valid</h2>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-semibold text-gray-600">Student Name:</span>
                                                <p className="text-gray-800 mt-1">{validationResult.student_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Course:</span>
                                                <p className="text-gray-800 mt-1">{validationResult.course_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Certificate Type:</span>
                                                <p className="text-gray-800 mt-1">{validationResult.certificate_type}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Date Awarded:</span>
                                                <p className="text-gray-800 mt-1">
                                                    {new Date(validationResult.date_awarded).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-600">Certificate ID:</span>
                                            <p className="text-gray-800 mt-1 font-mono text-xs break-all">
                                                {validationResult.certificate_key}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-600">Issued:</span>
                                            <p className="text-gray-800 mt-1">
                                                {new Date(validationResult.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-border bg-red-50 border-red-300 p-6">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="h-8 w-8 text-red-600" />
                                        <div>
                                            <h2 className="text-xl font-bold text-red-800">Certificate Not Found</h2>
                                            <p className="text-red-700 mt-2">
                                                The certificate key you entered is not valid or does not exist in our database.
                                            </p>
                                            <p className="text-red-600 mt-1 text-sm">
                                                Please check the key and try again.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>Enter the certificate key provided with your certificate to verify its authenticity.</p>
                        <p className="mt-2">All certificates are securely stored and verified through our database.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}