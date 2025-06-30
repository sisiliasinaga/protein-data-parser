"use client";

import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ProteinViewer from "../components/ProteinViewer";
import MetadataDisplay from "../components/MetadataDisplay";
export default function Home() {
  const [pdbUrl, setPdbUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    chain_count: number;
    residue_count: number;
    atom_count: number;
  } | null>(null);

  return (
    <main style={{ padding: "2rem" }}>
      <header className="bg-blue-800 text-white p-4 text-xl font-bold">
        Protein Structure Upload
      </header>
          <section style={{ padding: "2rem" }}>
            {pdbUrl && <ProteinViewer url={pdbUrl} />}
            {metadata && <MetadataDisplay metadata={metadata} />}
            <UploadForm setPdbUrl={setPdbUrl} setMetadata={setMetadata} />
          </section>
        </main>
    )
}