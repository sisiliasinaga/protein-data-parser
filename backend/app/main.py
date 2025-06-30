from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from Bio.PDB import PDBParser
import os

app = FastAPI()

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
    chains = set()
    residues = set()
    atoms = 0

    for model in structure:
        for chain in model:
            chains.add(chain.id)
            for residue in chain:
                residues.add(residue.id)
                for atom in residue:
                    atoms += 1

    # Create JSON response
    return JSONResponse(content={
        "filename": file.filename,
        "chain_count": len(chains),
        "residue_count": len(residues),
        "atom_count": atoms,
    })
    

app.mount("/pdbs", StaticFiles(directory=UPLOAD_DIR), name="pdbs")
