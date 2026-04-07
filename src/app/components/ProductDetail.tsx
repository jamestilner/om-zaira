/**
 * PRODUCT DETAIL PAGE
 * Screen ID: AD-CAT-DETAIL-01
 * 
 * Detailed product view and editing with image gallery management
 */

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, GripVertical, Save, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';
import { PRODUCT_CATEGORIES, getCategoryNames, getSubcategories } from '../constants/productCategories';

interface ProductImage {
  id: string;
  url: string;
  file?: File;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  category?: string;
}

interface ProductUpdateData {
  name: string;
  category: string;
  sku: string;
  images: string[];
  status: 'active' | 'inactive';
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onSave: (productId: string, productData: ProductUpdateData) => void;
}

export default function ProductDetail({ product, onBack, onSave }: ProductDetailProps) {
  const [productTitle, setProductTitle] = useState(product.name);
  const [sku, setSku] = useState(product.sku || '');
  const [productCategory, setProductCategory] = useState(product.category || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(product.status || 'active');
  const [createdDate] = useState(product.createdAt);
  const [lastUpdated] = useState(new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ''));
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [images, setImages] = useState<ProductImage[]>(
    product.images.map((url, index) => ({
      id: `${index}`,
      url,
    }))
  );

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`);
        return;
      }

      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        file,
      }));

      setImages(prev => [...prev, ...newImages]);
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (imageId: string) => {
    if (images.length <= 1) {
      toast.error('At least one image is required');
      return;
    }

    setImages(prev => prev.filter(img => img.id !== imageId));
    toast.success('Image deleted successfully');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSaveClick = () => {
    // Validate title
    if (!productTitle.trim()) {
      toast.error('Product title is required');
      return;
    }

    if (productTitle.length < 1 || productTitle.length > 100) {
      toast.error('Product title must be between 1-100 characters');
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(productTitle)) {
      toast.error('Product title can only contain letters, numbers, and spaces');
      return;
    }

    // Validate images
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    // All validations passed, show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const productData: ProductUpdateData = {
      name: productTitle,
      category: productCategory,
      sku: sku,
      images: images.map(img => img.url),
      status: status,
    };

    onSave(product.id, productData);
    setShowConfirmModal(false);
    toast.success('Product details updated successfully');
  };

  const handleDiscardSave = () => {
    setShowConfirmModal(false);
  };



  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                {productTitle}
              </h1>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Products</span>
                <span>›</span>
                <span>Product Listing</span>
                <span>›</span>
                <span>{productTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PrimaryButton icon={Save} onClick={handleSaveClick}>
                Save Changes
              </PrimaryButton>
              <SecondaryButton icon={ChevronLeft} onClick={onBack}>
                Back
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="space-y-6">
          {/* Product Details - Top Section */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Product Details
            </h3>
            
            <div className="space-y-4">
              {/* 1. SKU and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    SKU <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 50) {
                        setSku(value);
                      }
                    }}
                    placeholder="Enter SKU"
                    className="w-full px-4 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Category <span className="text-error-600">*</span>
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full h-[42px] px-4 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center'
                    }}
                  >
                    <option value="">Select category</option>
                    {getCategoryNames().map(categoryName => (
                      <option key={categoryName} value={categoryName}>
                        {categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Product Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Title <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 100) {
                      setProductTitle(value);
                    }
                  }}
                  placeholder="Enter product title"
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 3. Status Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('active')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        status === 'active'
                          ? 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/50 dark:text-success-400 dark:border-success-800'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-900'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('inactive')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        status === 'inactive'
                          ? 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-900'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>



              {/* 6. Created Date + Last Updated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Created Date
                  </label>
                  <input
                    type="text"
                    value={createdDate}
                    disabled
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Last Updated
                  </label>
                  <input
                    type="text"
                    value={lastUpdated}
                    disabled
                    className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Gallery */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Product Gallery <span className="text-error-600">*</span>
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Upload JPG or PNG images, max 10MB per image. Drag to reorder. First image is the default.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden cursor-move border-2 ${
                    index === 0
                      ? 'border-primary-500 dark:border-primary-400'
                      : 'border-transparent'
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 p-1 bg-white/90 dark:bg-neutral-900/90 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>

                  {/* Default Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                      Default
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute bottom-2 right-2 p-1.5 bg-error-600 hover:bg-error-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Upload Placeholder */}
              {images.length === 0 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                >
                  <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mb-2" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Upload Images</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <FormModal
        isOpen={showConfirmModal}
        onClose={handleDiscardSave}
        title="Confirm Save"
        description="Please confirm that you want to make changes in the product details?"
      >
        <FormFooter className="border-t-0 pt-0 mt-0">
          <SecondaryButton onClick={handleDiscardSave} className="flex-1 sm:flex-initial sm:min-w-[140px]">
            Discard
          </SecondaryButton>
          <PrimaryButton onClick={handleConfirmSave} className="flex-1 sm:flex-initial sm:min-w-[140px]">
            Confirm
          </PrimaryButton>
        </FormFooter>
      </FormModal>
    </div>
  );
}