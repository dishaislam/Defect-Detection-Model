import cv2
import numpy as np

def process_prediction(result):

    boxes = result.boxes
    
    if len(boxes) == 0:
        return {
            "prediction": "Non-Defective",
            "confidence": 1.0,
            "num_defects": 0
        }
    
    confidences = boxes.conf.cpu().numpy()

    max_confidence = float(np.max(confidences))
    
    return {
        "prediction": "Defective",
        "confidence": round(max_confidence, 2),
        "num_defects": len(boxes)
    }


def generate_heatmap(image_path, result, output_path):
    
    img = cv2.imread(image_path)
    h, w, _ = img.shape

    # Blank heatmap canvas
    heatmap = np.zeros((h, w), dtype=np.float32)

    # Add Gaussian blobs for each detected box
    for box in result.boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        conf = float(box.conf[0])

        # Center and size
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        box_w, box_h = x2 - x1, y2 - y1

        # Create a localized heat region
        sigma = max(box_w, box_h) * 0.4
        xv, yv = np.meshgrid(np.arange(w), np.arange(h))
        gaussian = np.exp(-((xv - cx) ** 2 + (yv - cy) ** 2) / (2 * sigma ** 2))
        
        # Add weighted by confidence
        heatmap += gaussian * conf

    # Normalize to [0, 255]
    heatmap = np.clip(heatmap / np.max(heatmap), 0, 1)
    heatmap = (heatmap * 255).astype(np.uint8)

    # Apply color map
    colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Overlay with original image
    overlay = cv2.addWeighted(img, 0.6, colored, 0.4, 0)

    # Save result
    cv2.imwrite(output_path, overlay)
    return output_path
