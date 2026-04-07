/**
 * PRODUCT MANAGEMENT
 * Screen ID: AD-CAT-LIST-01
 * 
 * Product management with grid/list/table views
 * Based on /Modules/Catalogue_Management.md specifications
 */

import { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Upload,
  MoreVertical,
  Power,
  PowerOff,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
} from './hb/common/Form';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import ProductDetail from './ProductDetail';
import AddProduct from './AddProduct';
import { toast } from 'sonner';
import { getCategoryNames, getSubcategories } from '../constants/productCategories';

// Product interface
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  category?: string;
  productInformation?: string;
  productFeatures?: string[];
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Diamond Eternity Necklace',
    sku: 'CTX363',
    description: 'Exquisite diamond necklace with intricate design',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'],
    status: 'active',
    createdAt: '2024-01-15',
    category: 'jewelry',
    productInformation: 'Shape/Cut: ROUND BRILLIANT\nColor: GH\nD.W: 0.28',
    productFeatures: ['Exquisite Craftsmanship', 'Diverse Selection', 'Customization Options', 'Exceptional Value'],
  },
  {
    id: '2',
    name: 'Gold Bangles Set',
    sku: 'GB2024',
    description: 'Traditional gold bangles with intricate patterns',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
    status: 'active',
    createdAt: '2024-01-20',
    category: 'jewelry',
  },
  {
    id: '3',
    name: 'Pearl Earrings',
    sku: 'PER003',
    description: 'Elegant pearl earrings with gold setting',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'],
    status: 'active',
    createdAt: '2024-02-01',
    category: 'jewelry',
  },
  {
    id: '4',
    name: 'Platinum Ring',
    sku: 'PLA004',
    description: 'Premium platinum ring with diamond accents',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'],
    status: 'active',
    createdAt: '2024-02-10',
    category: 'jewelry',
  },
  {
    id: '5',
    name: 'Ruby Pendant',
    sku: 'RUB005',
    description: 'Stunning ruby pendant with gold chain',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400'],
    status: 'inactive',
    createdAt: '2024-02-15',
    category: 'jewelry',
  },
  {
    id: '6',
    name: 'Silver Bracelet',
    sku: 'SIL006',
    description: 'Modern silver bracelet with contemporary design',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
    status: 'active',
    createdAt: '2024-02-20',
    category: 'jewelry',
  },
];

export default function ProductManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const itemsPerPage = 9;

  // Get available categories
  const categories = getCategoryNames();

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        selectedStatus === 'all' || product.status === selectedStatus;

      const matchesCategory =
        selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory.toLowerCase();

      // For subcategory filter, we would need to add subCategory to Product interface
      // For now, we'll just return true
      const matchesSubcategory = selectedSubcategory === 'all';

      return matchesSearch && matchesStatus && matchesCategory && matchesSubcategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory, selectedSubcategory, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedCategory, selectedSubcategory]);

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailPage(true);
  };

  const handleAddProduct = (productData: any) => {
    // Generate new product
    const newProduct: Product = {
      id: `${products.length + 1}`,
      name: productData.name,
      sku: productData.sku,
      description: productData.description || '',
      category: productData.category,
      images: productData.images,
      status: productData.status || 'active',
      createdAt: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', ''),
      productInformation: productData.productInformation,
      productFeatures: productData.productFeatures,
    };

    setProducts([...products, newProduct]);
    setShowAddPage(false);
    toast.success('Product created successfully');
  };

  const handleUpdateProduct = (productId: string, productData: any) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? {
            ...p,
            name: productData.name,
            description: productData.description || p.description,
            category: productData.category,
            sku: productData.sku,
            images: productData.images,
            status: productData.status || p.status,
            productInformation: productData.productInformation,
            productFeatures: productData.productFeatures,
          }
        : p
    ));
    setShowDetailPage(false);
    setSelectedProduct(null);
    toast.success('Product updated successfully');
  };



  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {paginatedProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative group cursor-pointer"
          onClick={() => handleEdit(product)}
        >
          <div 
            className="w-full h-48 bg-neutral-100 dark:bg-neutral-900 overflow-hidden"
          >
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">SKU: {product.sku}</Badge>
              {product.category && (
                <Badge variant="outline" className="text-xs capitalize">{product.category}</Badge>
              )}
              {product.status === 'inactive' ? (
                <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600">Inactive</Badge>
              ) : (
                <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
              )}
            </div>

            <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
              {product.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="p-6 space-y-3">
      {paginatedProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative cursor-pointer"
          onClick={() => handleEdit(product)}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-24 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0"
            >
              {product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">SKU: {product.sku}</Badge>
                    {product.category && (
                      <Badge variant="outline" className="text-xs capitalize">{product.category}</Badge>
                    )}
                    {product.status === 'inactive' ? (
                      <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600">Inactive</Badge>
                    ) : (
                      <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {product.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {paginatedProducts.map((product) => (
            <tr 
              key={product.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
              onClick={() => handleEdit(product)}
            >
              <td className="px-6 py-4">
                <Badge variant="secondary" className="text-xs">{product.sku}</Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {product.category && (
                  <Badge variant="outline" className="text-xs capitalize">{product.category}</Badge>
                )}
              </td>
              <td className="px-6 py-4">
                {product.status === 'inactive' ? (
                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600">Inactive</Badge>
                ) : (
                  <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {showDetailPage && selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={() => {
            setShowDetailPage(false);
            setSelectedProduct(null);
          }}
          onSave={handleUpdateProduct}
        />
      ) : showAddPage ? (
        <AddProduct
          onBack={() => {
            setShowAddPage(false);
          }}
          onSave={handleAddProduct}
        />
      ) : (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
          {/* Header */}
          <ListHeader
            title="Products"
            breadcrumbs={[
              { label: 'Product Management' },
              { label: 'Products' },
            ]}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onAddNew={() => setShowAddPage(true)}
            addNewLabel="Add New"
          />

          {/* Filters */}
          <FilterDrawer
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          >
            <FilterField label="Status">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FilterField>

            <FilterField label="Category">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('all'); // Reset subcategory when category changes
                }}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Subcategory">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={selectedCategory === 'all'}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed"
              >
                <option value="all">All Subcategories</option>
                {selectedCategory !== 'all' && getSubcategories(selectedCategory).map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </FilterField>
          </FilterDrawer>

          {/* Content */}
          <div className="bg-white dark:bg-neutral-950">
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' && <GridView />}
                {viewMode === 'list' && <ListView />}
                {viewMode === 'table' && <TableView />}
              </>
            ) : (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  No products found
                </p>
                <Button onClick={() => setShowAddPage(true)}>
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </>
  );
}