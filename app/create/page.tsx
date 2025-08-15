'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Award, User, BookOpen, Calendar, Key, CheckCircle, AlertCircle, Medal } from 'lucide-react';
import crypto from 'crypto';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // ✅ shadcn Input

export default function CreateCertificate() {
    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        certificateType: '',
        dateAwarded: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<any>(null);

    const supabase = createClientComponentClient();

    const generateCertificateKey = (studentName: string, courseName: string, certificateType: string, date: string) => {
        const data = `${studentName}-${courseName}-${certificateType}-${date}-${Date.now()}`;
        return crypto.createHash('sha256').update(data).digest('hex');
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.studentName.trim()) {
            setError('Student name is required');
            return false;
        }
        if (!formData.courseName.trim()) {
            setError('Course name is required');
            return false;
        }
        if (!formData.certificateType.trim()) {
            setError('Certificate type is required');
            return false;
        }
        if (!formData.dateAwarded) {
            setError('Date of awarding is required');
            return false;
        }

        const selectedDate = new Date(formData.dateAwarded);
        const today = new Date();
        if (selectedDate > today) {
            setError('Date of awarding cannot be in the future');
            return false;
        }

        return true;
    };

    const createCertificate = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');
        setSuccess(null);

        try {
            const certificateKey = generateCertificateKey(
                formData.studentName,
                formData.courseName,
                formData.certificateType,
                formData.dateAwarded
            );

            const { data: existingCert } = await supabase
                .from('certificates')
                .select('certificate_key')
                .eq('student_name', formData.studentName.trim())
                .eq('course_name', formData.courseName.trim())
                .eq('certificate_type', formData.certificateType.trim())
                .eq('date_awarded', formData.dateAwarded)
                .single();

            if (existingCert) {
                setError('A certificate with these details already exists');
                return;
            }

            const { data, error: insertError } = await supabase
                .from('certificates')
                .insert([
                    {
                        certificate_key: certificateKey,
                        student_name: formData.studentName.trim(),
                        course_name: formData.courseName.trim(),
                        certificate_type: formData.certificateType.trim(),
                        date_awarded: formData.dateAwarded,
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (insertError) throw insertError;

            setSuccess(data);
            setFormData({ studentName: '', courseName: '', certificateType: '', dateAwarded: '' });

        } catch (err: any) {
            setError(err.message || 'An error occurred while creating the certificate');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCertificate();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <main>
            <div className="home-section">
                <div className="w-full max-w-2xl mx-auto">
                    <h1 className="text-center mb-8">Create Certificate</h1>

                    <div className="course-list">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Student Name */}
                            <div>
                                <label htmlFor="studentName" className="block text-sm font-semibold mb-2">
                                    <User className="inline h-4 w-4 mr-2" />
                                    Student Name
                                </label>
                                <Input
                                    id="studentName"
                                    name="studentName"
                                    type="text"
                                    value={formData.studentName}
                                    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                    placeholder="Enter student's full name"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Course Name */}
                            <div>
                                <label htmlFor="courseName" className="block text-sm font-semibold mb-2">
                                    <BookOpen className="inline h-4 w-4 mr-2" />
                                    Course Name
                                </label>
                                <Select
                                    onValueChange={(value) => handleInputChange("courseName", value)}
                                    value={formData.courseName}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Python Course LM6E">Python Course LM6E</SelectItem>
                                        <SelectItem value="Cyber Security Course LM6E">Cyber Security Course LM6E</SelectItem>
                                        <SelectItem value="Web Development Course LM6E">Web Development Course LM6E</SelectItem>
                                        <SelectItem value="Content Creation Course LM6E">Content Creation Course LM6E</SelectItem>
                                        <SelectItem value="CodeCadet Event">CodeCadet Event</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Certificate Type */}
                            <div>
                                <label htmlFor="certificateType" className="block text-sm font-semibold mb-2">
                                    <Medal className="inline h-4 w-4 mr-2" />
                                    Certificate Type
                                </label>
                                <Select
                                    onValueChange={(value) => handleInputChange("certificateType", value)}
                                    value={formData.certificateType}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select certificate type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Completion">Completion</SelectItem>
                                        <SelectItem value="Achievement">Achievement</SelectItem>
                                        <SelectItem value="Excellence">Excellence</SelectItem>
                                        <SelectItem value="Mentorship Excellence Certificate">Mentorship Excellence Certificate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date of Awarding */}
                            <div>
                                <label htmlFor="dateAwarded" className="block text-sm font-semibold mb-2">
                                    <Calendar className="inline h-4 w-4 mr-2" />
                                    Date of Awarding
                                </label>
                                <Input
                                    id="dateAwarded"
                                    name="dateAwarded"
                                    type="date"
                                    value={formData.dateAwarded}
                                    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                    disabled={isLoading}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Award className="h-5 w-5" />
                                        Create Certificate
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mt-8">
                            <div className="rounded-border bg-green-50 border-green-300 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <h2 className="text-xl font-bold text-green-800">Certificate Created Successfully!</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-semibold text-gray-600">Student:</span>
                                                <p className="text-gray-800 mt-1">{success.student_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Course:</span>
                                                <p className="text-gray-800 mt-1">{success.course_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Date Awarded:</span>
                                                <p className="text-gray-800 mt-1">
                                                    {new Date(success.date_awarded).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Created:</span>
                                                <p className="text-gray-800 mt-1">
                                                    {new Date(success.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-600 flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Certificate Key:
                      </span>
                                            <button
                                                onClick={() => copyToClipboard(success.certificate_key)}
                                                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="font-mono text-xs break-all bg-white p-2 rounded border">
                                            {success.certificate_key}
                                        </p>
                                    </div>

                                    <div className="text-center text-sm text-green-700">
                                        <p>⚠️ Important: Save the certificate key above - it's needed for verification!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <h3 className="font-semibold text-blue-800 mb-3">How it works:</h3>
                        <div className="text-sm text-blue-700 space-y-2">
                            <p>• Fill in the student details, course, and certificate type</p>
                            <p>• A unique certificate key will be generated using secure hashing</p>
                            <p>• The certificate is stored securely in the database</p>
                            <p>• Share the certificate key with the student for verification</p>
                            <p>• Keys can be verified on the validation page</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}