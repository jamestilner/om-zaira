/**
 * ADD MEMBERSHIP
 * Screen ID: AD-MEM-ADD-01
 * 
 * Form to create a new membership by selecting customer and plan
 */

import { useState } from 'react';
import { Save, ChevronLeft, Search, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';

// Customer interface
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Plan interface
interface Plan {
  id: string;
  uid: string;
  name: string;
  description: string;
  totalAmount: number;
  installments: number;
}

// Custom plan data interface
interface CustomPlanData {
  description: string;
  duration: number;
  totalAmount: number;
}

// Form data interface
interface MembershipFormData {
  customerId: string;
  planId: string;
  groupId?: string;
  customPlan?: CustomPlanData;
  aliasName?: string;
}

interface Group {
  id: string;
  name: string;
}

interface AddMembershipProps {
  customers: Customer[];
  plans: Plan[];
  groups?: Group[];
  onBack: () => void;
  onSave: (membershipData: MembershipFormData) => void;
}

export default function AddMembership({ customers, plans, groups = [], onBack, onSave }: AddMembershipProps) {
  const [formData, setFormData] = useState<MembershipFormData>({
    customerId: '',
    planId: '',
    groupId: '',
    aliasName: '',
  });

  const [customPlanData, setCustomPlanData] = useState<CustomPlanData>({
    description: '',
    duration: 12,
    totalAmount: 0,
  });

  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', email: '', phone: '' });
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);

  const allCustomers = [...customers, ...localCustomers];

  // Get selected customer and plan
  const selectedCustomer = allCustomers.find(c => c.id === formData.customerId);
  const selectedPlan = plans.find(p => p.id === formData.planId);
  const isCustomPlan = formData.planId === 'custom';

  // Filter customers based on search
  const filteredCustomers = allCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const handleAddNewCustomer = () => {
    if (!newCustomerForm.name || !newCustomerForm.phone) {
      toast.error('Name and phone are required');
      return;
    }
    const newCustomer = {
      id: `C${Math.floor(Math.random() * 10000)}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone,
    };
    setLocalCustomers(prev => [...prev, newCustomer]);
    setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
    setShowAddCustomerModal(false);
    setNewCustomerForm({ name: '', email: '', phone: '' });
    toast.success('Customer added successfully');
  };

  const handleSelectCustomer = (customer: Customer) => {
    setFormData(prev => ({ ...prev, customerId: customer.id }));
    setCustomerSearchQuery('');
    setShowCustomerDropdown(false);
    if (errors.customerId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.customerId;
        return newErrors;
      });
    }
  };

  const handleClearCustomer = () => {
    setFormData(prev => ({ ...prev, customerId: '' }));
  };

  const handleSelectPlan = (planId: string) => {
    setFormData(prev => ({ ...prev, planId }));
    if (errors.planId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.planId;
        return newErrors;
      });
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setFormData(prev => ({ ...prev, groupId }));
  };

  const handleCustomPlanChange = (field: keyof CustomPlanData, value: string | number) => {
    setCustomPlanData(prev => ({ ...prev, [field]: value }));
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

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!formData.planId) {
      newErrors.planId = 'Please select a plan';
    }

    if (isCustomPlan) {
      if (!customPlanData.description.trim()) {
        newErrors.description = 'Plan description is required';
      }
      if (!customPlanData.duration || customPlanData.duration < 1) {
        newErrors.duration = 'Duration must be at least 1 month';
      }
      if (!customPlanData.totalAmount || customPlanData.totalAmount <= 0) {
        newErrors.totalAmount = 'Total amount must be greater than 0';
      }
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
    const membershipData: MembershipFormData = {
      customerId: formData.customerId,
      planId: formData.planId,
      ...(formData.groupId && { groupId: formData.groupId }),
      ...(isCustomPlan && { customPlan: customPlanData }),
      ...(formData.aliasName && { aliasName: formData.aliasName }),
    };

    onSave(membershipData);
    setShowConfirmModal(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
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
          Back to Memberships
        </button>
        <h1 className="text-2xl">Add New Membership</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Create a new membership by selecting a customer and plan
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl space-y-6">
        {/* Step 1: Select Customer */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg mb-6">Select Customer</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm">
                  Select Customer <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Customer
                </button>
              </div>

              {!selectedCustomer ? (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => {
                        setCustomerSearchQuery(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Search by name, email or ID..."
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.customerId
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-neutral-200 dark:border-neutral-700'
                      } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                    />
                  </div>

                  {/* Dropdown */}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-b-0"
                        >
                          <div className="font-medium text-sm text-neutral-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {customer.email} • Phone: {customer.phone} • ID: {customer.id}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <div className="font-medium text-sm text-neutral-900 dark:text-white">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 space-y-1">
                      <p>ID: {selectedCustomer.id}</p>
                      <p>Email: {selectedCustomer.email}</p>
                      <p>Phone: {selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCustomer}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.customerId && (
                <p className="text-xs text-red-500 mt-1">{errors.customerId}</p>
              )}
            </div>

            {/* Alias Name Field */}
            {selectedCustomer && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
                <label className="block text-sm mb-2">
                  Alias Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.aliasName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, aliasName: e.target.value }))}
                  placeholder="e.g. Wife's Name if purchasing on behalf"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Select Plan */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg mb-6">Select Plan</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2">
                Select Plan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.planId}
                onChange={(e) => handleSelectPlan(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.planId
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-neutral-200 dark:border-neutral-700'
                } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              >
                <option value="">Choose a plan...</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {formatCurrency(plan.totalAmount)} ({plan.installments} months)
                  </option>
                ))}
                <option value="custom">Custom Plan</option>
              </select>
              {errors.planId && (
                <p className="text-xs text-red-500 mt-1">{errors.planId}</p>
              )}
            </div>

            {/* Show plan details if existing plan selected */}
            {selectedPlan && !isCustomPlan && (
              <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                  Plan Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Plan ID:</span>
                    <span className="text-sm font-medium">{selectedPlan.uid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Plan Title:</span>
                    <span className="text-sm font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Description:</span>
                    <span className="text-sm font-medium">{selectedPlan.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedPlan.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Number of Installments:</span>
                    <span className="text-sm font-medium">{selectedPlan.installments} months</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Monthly EMI:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(selectedPlan.totalAmount / selectedPlan.installments)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Show custom plan fields if custom selected */}
            {isCustomPlan && (
              <div className="mt-6 space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-4">
                  Custom Plan Details
                </h3>

                <div>
                  <label className="block text-sm mb-2">
                    Plan Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={customPlanData.description}
                    onChange={(e) => handleCustomPlanChange('description', e.target.value)}
                    placeholder="Enter custom plan description..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.description
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-neutral-200 dark:border-neutral-700'
                    } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Duration (Months) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customPlanData.duration}
                    onChange={(e) => handleCustomPlanChange('duration', parseInt(e.target.value) || 0)}
                    placeholder="e.g. 12"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.duration
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-neutral-200 dark:border-neutral-700'
                    } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  />
                  {errors.duration && (
                    <p className="text-xs text-red-500 mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Total Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={customPlanData.totalAmount || ''}
                      onChange={(e) => handleCustomPlanChange('totalAmount', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 60000"
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                        errors.totalAmount
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-neutral-200 dark:border-neutral-700'
                      } bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                    />
                  </div>
                  {errors.totalAmount && (
                    <p className="text-xs text-red-500 mt-1">{errors.totalAmount}</p>
                  )}
                </div>

                {/* Show calculated monthly EMI for custom plan */}
                {customPlanData.duration > 0 && customPlanData.totalAmount > 0 && (
                  <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Monthly EMI:</span>
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        {formatCurrency(customPlanData.totalAmount / customPlanData.duration)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Optional: Select Group */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h2 className="text-lg mb-6">Select Group</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">
                Select Group
              </label>
              <select
                value={formData.groupId || ''}
                onChange={(e) => handleSelectGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">Choose a group (Optional)...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton icon={Save} onClick={handleSaveClick}>
            Create Membership
          </PrimaryButton>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <FormModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Create Membership"
        >
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to create this membership?
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Customer</span>
                <p className="text-sm font-medium mt-0.5">
                  {selectedCustomer?.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {selectedCustomer?.email}
                </p>
                {formData.aliasName && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                    <span className="font-medium text-neutral-500 dark:text-neutral-400">Alias:</span> {formData.aliasName}
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Plan</span>
                {!isCustomPlan && selectedPlan ? (
                  <>
                    <p className="text-sm font-medium mt-0.5">{selectedPlan.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {formatCurrency(selectedPlan.totalAmount)} • {selectedPlan.installments} months • 
                      {formatCurrency(selectedPlan.totalAmount / selectedPlan.installments)}/month
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium mt-0.5">Custom Plan</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {formatCurrency(customPlanData.totalAmount)} • {customPlanData.duration} months • 
                      {formatCurrency(customPlanData.totalAmount / customPlanData.duration)}/month
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {customPlanData.description}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowConfirmModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              Confirm & Create
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <FormModal
          isOpen={showAddCustomerModal}
          onClose={() => setShowAddCustomerModal(false)}
          title="Add New Customer"
        >
          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm mb-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCustomerForm.name}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <FormFooter>
            <SecondaryButton onClick={() => setShowAddCustomerModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleAddNewCustomer}>
              Add Customer
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}
    </div>
  );
}