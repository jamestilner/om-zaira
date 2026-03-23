/**
 * ADD/EDIT EVENT PAGE
 * Screen ID: AD-EVENT-ADD-01
 * 
 * Create or edit events with banner upload and description
 */

import { useState } from 'react';
import { Save, ChevronLeft, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';

interface EventData {
  title: string;
  startDate: string;
  endDate: string;
  bannerUrl: string;
  description: string;
  status: 'upcoming' | 'past';
}

interface AddEventProps {
  event?: any | null; // Using any for ease of transition with parent components
  onBack: () => void;
  onSave: (eventData: EventData) => void;
}


export default function AddEvent({ event, onBack, onSave }: AddEventProps) {
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title || '');
  const [startDate, setStartDate] = useState(event?.startDate || event?.date || '');
  const [endDate, setEndDate] = useState(event?.endDate || '');
  const [bannerUrl, setBannerUrl] = useState(event?.bannerUrl || '');
  const [description, setDescription] = useState(event?.description || '');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(event?.bannerUrl || '');

  // Calculate word count
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG or PNG)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerPreview(result);
        setBannerUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    // Validate title
    if (!title.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (title.length > 100) {
      toast.error('Event title cannot exceed 100 characters');
      return;
    }

    // Validate description
    if (!description.trim()) {
      toast.error('Event description is required');
      return;
    }

    if (wordCount > 500) {
      toast.error('Description cannot exceed 500 words');
      return;
    }

    // Validate start date
    if (!startDate) {
      toast.error('Start Date is required');
      return;
    }

    // Validate end date
    if (!endDate) {
      toast.error('End Date is required');
      return;
    }

    // Validate end date is after or equal to start date
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        toast.error('End Date cannot be before Start Date');
        return;
      }
    }

    // For new events, start date must not be in the past (optional, but keep consistent)
    if (!isEditing) {
      const selectedDate = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('Start Date must be in the future');
        return;
      }
    }

    // Validate banner
    if (!bannerUrl) {
      toast.error('Event banner is required');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // Determine status based on end date
    const selectedEndDate = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const status: 'upcoming' | 'past' = selectedEndDate >= today ? 'upcoming' : 'past';

    onSave({
      title,
      startDate,
      endDate,
      bannerUrl,
      description,
      status,
    });
    setShowConfirmModal(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const eventDate = new Date(dateStr);
    return eventDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Events
        </button>
        <h1 className="text-2xl">{isEditing ? 'Edit Event' : 'Add New Event'}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {isEditing ? 'Update event details' : 'Create a new event with all necessary information'}
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
        
        {/* Event Title */}
        <div>
          <label className="block text-sm mb-2">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Tech Summit 2025"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            maxLength={100}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Description (Moved under Event Title) */}
        <div>
          <label className="block text-sm mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the event, what attendees can expect, key activities, etc."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Maximum 500 words
            </p>
            <p className={`text-xs ${wordCount > 500 ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {wordCount}/500 words
            </p>
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Upload Image (Moved after End Date) */}
        <div>
          <label className="block text-sm mb-2">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleBannerUpload}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose Image
            </label>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              JPG or PNG, max 10MB
            </span>
          </div>

          {/* Preview */}
          {bannerPreview && (
            <div>
              <p className="text-sm mb-2">Preview:</p>
              <div className="relative w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setBannerPreview('');
                    setBannerUrl('');
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {!bannerPreview && (
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-12 text-center">
              <ImageIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-500 dark:text-neutral-400">
                No banner uploaded yet
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveClick}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Event' : 'Create Event'}
          </PrimaryButton>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <FormModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title={isEditing ? 'Confirm Event Update' : 'Confirm Event Creation'}
        >
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              {isEditing 
                ? 'Are you sure you want to update this event with the following details?'
                : 'Are you sure you want to create this event with the following details?'
              }
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Event Title:</span>
                <span className="text-sm font-medium line-clamp-1 text-right ml-4">{title}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Start Date:</span>
                <span className="text-sm font-medium text-right">{formatDisplayDate(startDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">End Date:</span>
                <span className="text-sm font-medium text-right">{formatDisplayDate(endDate)}</span>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowConfirmModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              {isEditing ? 'Confirm & Update' : 'Confirm & Create'}
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}
    </div>
  );
}
