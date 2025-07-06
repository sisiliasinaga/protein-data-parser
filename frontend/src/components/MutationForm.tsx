"use client";

import React, { useState } from "react";

type Props = {
    filename: string;
}

export default function MutationForm({ filename }: Props) {
    const [chain, setChain] = useState<string>("");
    const [position, setPosition] = useState<number | "">("");
    const [target, setTarget] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!chain || position === "" || !target) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            console.log("Sending mutation:", {
                filename,
                chain_id: chain,
                residue_index: position,
                new_residue: target,
              });

            const response = await fetch("http://localhost:8000/mutate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename: filename,
                    chain_id: chain,
                    residue_index: position,
                    new_residue: target.toUpperCase(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to mutate PDB");
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error mutating PDB:", error);
            alert("Error mutating PDB");
        }
    };

    return (
        <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h3 className="text-lg font-semibold mb-4">Mutate Protein</h3>
            <form onSubmit={handleSubmit} className="border-b border-gray-300 pb-4 mb-8">
                <div>
                    <label>
                        Chain: 
                        <input
                            type="text"
                            value={chain}
                            className="border border-gray-200 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            onChange={(e) => setChain(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Position: 
                        <input
                            type="number"
                            value={position}
                            className="border border-gray-200 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            onChange={(e) => setPosition(e.target.value ? parseInt(e.target.value) : "")}
                            required
                        />
                    </label>
                </div>
                <div className="mb-8">
                    <label>
                        Target: 
                        <input
                            type="text"
                            value={target}
                            className="border border-gray-200 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            onChange={(e) => setTarget(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
}