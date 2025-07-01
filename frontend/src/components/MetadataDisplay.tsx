import React, { useState } from "react";

type ChainData = {
    id: string;
    residue_count: number;
    sequence: string;
}

type Props = {
    metadata: {
        chains: ChainData[];
        residues: number[];
        atoms: number;
    };
}

export default function MetadataDisplay({ metadata }: Props) {

    const [openChain, setOpenChain] = useState<string | null>(null);

    const toggleChain = (chainId: string) => {
        setOpenChain(openChain === chainId ? null : chainId);
    }

    return (
        <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Protein Metadata</h2>
            <ul>
                <li><strong>Chains:</strong> {metadata.chains.length}</li>
                <li><strong>Residues:</strong> {metadata.residues.length}</li>
                <li><strong>Atoms:</strong> {metadata.atoms}</li>
            </ul>

            <h2 className="text-lg font-semibold mb-4">Protein Chains</h2>
            {metadata.chains.map((chain) => (
                <div key={chain.id} className="mb-3">
                    <button
                        className="w-full rounded-md bg-gray-200 p-2 text-left transition-colors duration-300 ease-in-out hover:bg-gray-300"
                        onClick={() => toggleChain(chain.id)}
                    >
                        Chain {chain.id} {openChain === chain.id ? "▲" : "▼"}
                    </button>
                    
                    {openChain === chain.id && (
                        <div className="mt-2 rounded-md bg-gray-200 p-2">
                            <p className="mb-2">
                                <span className="font-semibold">Residue Count:</span> {chain.residue_count}
                            </p>
                            <p className="mb-1">
                                <span className="font-semibold">Sequence:</span>
                            </p>
                            <pre className="whitespace-pre-wrap break-words">{chain.sequence}</pre>
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}
