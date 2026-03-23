/**
 * ADD PLAN PAGE
 * Screen ID: AD-PLAN-ADD-01
 * 
 * Create new membership plans with automatic installment calculation
 */

import { useState, useEffect } from 'react';
import { Save, ChevronLeft, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';

interface PlanData {
  title: string;
  description: string;
  amount: string;
  installments: string;
}

interface AddPlanProps {
  onBack: () => void;
  onSave: (planData: PlanData) => void;
}

export default function AddPlan({ onBack, onSave }: AddPlanProps) {
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [amountPerInstallment, setAmountPerInstallment] = useState<number>(0);
  const [generatedPlanId, setGeneratedPlanId] = useState('');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generate Plan ID on mount
  useEffect(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const planId = `PLN-${timestamp}-${randomNum}`;
    setGeneratedPlanId(planId);
  }, []);

  // Calculate amount per installment
  useEffect(() => {
    if (amount && installments) {
      const totalAmount = parseFloat(amount);
      const numInstallments = parseInt(installments);
      
      if (!isNaN(totalAmount) && !isNaN(numInstallments) && numInstallments > 0) {
        const perInstallment = totalAmount / numInstallments;
        setAmountPerInstallment(perInstallment);
      } else {
        setAmountPerInstallment(0);
      }
    } else {
      setAmountPerInstallment(0);
    }
  }, [amount, installments]);

  const handleSaveClick = () => {
    // Validate title
    if (!planTitle.trim()) {
      toast.error('Plan title is required');
      return;
    }

    if (planTitle.length < 3 || planTitle.length > 100) {
      toast.error('Plan title must be between 3-100 characters');
      return;
    }

    // Validate amount
    if (!amount) {
      toast.error('Plan amount is required');
      return;
    }

    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (totalAmount < 1000) {
      toast.error('Plan amount must be at least ₹1,000');
      return;
    }

    // Validate installments
    if (!installments) {
      toast.error('Number of installments is required');
      return;
    }

    const numInstallments = parseInt(installments);
    if (isNaN(numInstallments) || numInstallments <= 0) {
      toast.error('Please enter a valid number of installments');
      return;
    }

    if (numInstallments < 1 || numInstallments > 60) {
      toast.error('Number of installments must be between 1-60');
      return;
    }

    // Validate description (optional but if provided, check word count)
    if (planDescription.trim()) {
      const wordCount = planDescription.trim().split(/\s+/).length;
      if (wordCount > 250) {
        toast.error('Description cannot exceed 250 words');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    onSave({
      title: planTitle,
      description: planDescription,
      amount,
      installments,
    });
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
          Back to Plans
        </button>
        <h1 className="text-2xl">Add New Plan</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Create a new membership plan with installment options
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="space-y-6">
            {/* System Generated Plan ID */}
            <div>
              <label className="block text-sm mb-2">
                Plan ID <span className="text-neutral-500 dark:text-neutral-400">(System Generated)</span>
              </label>
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-500 dark:text-neutral-400">
                {generatedPlanId}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                This ID is automatically generated and cannot be modified
              </p>
            </div>

            {/* Plan Title */}
            <div>
              <label className="block text-sm mb-2">
                Plan Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="e.g. Gold Savings Plan"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                maxLength={100}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {planTitle.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2">
                Description
              </label>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Describe the plan benefits and features..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {planDescription.trim() ? planDescription.trim().split(/\s+/).length : 0}/250 words
              </p>
            </div>

            {/* Amount and Installments Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label className="block text-sm mb-2">
                  Total Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="60000"
                  min="1000"
                  step="100"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Minimum amount: ₹1,000
                </p>
              </div>

              {/* Number of Installments */}
              <div>
                <label className="block text-sm mb-2">
                  Number of Installments <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  placeholder="12"
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Range: 1-60 installments
                </p>
              </div>
            </div>

            {/* Calculated Amount Per Installment */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Amount Per Installment (Calculated)</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Automatically calculated based on total amount ÷ installments
                  </p>
                </div>
              </div>
              <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                {amountPerInstallment > 0 
                  ? `₹${amountPerInstallment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '₹0.00'
                }
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                {amount && installments && amountPerInstallment > 0
                  ? `₹${parseFloat(amount).toLocaleString('en-IN')} ÷ ${installments} installments`
                  : 'Enter amount and installments to see calculation'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={onBack}>
                Cancel
              </SecondaryButton>
              <PrimaryButton icon={Save} onClick={handleSaveClick}>
                Create Plan
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <FormModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Plan Creation"
        >
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to create this plan with the following details?
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Plan ID:</span>
                <span className="text-sm font-medium">{generatedPlanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Plan Title:</span>
                <span className="text-sm font-medium">{planTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount:</span>
                <span className="text-sm font-medium">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Installments:</span>
                <span className="text-sm font-medium">{installments} months</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Per Installment:</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  ₹{amountPerInstallment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
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
    </div>
  );
}