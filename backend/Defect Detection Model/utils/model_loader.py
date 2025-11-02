from ultralytics import YOLO # type: ignore
import os
import torch # type: ignore

class YOLOModel:
    def __init__(self, model_path="models/best.pt"):

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        torch.serialization.add_safe_globals([])
        self.model = YOLO(model_path)

    def predict(self, image_path, conf_threshold=0.25):
       
        results = self.model(image_path, conf=conf_threshold)
        return results
    
yolo_model = None


def get_model():
    global yolo_model
    if yolo_model is None:
        yolo_model = YOLOModel()
    return yolo_model