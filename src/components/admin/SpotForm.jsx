import React, { useState, useEffect } from 'react';
import { Camera, MapPin, IndianRupee, Sparkles, ExternalLink } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CoverPhotoPicker from './CoverPhotoPicker';
import { validateCoordinates } from '../../utils/validators';

const CATEGORIES = [
  { id: 'heritage', label: 'Heritage & Culture' },
  { id: 'hill', label: 'Hill Station' },
  { id: 'beach', label: 'Beach & Coastal' },
  { id: 'wildlife', label: 'Wildlife & Safari' },
  { id: 'religious', label: 'Spiritual & Religious' },
];

export function SpotForm({ initialSpot = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    description: '',
    category: 'heritage',
    latitude: '',
    longitude: '',
    adult_price: 0,
    child_price: 0,
    best_time: '',
    cover_image: '',
    cover_credit_name: '',
    cover_credit_url: '',
  });

  const [errors, setErrors] = useState({});
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialSpot) {
      setFormData({
        name: initialSpot.name || '',
        area: initialSpot.area || '',
        description: initialSpot.description || '',
        category: initialSpot.category || 'heritage',
        latitude: initialSpot.latitude ?? '',
        longitude: initialSpot.longitude ?? '',
        adult_price: initialSpot.adult_price ?? 0,
        child_price: initialSpot.child_price ?? 0,
        best_time: initialSpot.best_time || '',
        cover_image: initialSpot.cover_image || '',
        cover_credit_name: initialSpot.cover_credit_name || '',
        cover_credit_url: initialSpot.cover_credit_url || '',
      });
    }
  }, [initialSpot]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoSelected = ({ imageUrl, creditName, creditUrl }) => {
    setFormData((prev) => ({
      ...prev,
      cover_image: imageUrl,
      cover_credit_name: creditName || '',
      cover_credit_url: creditUrl || '',
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Spot name is required';
    if (!formData.area.trim()) errs.area = 'Area/city is required';
    if (!formData.latitude || !formData.longitude) {
      errs.coordinates = 'Valid coordinates are required';
    } else if (!validateCoordinates(formData.latitude, formData.longitude)) {
      errs.coordinates = 'Coordinates must be valid lat (-90 to 90) and lng (-180 to 180)';
    }
    if (!formData.cover_image) errs.cover_image = 'Cover image is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        adult_price: parseFloat(formData.adult_price) || 0,
        child_price: parseFloat(formData.child_price) || 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Spot Name"
          required
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Amber Palace"
          error={errors.name}
        />
        <Input
          label="Area / City"
          required
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          placeholder="e.g. Jaipur"
          error={errors.area}
        />
      </div>

      {/* Category & Best Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Best Time to Visit"
          value={formData.best_time}
          onChange={(e) => handleChange('best_time', e.target.value)}
          placeholder="e.g. October to March (Morning hours)"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Latitude"
          required
          type="number"
          step="any"
          value={formData.latitude}
          onChange={(e) => handleChange('latitude', e.target.value)}
          placeholder="e.g. 26.9855"
          error={errors.coordinates}
        />
        <Input
          label="Longitude"
          required
          type="number"
          step="any"
          value={formData.longitude}
          onChange={(e) => handleChange('longitude', e.target.value)}
          placeholder="e.g. 75.8513"
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Adult Ticket Price (₹)"
          type="number"
          min="0"
          value={formData.adult_price}
          onChange={(e) => handleChange('adult_price', e.target.value)}
          placeholder="0 for free entry"
        />
        <Input
          label="Child Ticket Price (₹)"
          type="number"
          min="0"
          value={formData.child_price}
          onChange={(e) => handleChange('child_price', e.target.value)}
          placeholder="0 for free"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Spot Overview Description
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe history, architecture, highlights and atmosphere..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Cover Image & Unsplash Picker */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Cover Photo *
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Camera}
            onClick={() => setPhotoPickerOpen(true)}
          >
            Find Cover Photo
          </Button>
        </div>

        {formData.cover_image ? (
          <div className="relative rounded-xl overflow-hidden h-40 bg-slate-200">
            <img
              src={formData.cover_image}
              alt="Spot cover"
              className="w-full h-full object-cover"
            />
            {formData.cover_credit_name && (
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                Photo by {formData.cover_credit_name} on Unsplash
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No cover image selected. Click "Find Cover Photo" to search Unsplash or paste a URL.
          </p>
        )}
        {errors.cover_image && (
          <p className="text-xs text-rose-500 font-medium">{errors.cover_image}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {initialSpot ? 'Save Changes' : 'Create Spot'}
        </Button>
      </div>

      {/* Unsplash Picker Modal */}
      <CoverPhotoPicker
        isOpen={photoPickerOpen}
        onClose={() => setPhotoPickerOpen(false)}
        initialQuery={`${formData.name} ${formData.area}`}
        onSelectPhoto={handlePhotoSelected}
      />
    </form>
  );
}

export default SpotForm;
