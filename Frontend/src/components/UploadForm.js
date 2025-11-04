import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

const UploadForm = ({ onImageUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !isLoading) {
      onImageUpload(selectedFile, previewUrl);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Fabric Image
        </h2>
        <p className="text-gray-600">
          Upload an image to detect fabric defects
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Drag and Drop Zone */}
        <div
          className={`relative border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />

          {!previewUrl ? (
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-primary-600" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag & drop your image here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <span className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Browse Files
              </span>
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: JPG, PNG, JPEG
              </p>
            </label>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={clearSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors z-10"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <div className="mt-4 flex items-center justify-center gap-2 text-gray-700">
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {selectedFile && (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Detect Defects'}
          </button>
        )}
      </form>
    </div>
  );
};

export default UploadForm;