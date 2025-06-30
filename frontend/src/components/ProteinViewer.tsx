"use client";

import React, { useEffect } from "react";

export default function ProteinViewer({ url }: { url: string }) {
    useEffect(() => {
        if (!url) return;

        const script = document.createElement("script");
        script.src = "https://3Dmol.org/build/3Dmol-min.js";
        script.async = true;
        script.onload = () => {
            const viewer = (window as any).$3Dmol.createViewer("viewer", {
                defaultColors: (window as any).$3Dmol.rasmolElementColors,
            });

            fetch(url)
                .then((response) => response.text())
                .then((pdbText) => {
                    viewer.addModel(pdbText, "pdb");
                    viewer.setStyle({}, {cartoon: {color: "spectrum"}});
                    viewer.zoomTo();
                    viewer.render();
                });
        };

        document.body.appendChild(script);
        
    }, [url]);

    return (
        <div style={{
            marginTop: "2rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
        }}>
            <h2>Protein Structure</h2>
            <div id="viewer" style={{width: "100%", height: "500px", position: "relative"}} />
        </div>
    );
}
