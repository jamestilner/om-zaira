/**
 * PLAN DETAIL PAGE
 * Screen ID: AD-PLAN-DETAIL-01
 * 
 * Detailed plan view with basic details and memberships tabs
 */

import { useState } from 'react';
import { ChevronLeft, Save, Calendar, Users, DollarSign, CreditCard, Store, Smartphone, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormModal, FormFooter } from './hb/common/Form';

interface Plan {
  id: string;
  uid: string;
  title: string;
  description: string;
  amount: number;
  installments: number;
  amountPerInstallment: number;
  status: 'active' | 'inactive';
  createdAt: string;
  subscribers?: number;
  complementaryInstallments?: number;
}

interface PlanUpdateData {
  title: string;
  description: string;
  amountPerInstallment: string;
  installments: string;
  complementaryInstallments: string;
}

interface Subscription {
  id: string;
  membershipId: string;
  userName: string;
  contact: string;
  paymentMode: 'instore' | 'digital';
  startDate: string;
  totalPaid: number;
  remaining: number;
  status: 'active' | 'completed' | 'pending';
}

interface PlanDetailProps {
  plan: Plan;
  onBack: () => void;
  onSave: (planId: string, planData: PlanUpdateData) => void;
  onMembershipClick?: (membershipId: string) => void;
  onNavigateToMemberships?: () => void;
}

// Mock subscription data
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    membershipId: 'MEM-001',
    userName: 'Priya Sharma',
    contact: '+91 98765 43210',
    paymentMode: 'digital',
    startDate: '2024-01-15',
    totalPaid: 25000,
    remaining: 35000,
    status: 'active',
  },
  {
    id: '2',
    membershipId: 'MEM-002',
    userName: 'Rajesh Kumar',
    contact: '+91 98765 43211',
    paymentMode: 'instore',
    startDate: '2024-02-01',
    totalPaid: 30000,
    remaining: 30000,
    status: 'active',
  },
  {
    id: '3',
    membershipId: 'MEM-003',
    userName: 'Anjali Patel',
    contact: '+91 98765 43212',
    paymentMode: 'digital',
    startDate: '2023-12-10',
    totalPaid: 60000,
    remaining: 0,
    status: 'completed',
  },
  {
    id: '4',
    membershipId: 'MEM-004',
    userName: 'Vikram Singh',
    contact: '+91 98765 43213',
    paymentMode: 'instore',
    startDate: '2024-02-20',
    totalPaid: 15000,
    remaining: 45000,
    status: 'active',
  },
  {
    id: '5',
    membershipId: 'MEM-005',
    userName: 'Meera Reddy',
    contact: '+91 98765 43214',
    paymentMode: 'digital',
    startDate: '2024-01-05',
    totalPaid: 10000,
    remaining: 50000,
    status: 'pending',
  },
];

