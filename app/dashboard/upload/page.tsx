'use client';
import { supabase } from '@/lib/supabaseClient';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloudIcon } from '@/components/icons/UploadCloudIcon';
import { FileIcon } from '@/components/icons/FileIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { XCircleIcon } from '@/components/icons/XCircleIcon';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

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
    setUploadSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const filePath = `public/${user.id}/${Date.now()}-${file.name}`;
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (storageError) {
          throw storageError;
        }

        const { error: dbError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            file_path: filePath,
            file_name: file.name,
          });

        if (dbError) {
          throw dbError;
        }

        setUploadSuccess(true);
        setFile(null);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
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
          <header className="mb-8">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 transition-colors">
              <ArrowLeftIcon />
              Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
            <p className="mt-1 text-md text-gray-600">Drag and drop a PDF file below to get started.</p>
          </header>
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

