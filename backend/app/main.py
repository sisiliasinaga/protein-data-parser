from fastapi import FastAPI, UploadFile, File, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from Bio.PDB import *
import os

app = FastAPI()
router = APIRouter()

# connect frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdbs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    parser = PDBParser(QUIET=True)
    structure = parser.get_structure("uploaded_pdb", file_path)

    # Parse metadata
    chains = []
    residues = []
    atoms = 0

    for model in structure:
        for chain in model:
            
            for residue in chain:
                residues.append(residue.id)
                for atom in residue:
                    atoms += 1

            ppb = PPBuilder()
            sequence = ""
            for pp in ppb.build_peptides(chain):
                sequence += str(pp.get_sequence())

            chains.append({
                "id": chain.id,
                "residue_count": len(residues),
                "sequence": sequence
            })

    # Create JSON response
    return JSONResponse(content={
        "filename": file.filename,
        "chains": chains,
        "residues": residues,
        "atoms": atoms
    })

@router.get("/analyze")
async def analyze_pdb(filename: str = Query(...)):
    file_path = os.path.join("uploaded_pdbs", filename)
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "PDB file not found"}, status_code=404)
    
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure("analysis_pdb", file_path)

    results = []

    for model in structure:
        for chain in model:
            counts = {}
            for residue in chain:
                if Polypeptide.is_aa(residue, standard=True):
                    res_name = residue.get_resname()
                    counts[res_name] = counts.get(res_name, 0) + 1
            results.append({
                "chain_id": chain.id,
                "amino_acids": counts
            })

    return JSONResponse(content={"chains": results})
    

app.mount("/pdbs", StaticFiles(directory=UPLOAD_DIR), name="pdbs")
