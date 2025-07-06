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
                <div key={chain.chain_id} className="mb-8">
                    <p className="font-semibold">Chain {chain.chain_id}</p>
                    <table className="w-1/2 text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b p-1">Amino Acid</th>
                                <th className="border-b p-1">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(chain.amino_acids).map(([amino_acid, count]) => (
                                <tr key={amino_acid}>
                                    <td className="border-b p-1">{amino_acid}</td>
                                    <td className="border-b p-1">{count as number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

            <h3 className="text-lg font-semibold mb-4">Hydrophobicity</h3>
            <p>Average Hydropathy: {analysisData.chains.map((chain: any) => chain.average_hydropathy).reduce((a: number, b: number) => a + b, 0) / analysisData.chains.length}</p>
            <p>Positive Charged Residues: {analysisData.chains.map((chain: any) => chain.charged_residues.positive).reduce((a: number, b: number) => a + b, 0) / analysisData.chains.length}</p>
            <p className="mb-8">Negative Charged Residues: {analysisData.chains.map((chain: any) => chain.charged_residues.negative).reduce((a: number, b: number) => a + b, 0) / analysisData.chains.length}</p>
        </div>
    )
}