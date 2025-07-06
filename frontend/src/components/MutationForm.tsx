"use client";

import React, { useEffect, useState } from "react";

/* NEXT STEPS
- Rerun analysis after mutation
- Show a before and after analysis of the mutation
- Show a before and after model of the mutation
- Add a button to download the mutated PDB file
- Highlight mutated residues in the model
- Tabs to switch between before and after analysis
- Ability to add multiple mutations at once
*/

type Props = {
    filename: string;
}
export default function MutationForm({ filename }: Props) {
    const [chain, setChain] = useState<string>("");
    const [position, setPosition] = useState<number | "">("");
    const [target, setTarget] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!chain || position === "" || !target) {
            alert("Please fill in all fields.");
            return;
        }

        try {
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
            setSuccessMessage(result.message);
        } catch (error) {
            setErrorMessage("Failed to apply mutation. Please try again.");
            setSuccessMessage(null);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
          const timer = setTimeout(() => setErrorMessage(null), 3000);
          return () => clearTimeout(timer);
        }
      }, [errorMessage]);

    return (
        <div className="mt-6 rounded-lg bg-gray-100 p-4">
            <h3 className="text-lg font-semibold mb-4">Mutate Protein</h3>
            {successMessage && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 shadow-sm border border-green-200">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 shadow-sm border border-red-200">
                    {errorMessage}
                </div>
            )}
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