from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import uuid
from pathlib import Path
import shutil
import sys
from utils.model_loader import get_model
from utils.predictor import process_prediction, generate_heatmap

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Loading YOLO model...")
    get_model()
    print("API ready!")
    yield
    # Shutdown (optional cleanup)
    print("Shutting down...")

app = FastAPI(title="Defect Detection API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("static/heatmaps", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Defect Detection API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_id = str(uuid.uuid4())
    file_extension = Path(file.filename).suffix
    temp_file_path = f"uploads/{file_id}{file_extension}"
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        model = get_model()
        results = model.predict(temp_file_path, conf_threshold=0.25)
        
        prediction_data = process_prediction(results[0])
        
        # Generate heatmap
        heatmap_filename = f"heatmap_{file_id}.png"
        heatmap_path = generate_heatmap(
            temp_file_path, 
            results[0], 
            f"static/heatmaps/{heatmap_filename}"
        )
        
        # Build response
        response = {
            "prediction": prediction_data["prediction"],
            "confidence": prediction_data["confidence"],
            "heatmap_url": f"/static/heatmaps/{heatmap_filename}"
        }
        
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    finally:
        # Clean up temporary upload
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)