export default function PlanDetail({ plan, onBack, onSave, onMembershipClick, onNavigateToMemberships }: PlanDetailProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'subscriptions'>('basic');
  const [isEditing, setIsEditing] = useState(false);
  
  const [planTitle, setPlanTitle] = useState(plan.title);
  const [planDescription, setPlanDescription] = useState(plan.description);
  const [amountPerInstallment, setAmountPerInstallment] = useState(plan.amountPerInstallment.toString());
  const [installments, setInstallments] = useState(plan.installments.toString());
  const [complementaryInstallments, setComplementaryInstallments] = useState((plan.complementaryInstallments || 0).toString());
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);

  const api = parseFloat(amountPerInstallment) || 0;
  const insts = parseInt(installments) || 1;
  const cInsts = parseInt(complementaryInstallments) || 0;
  const totalAmount = api * (insts + cInsts);

  const lastUpdated = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');

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

    // Validate amount per installment
    if (!amountPerInstallment) {
      toast.error('Amount per installment is required');
      return;
    }

    const apiVal = parseFloat(amountPerInstallment);
    if (isNaN(apiVal) || apiVal <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (apiVal < 100) {
      toast.error('Amount per installment must be at least ₹100');
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

    const compInsts = parseInt(complementaryInstallments) || 0;
    if (compInsts < 0 || compInsts > 20) {
      toast.error('Complementary installments must be between 0-20');
      return;
    }

    // Validate description
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
    onSave(plan.id, {
      title: planTitle,
      description: planDescription,
      amountPerInstallment,
      installments,
      complementaryInstallments,
    });
    setShowConfirmModal(false);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setPlanTitle(plan.title);
    setPlanDescription(plan.description);
    setAmountPerInstallment(plan.amountPerInstallment.toString());
    setInstallments(plan.installments.toString());
    setComplementaryInstallments((plan.complementaryInstallments || 0).toString());
    setIsEditing(false);
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
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl">{plan.title}</h1>
              <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                {plan.status}
              </Badge>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Plan ID: {plan.uid}
            </p>
          </div>
          {!isEditing && activeTab === 'basic' && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Plan
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Basic Details
          </button>
          <button
            onClick={() => {
              if (onNavigateToMemberships) {
                onNavigateToMemberships();
              } else {
                setActiveTab('subscriptions');
              }
            }}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Memberships
          </button>
        </div>
      </div>

      {/* Basic Details Tab */}
      {activeTab === 'basic' && (
        <div className="max-w-4xl">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="space-y-6">
              {/* Plan Title */}
              <div>
                <label className="block text-sm mb-2">
                  Plan Title <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      maxLength={100}
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {planTitle.length}/100 characters
                    </p>
                  </>
                ) : (
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    {plan.title}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-2">Description</label>
                {isEditing ? (
                  <>
                    <textarea
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {planDescription.trim() ? planDescription.trim().split(/\s+/).length : 0}/250 words
                    </p>
                  </>
                ) : (
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    {plan.description || 'No description provided'}
                  </div>
                )}
              </div>

              {/* Amount Per Installment, Installments, Complementary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm mb-2">
                    Amount per installment (₹) <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={amountPerInstallment}
                      onChange={(e) => setAmountPerInstallment(e.target.value)}
                      min="100"
                      step="100"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      ₹{plan.amountPerInstallment.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Number of Installments <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      min="1"
                      max="60"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      {plan.installments} months
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Complementary Installments
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={complementaryInstallments}
                      onChange={(e) => setComplementaryInstallments(e.target.value)}
                      min="0"
                      max="20"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      {plan.complementaryInstallments || 0} months
                    </div>
                  )}
                </div>
              </div>

              {/* Calculated Total Amount */}
              <div>
                <label className="block text-sm mb-2">Total Amount (Calculated)</label>
                <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    ₹{(isEditing ? totalAmount : plan.amount).toLocaleString('en-IN', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {isEditing 
                      ? `₹${parseFloat(amountPerInstallment || '0').toLocaleString('en-IN')} × (${installments || '1'} + ${complementaryInstallments || '0'}) installments`
                      : `₹${plan.amountPerInstallment.toLocaleString('en-IN')} × (${plan.installments} + ${plan.complementaryInstallments || 0}) installments`
                    }
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <label className="block text-sm mb-2">Created Date</label>
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {new Date(plan.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Last Updated</label>
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {lastUpdated}
                  </div>
                </div>
              </div>

              {/* Subscribers Count */}
              <div>
                <label className="block text-sm mb-2">Total Subscribers</label>
                <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <Users className="w-4 h-4 inline mr-2" />
                  {plan.subscribers || 0} subscribers
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <SecondaryButton onClick={handleCancelEdit}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSaveClick}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Memberships Tab */}
      {activeTab === 'subscriptions' && (
        <div>
          {/* Summary Cards - Moved Above Listing */}
          {subscriptions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Memberships</p>
                    <p className="text-2xl mt-1">
                      {subscriptions.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</p>
                    <p className="text-2xl mt-1">
                      ₹{subscriptions.reduce((sum, s) => sum + s.totalPaid, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed</p>
                    <p className="text-2xl mt-1">
                      {subscriptions.filter(s => s.status === 'completed').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Memberships Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Memberships
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                All users subscribed to this plan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm">User Name</th>
                    <th className="text-left px-6 py-3 text-sm">Contact</th>
                    <th className="text-left px-6 py-3 text-sm">Payment Mode</th>
                    <th className="text-left px-6 py-3 text-sm">Start Date</th>
                    <th className="text-left px-6 py-3 text-sm">Total Paid</th>
                    <th className="text-left px-6 py-3 text-sm">Remaining</th>
                    <th className="text-left px-6 py-3 text-sm">Status</th>
                    <th className="text-left px-6 py-3 text-sm"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {subscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                      onClick={() => onMembershipClick && onMembershipClick(subscription.membershipId)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium">{subscription.userName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {subscription.contact}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {subscription.paymentMode === 'digital' ? (
                            <>
                              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm">Digital</span>
                            </>
                          ) : (
                            <>
                              <Store className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm">In-store</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {new Date(subscription.startDate).toLocaleDateString('en-GB')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          ₹{subscription.totalPaid.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          ₹{subscription.remaining.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            subscription.status === 'active'
                              ? 'default'
                              : subscription.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMembershipClick && onMembershipClick(subscription.membershipId);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {subscriptions.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  No memberships found for this plan
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <FormModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Plan Update"
        >
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to update this plan with the following changes?
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Plan Title:</span>
                <span className="text-sm font-medium">{planTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Per Installment:</span>
                <span className="text-sm font-medium">₹{parseFloat(amountPerInstallment).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Installments:</span>
                <span className="text-sm font-medium">{installments} (+{complementaryInstallments})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount:</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowConfirmModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              Confirm & Save
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      )}
    </div>
  );
}