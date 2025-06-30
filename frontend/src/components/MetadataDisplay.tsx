import React from "react";

type Props = {
    metadata: {
        chain_count: number;
        residue_count: number;
        atom_count: number;
    };
}

export default function MetadataDisplay({ metadata }: Props) {
    return (
        <div style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
        }}>
            <h2>Protein Metadata</h2>
            <ul>
                <li><strong>Chains:</strong> {metadata.chain_count}</li>
                <li><strong>Residues:</strong> {metadata.residue_count}</li>
                <li><strong>Atoms:</strong> {metadata.atom_count}</li>
            </ul>

        </div>
    );
}
