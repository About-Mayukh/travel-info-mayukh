import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validatePhotoFile } from '../../utils/validators';
import { uploadPhoto } from '../../services/photoService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export function PhotoUpload({ spotId, spotName, isOpen, onClose, onUploadSuccess }) {
  const { user, profile } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (file) => {
    setError(null);
    if (!file) return;

    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a photo to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const newPhoto = await uploadPhoto({
        spotId,
        file: selectedFile,
        userId: user?.id,
        userName: profile?.full_name || user?.email?.split('@')[0] || 'Traveller',
      });

      toast.success('Photo uploaded successfully! Thank you for sharing.');
      handleClear();
      onClose();
      if (onUploadSuccess) onUploadSuccess(newPhoto);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleClear();
        onClose();
      }}
      title={`Share a Photo of ${spotName || 'Spot'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Upload Drop Zone / Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-colors text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Click or drag & drop photo here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP, GIF (Max 5 MB)
            </p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black/5">
            <img
              src={previewUrl}
              alt="Upload preview"
              className="w-full h-56 object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
              <span className="font-semibold text-slate-400">
                {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              handleClear();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={uploading}
            disabled={!selectedFile}
            icon={UploadCloud}
          >
            Upload Photo
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PhotoUpload;
