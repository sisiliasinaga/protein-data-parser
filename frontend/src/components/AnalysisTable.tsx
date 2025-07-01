"use client";

import React from "react";

interface AnalysisTableProps {
  analysisData: any;
}

export default function AnalysisTable({ analysisData }: AnalysisTableProps) {
    return (
        <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h3 className="text-lg font-semibold mb-4">Amino Acid Composition</h3>
            {analysisData.chains.map((chain: any) => (
                <div key={chain.chain_id} className="mb-3">
                    <p className="font-semibold">Chain {chain.chain_id}</p>
                    <ul className="pl-4 list-disc">
                        {Object.entries(chain.amino_acids).map(([amino_acid, count]) => (
                            <li key={amino_acid}>
                                {amino_acid}: {count as number}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}