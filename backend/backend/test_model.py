from utils.model_loader import get_model

# Test loading the model
print("Testing model loading...")
model = get_model()
print("✅ Model loaded successfully!")
print(f"Model type: {type(model.model)}")