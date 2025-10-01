'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

// --- Helper Icon Components ---
const UploadCloudIcon = () => (
  <svg
    className="w-12 h-12 mx-auto text-gray-400"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- Main Upload Page Component ---

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  
  // Effect to create and clean up the object URL for the PDF preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Revoke the object URL on cleanup to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    setUploadSuccess(false);

    if (fileRejections.length > 0) {
        const firstRejection = fileRejections[0];
        const firstError = firstRejection.errors[0];
        if (firstError.code === 'file-too-large') {
             setError('File is larger than 5MB');
        } else {
             setError(firstError.message);
        }
        setFile(null);
        return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    // --- SUPABASE UPLOAD LOGIC ---
    // 1. Get the current user's ID.
    // 2. Generate a unique file path, e.g., `${userId}/${new Date().getTime()}-${file.name}`.
    // 3. Use `supabase.storage.from('resumes').upload(filePath, file)`.
    // 4. If the upload is successful, get the `path`.
    // 5. Insert a new row into your `resumes` table with `user_id` and `file_path`.
    
    // Simulating an API call for now
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('File uploaded successfully:', file.name);
        setUploadSuccess(true);
        setFile(null);
    } catch (err) {
        setError('Upload failed. Please try again.');
        console.error(err);
    } finally {
        setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadSuccess(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
            {uploadSuccess ? (
                <div className="text-center">
                    <CheckCircleIcon />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Upload Successful!</h2>
                    <p className="mt-2 text-gray-600">Your resume has been submitted and is now pending review.</p>
                    <button
                        onClick={() => setUploadSuccess(false)}
                        className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Upload Another
                    </button>
                </div>
            ) : (
                <>
                <h1 className="text-3xl font-bold text-center text-gray-800">Upload Your Resume</h1>
                <p className="text-center text-gray-500 mt-2">Upload a PDF of your resume (max 5MB).</p>

                <div
                    {...getRootProps()}
                    className={`mt-8 p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
                    ${error ? 'border-red-500 bg-red-50' : ''}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloudIcon />
                    <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? 'Drop the file here ...' : 'Drag & drop a file here, or click to select a file'}
                    </p>
                </div>
                
                {error && (
                    <div className="mt-4 flex items-center text-red-600">
                        <XCircleIcon />
                        <span className="ml-2 text-sm">{error}</span>
                    </div>
                )}
                
                {file && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                        <div className="mt-4 border rounded-lg p-4 bg-gray-50 relative">
                            <div className="flex items-center space-x-4">
                                <FileIcon />
                                <div className="flex-grow">
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={removeFile} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full">
                                <XCircleIcon />
                            </button>
                        </div>
                        
                        {previewUrl && (
                           <div className="mt-4 border rounded-lg overflow-hidden">
                             <iframe src={previewUrl} width="100%" height="500px" title="PDF Preview" />
                           </div>
                        )}

                        <div className="mt-6 text-right">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Confirm & Upload'}
                            </button>
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
      </div>
    </div>
  );
}

