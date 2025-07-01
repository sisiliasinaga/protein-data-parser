export async function runAnalysis(filename: string) {
    try {
        const response = await fetch(`http://localhost:8000/analyze?filename=${encodeURIComponent(filename)}`);
        if (!response.ok) {
            throw new Error(`Failed to analyze PDB file: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error running analysis:", error);
        throw error;
    }
}
