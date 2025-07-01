"use client";

import React, { useState } from "react";

type Props = {
    setPdbUrl: (url: string) => void;
    setMetadata: (data: any) => void;
    setUploadedFile: (file: string) => void;
}

export default function UploadForm({ setPdbUrl, setMetadata, setUploadedFile }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setStatus("uploading");

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const metadata = await response.json();
            const filename = metadata.filename;
            const url = `http://localhost:8000/pdbs/${filename}`;
            setPdbUrl(url);
            setMetadata(metadata);
            setUploadedFile(filename);

            setStatus("success");
        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
            }}>
                <div><label
                    htmlFor="file-upload"
                    style={{
                        backgroundColor: "#0070f3",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "inline-block",
                        marginRight: "1rem",
                    }}
                    >
                    Choose File
                    </label>
                    <input
                    id="file-upload"
                    type="file"
                    accept=".pdb"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    />
                    <span>{file?.name || "No file selected"}</span>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!file || status === "uploading"}>
                    {status === "uploading" ? "Uploading..." : "Upload"}
                </button>
                
            </div>


            {status === "error" && <p style={{ color: "red" }}>Error uploading file</p>}
            {status === "success" && <p style={{ color: "green" }}>File uploaded successfully</p>}
        </form>
    );
}

