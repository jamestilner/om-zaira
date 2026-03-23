/**
 * ADD/EDIT CUSTOMER
 * Screen ID: AD-CUST-ADD-01
 * 
 * Form to add or edit customer details
 */

import { useState, useEffect } from 'react';
import { Save, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Country, State, IState } from 'country-state-city';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  area: string;
}

interface AddCustomerProps {
  customer?: CustomerFormData | null;
  onBack: () => void;
  onSave: (customerData: CustomerFormData) => void;
}

export default function AddCustomer({ customer, onBack, onSave }: AddCustomerProps) {
  const isEditing = !!customer;

  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    country: customer?.country || '',
    state: customer?.state || '',
    city: customer?.city || '',
    area: customer?.area || '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Location states
  const countries = Country.getAllCountries();
  const [availableStates, setAvailableStates] = useState<IState[]>([]);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountryObj = countries.find(c => c.name === formData.country);
      if (selectedCountryObj) {
        setAvailableStates(State.getStatesOfCountry(selectedCountryObj.isoCode) || []);
      } else {
        setAvailableStates([]);
      }
    } else {
      setAvailableStates([]);
    }
  }, [formData.country]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCountryChange = (countryName: string) => {
    setFormData(prev => ({ ...prev, country: countryName, state: '', city: '' }));
    if (errors.country) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.country;
        return newErrors;
      });
    }
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Indian format)
  const validatePhone = (phone: string) => {
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it's a valid Indian phone number (10 digits, optionally starting with +91)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(cleanPhone);
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  const handleConfirmSave = () => {
    // Normalize phone number format
    const normalizedData = {
      ...formData,
      phone: formData.phone.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    onSave(normalizedData);
    setShowConfirmModal(false);
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
          Back to Customers
        </button>
        <h1 className="text-2xl">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {isEditing ? 'Update customer details' : 'Add a new customer to the system'}
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg mb-6">Basic Information</h2>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Priya Sharma"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g. priya.sharma@email.com"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Format: +91 XXXXXXXXXX or XXXXXXXXXX
              </p>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg mb-6">Location Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Country */}
            <div>
              <label className="block text-sm mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.country 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none`}
              >
                <option value="">Select country...</option>
                {countries.map(c => (
                  <option key={c.isoCode} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">{errors.country}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={!formData.country || availableStates.length === 0}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.state 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">{formData.country && availableStates.length === 0 ? 'No states found' : 'Select state...'}</option>
                {availableStates.map(s => (
                  <option key={s.isoCode} value={s.name}>{s.name}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-xs text-red-500 mt-1">{errors.state}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g. Surat"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.city 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm mb-2">
                Area <span className="text-neutral-400 text-xs font-normal ml-1">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="e.g. Vesu"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveClick}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Customer' : 'Add Customer'}
          </PrimaryButton>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <FormModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title={isEditing ? 'Confirm Customer Update' : 'Confirm Add Customer'}
        >
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              {isEditing 
                ? 'Are you sure you want to update this customer with the following details?'
                : 'Are you sure you want to add this customer?'
              }
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Name:</span>
                <span className="text-sm font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Email:</span>
                <span className="text-sm font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Phone:</span>
                <span className="text-sm font-medium">{formData.phone}</span>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowConfirmModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              {isEditing ? 'Confirm & Update' : 'Confirm & Add'}
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}
    </div>
  );
}