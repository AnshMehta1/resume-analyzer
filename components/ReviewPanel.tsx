"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ResumeWithProfile, ResumeStatus } from "@/lib/types";

const ReviewPanel = ({ resume, onUpdate }: { resume: ResumeWithProfile, onUpdate: () => void }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [status, setStatus] = useState(resume.status);
    const [score, setScore] = useState(resume.score || '');
    const [notes, setNotes] = useState(resume.notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setStatus(resume.status);
        setScore(resume.score || '');
        setNotes(resume.notes || '');
        setPdfUrl(null);
        setError(null);
        setSuccess(null);

        const downloadPdfUrl = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.storage
                    .from("resumes")
                    .createSignedUrl(resume.file_path, 60); // Create a secure URL valid for 60 seconds

                if (error) throw error;

                if (!data?.signedUrl) {
                    throw new Error("Signed URL not returned from storage.");
                }

                setPdfUrl(data.signedUrl);
            } catch (err: unknown) {
                console.error("Error fetching signed URL:", err);

                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to load resume link.";

                setError(message);
            } finally {
                setLoading(false);
            }
        };
        downloadPdfUrl();
    }, [resume, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const { error: updateError } = await supabase
                .from("resumes")
                .update({
                    status,
                    score: score === "" ? null : Number(score),
                    notes,
                })
                .eq("id", resume.id);

            if (updateError) throw updateError;

            await fetch("/api/notify-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: resume.users?.email,
                    status,
                    score,
                    notes,
                }),
            });

            setSuccess("Resume updated and email sent successfully!");
            setTimeout(onUpdate, 1000);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to update resume.";

            setError(message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg sticky top-8">
            <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">Reviewing Submission</h3>
                <p className="text-sm text-gray-600 mt-1 truncate">
                    <strong>File:</strong> {resume.file_name}
                </p>
            </div>
            <div className="p-6">
                <div className="p-4 bg-gray-50 text-center">
                    {loading && !pdfUrl && <p className="text-sm text-gray-500">Generating secure link...</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {pdfUrl && (
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Open Resume in New Tab
                        </a>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ResumeStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {status === 'Pending' && <option value="Pending" disabled>Pending</option>}
                            <option value="Approved">Approved</option>
                            <option value="Needs Revision">Needs Revision</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score (0-100)</label>
                        <input type="number" id="score" value={score} onChange={(e) => setScore(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" min="0" max="100" />
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes for Candidate</label>
                        <textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="text-right">
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { ReviewPanel };