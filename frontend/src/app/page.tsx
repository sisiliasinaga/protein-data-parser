"use client";

import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ProteinViewer from "../components/ProteinViewer";
import MetadataDisplay from "../components/MetadataDisplay";
import AnalysisTable from "../components/AnalysisTable";
import { runAnalysis } from "../utils/api";

type ChainData = {
  id: string;
  residue_count: number;
  sequence: string;
}

export default function Home() {
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    chains: ChainData[];
    residues: number[];
    atoms: number;
  } | null>(null);

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // analysis data
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!uploadedFile) {
      setAnalysisError("Please upload a PDB file first.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const data = await runAnalysis(uploadedFile);
      setAnalysisData(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <header className="bg-blue-800 text-white p-4 text-xl font-bold">
        Protein Structure Upload
      </header>
          <section style={{ padding: "2rem" }}>
            <UploadForm setPdbUrl={setPdbUrl} setMetadata={setMetadata} setUploadedFile={setUploadedFile} />
            {pdbUrl && <ProteinViewer url={pdbUrl} />}
            {metadata && <MetadataDisplay metadata={metadata} />}
            <button onClick={handleRunAnalysis}>Analyze</button>
            {isAnalyzing && <p>Analyzing...</p>}
            {analysisError && <p>{analysisError}</p>}
            {analysisData && <AnalysisTable analysisData={analysisData} />}
                        
          </section>
        </main>
    )
}
