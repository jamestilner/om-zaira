/**
 * MEMBERSHIP DETAIL PAGE
 * Screen ID: AD-MEM-DETAIL-01
 * 
 * Detailed membership view with payment history, manual update capability, and offline purchase adjustment
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, Download, Edit2, CheckCircle2, Plus, Trash2, Eye, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSelect,
} from './hb/common/Form';
import { getCategoryNames, getSubcategories } from '../constants/productCategories';
import { GroupItem } from '../modules/groups/GroupForm';

interface PaymentHistoryItem {
  installmentNumber: number;
  amount: number;
  date: string;
  paymentDate?: string;
  method: 'UPI' | 'Card' | 'Cash';
  status: 'paid' | 'pending' | 'failed';
  transactionId?: string;
  notes?: string;
  attachments?: string[];
}

interface PurchaseItem {
  id: string;
  sku?: string;
  itemName: string;
  category: string;
  subCategory: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface PurchaseRecord {
  id: string;
  purchaseId: string;
  invoiceNumber?: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalPurchaseAmount: number;
  amountAdjusted: number;
  remainingBalanceAfterPurchase: number;
  newEMI: number;
}

interface Membership {
  id: string;
  uid: string;
  customerName: string;
  customerId?: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planAmount: number;
  installmentsPaid: number;
  totalInstallments: number;
  totalPaid: number;
  remaining: number;
  paymentProgress: number;
  status: 'active' | 'completed' | 'pending' | 'suspended';
  nextPaymentDate: string;
  startDate: string;
  endDate: string;
  paymentHistory: PaymentHistoryItem[];
  monthlyEMI?: number;
  duration?: number;
  purchaseHistory?: PurchaseRecord[];
  groupMembershipId?: string | null;
}

interface MembershipDetailProps {
  membership: Membership;
  onClose: () => void;
  onUpdate?: (updatedMembership: Membership) => void;
}

export default function MembershipDetail({ membership: initialMembership, onClose, onUpdate }: MembershipDetailProps) {
  const [membership, setMembership] = useState<Membership>({
    ...initialMembership,
    monthlyEMI: initialMembership.monthlyEMI || initialMembership.planAmount / initialMembership.totalInstallments,
    duration: initialMembership.duration || initialMembership.totalInstallments,
    purchaseHistory: initialMembership.purchaseHistory || [],
  });

  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showOfflinePurchaseModal, setShowOfflinePurchaseModal] = useState(false);
  const [showPurchaseDetailModal, setShowPurchaseDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    transactionId: '',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'Cash',
    paymentDate: '',
    notes: '',
    attachments: [] as string[],
    markAsPaid: false,
  });

  const [showAssignGroupModal, setShowAssignGroupModal] = useState(false);
  const [mockGroups, setMockGroups] = useState<GroupItem[]>([
    {
      id: 'GRP-001',
      name: 'Mumbai Elite Traders',
      code: 'MET',
      category: 'FDC',
      maxCapacity: 50,
      currentMembers: 42,
      status: 'Active',
      createdAt: '2025-10-15T10:00:00',
    },
    {
      id: 'GRP-002',
      name: 'Surat Diamond Merchants',
      code: 'SDM',
      category: 'Royal',
      maxCapacity: 20,
      currentMembers: 20,
      status: 'Active',
      createdAt: '2025-11-01T14:30:00',
    },
    {
      id: 'GRP-003',
      name: 'Bengaluru Trade Group',
      code: 'BTG',
      category: 'FDC',
      maxCapacity: 75,
      currentMembers: 10,
      status: 'Active',
      createdAt: '2026-02-01T13:00:00',
    }
  ]);

  // Offline Purchase Form State
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isDifferenceApplicable, setIsDifferenceApplicable] = useState(false);
  const [differenceAmount, setDifferenceAmount] = useState<number | ''>('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { id: '1', sku: '', itemName: '', category: '', subCategory: '', quantity: 1, price: 0, subtotal: 0 },
  ]);

  const MOCK_SKUS = useMemo(() => [
    { sku: 'RN-101', name: 'Diamond Engagement Ring', category: 'Rings', price: 95000 },
    { sku: 'NK-205', name: 'Gold Chain Necklace', category: 'Necklaces', price: 45000 },
    { sku: 'ER-302', name: 'Pearl Drop Earrings', category: 'Earrings', price: 15000 },
    { sku: 'BR-401', name: 'Silver Charm Bracelet', category: 'Bracelets', price: 8500 },
    { sku: 'NK-881', name: 'Solitaire Pendant', category: 'Necklaces', price: 32000 },
  ], []);

  // Calculate totals for offline purchase
  const totalPurchaseAmount = useMemo(() => {
    return purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [purchaseItems]);

  const remainingMonths = (membership.duration || membership.totalInstallments) - membership.installmentsPaid;

  const calculationPreview = useMemo(() => {
    const totalOfflinePurchaseAmount = totalPurchaseAmount;
    const totalAmount = membership.planAmount + totalPurchaseAmount;
    const amountAlreadyPaid = membership.totalPaid;
    const outstandingBalance = totalOfflinePurchaseAmount > 0
      ? totalOfflinePurchaseAmount - amountAlreadyPaid
      : membership.planAmount - amountAlreadyPaid;

    let newEMI = 0;
    if (remainingMonths > 0) {
      if (isDifferenceApplicable && typeof differenceAmount === 'number' && differenceAmount > 0) {
        newEMI = (outstandingBalance - differenceAmount) / remainingMonths;
      } else {
        newEMI = outstandingBalance / remainingMonths;
      }
    }

    return {
      totalPlanAmount: membership.planAmount,
      totalOfflinePurchaseAmount,
      totalAmount,
      amountAlreadyPaid,
      outstandingBalance,
      remainingMonths,
      newEMI: Math.max(0, newEMI),
    };
  }, [totalPurchaseAmount, membership.planAmount, membership.totalPaid, remainingMonths, isDifferenceApplicable, differenceAmount, membership.monthlyEMI, membership.totalInstallments]);

  // Calculate payment summary breakdown
  const paymentSummary = useMemo(() => {
    // Calculate total offline purchases from purchase history
    const totalOfflinePurchases = (membership.purchaseHistory || []).reduce(
      (sum, purchase) => sum + purchase.totalPurchaseAmount,
      0
    );

    // Original plan amount is current plan amount minus all offline purchases
    const originalPlanAmount = membership.planAmount - totalOfflinePurchases;

    return {
      originalPlanAmount,
      offlinePurchaseAmount: totalOfflinePurchases,
      totalAmount: membership.planAmount, // Current plan amount includes offline purchases
      totalPaid: membership.totalPaid,
      remaining: membership.remaining,
      monthlyEMI: membership.monthlyEMI || 0,
    };
  }, [membership.planAmount, membership.purchaseHistory, membership.totalPaid, membership.remaining, membership.monthlyEMI]);

  const getStatusBadgeVariant = (status: Membership['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    if (progress >= 25) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₹0';
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleManageMembership = () => {
    toast.info('Manage Membership functionality coming soon');
  };

  const handleDownloadReceipt = (payment: PaymentHistoryItem) => {
    toast.success(`Downloading receipt for ${payment.transactionId}`);
  };

  const handleUpdatePayment = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
    setPaymentForm({
      transactionId: payment.transactionId || '',
      paymentMethod: payment.method,
      paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
      notes: payment.notes || '',
      attachments: payment.attachments || [],
      markAsPaid: payment.status === 'paid',
    });
    setShowUpdatePaymentModal(true);
  };

  const handleSubmitPaymentUpdate = () => {
    if (!paymentForm.transactionId || !paymentForm.paymentDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedPayment) return;

    // Check if this payment exists in the history
    const existingPaymentIndex = membership.paymentHistory.findIndex(
      p => p.installmentNumber === selectedPayment.installmentNumber
    );

    let updatedPaymentHistory: PaymentHistoryItem[];

    if (existingPaymentIndex >= 0) {
      // Update existing payment
      updatedPaymentHistory = membership.paymentHistory.map(payment => {
        if (payment.installmentNumber === selectedPayment.installmentNumber) {
          return {
            ...payment,
            transactionId: paymentForm.transactionId,
            method: paymentForm.paymentMethod,
            paymentDate: paymentForm.paymentDate,
            notes: paymentForm.notes,
            attachments: paymentForm.attachments,
            status: paymentForm.markAsPaid ? ('paid' as const) : payment.status,
          };
        }
        return payment;
      });
    } else {
      // Add new payment record for a previously pending installment
      const newPayment: PaymentHistoryItem = {
        installmentNumber: selectedPayment.installmentNumber,
        amount: selectedPayment.amount,
        date: selectedPayment.date,
        paymentDate: paymentForm.paymentDate,
        method: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
        attachments: paymentForm.attachments,
        status: paymentForm.markAsPaid ? ('paid' as const) : ('pending' as const),
      };
      updatedPaymentHistory = [...membership.paymentHistory, newPayment];
    }

    // Recalculate totals if marked as paid
    let updatedTotalPaid = membership.totalPaid;
    let updatedInstallmentsPaid = membership.installmentsPaid;
    let updatedPaymentProgress = membership.paymentProgress;
    let updatedRemaining = membership.remaining;

    if (paymentForm.markAsPaid && selectedPayment.status === 'pending') {
      updatedTotalPaid += selectedPayment.amount;
      updatedInstallmentsPaid += 1;
      updatedRemaining = membership.planAmount - updatedTotalPaid;
      updatedPaymentProgress = Math.round((updatedTotalPaid / membership.planAmount) * 100);
    }

    // Update membership
    const updatedMembership: Membership = {
      ...membership,
      paymentHistory: updatedPaymentHistory,
      totalPaid: updatedTotalPaid,
      installmentsPaid: updatedInstallmentsPaid,
      remaining: updatedRemaining,
      paymentProgress: updatedPaymentProgress,
    };

    setMembership(updatedMembership);

    // Notify parent component of update
    if (onUpdate) {
      onUpdate(updatedMembership);
    }

    toast.success('Payment updated successfully');
    setShowUpdatePaymentModal(false);
    setSelectedPayment(null);
    setPaymentForm({
      transactionId: '',
      paymentMethod: 'UPI',
      paymentDate: '',
      notes: '',
      attachments: [],
      markAsPaid: false,
    });
  };

  // Offline Purchase Functions
  const handleAddPurchaseItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      sku: '',
      itemName: '',
      category: '',
      subCategory: '',
      quantity: 1,
      price: 0,
      subtotal: 0,
    };
    setPurchaseItems([...purchaseItems, newItem]);
  };

  const handleRemovePurchaseItem = (id: string) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter(item => item.id !== id));
    }
  };

  const handlePurchaseItemChange = (id: string, field: keyof PurchaseItem, value: any) => {
    setPurchaseItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'sku') {
            const found = MOCK_SKUS.find(m => m.sku === value);
            if (found) {
              updatedItem.itemName = found.name;
              updatedItem.category = found.category;
            }
          }

          // Reset subcategory when category changes
          if (field === 'category') {
            updatedItem.subCategory = '';
          }
          // Auto-calculate subtotal when quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.subtotal = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSubmitOfflinePurchase = () => {
    // Validate items
    const hasEmptyItems = purchaseItems.some(item => !item.itemName || item.price <= 0);
    if (hasEmptyItems) {
      toast.error('Please fill in all item details with valid prices');
      return;
    }

    if (totalPurchaseAmount <= 0) {
      toast.error('Total purchase amount must be greater than zero');
      return;
    }

    // Generate purchase ID
    const purchaseId = `PUR-${Date.now()}`;

    // Difference adjustment calculations
    const diffAmt = (isDifferenceApplicable && typeof differenceAmount === 'number' && differenceAmount > 0) ? differenceAmount : 0;
    
    // Create extra payment record if difference amount applied
    let updatedPaymentHistory = [...membership.paymentHistory];
    if (diffAmt > 0) {
      const diffPayment: PaymentHistoryItem = {
        installmentNumber: Date.now(), // unique identifier for offline adjustment
        amount: diffAmt,
        date: purchaseDate,
        method: 'Cash',
        status: 'pending',
        notes: `Offline Purchase Adjustment (Difference Amount)`,
      };
      updatedPaymentHistory.push(diffPayment);
    }

    // Do not add difference amount to totalPaid yet since it's just pending
    const updatedTotalPaid = membership.totalPaid;
    const updatedRemaining = calculationPreview.outstandingBalance;

    // Create purchase record
    const newPurchase: PurchaseRecord = {
      id: Date.now().toString(),
      purchaseId,
      invoiceNumber,
      purchaseDate,
      items: [...purchaseItems],
      totalPurchaseAmount,
      amountAdjusted: updatedTotalPaid,
      remainingBalanceAfterPurchase: updatedRemaining,
      newEMI: calculationPreview.newEMI,
    };

    // Update membership with new calculations
    const updatedMembership: Membership = {
      ...membership,
      planAmount: calculationPreview.totalAmount, // Update to include offline purchase
      remaining: updatedRemaining,
      totalPaid: updatedTotalPaid,
      monthlyEMI: calculationPreview.newEMI,
      paymentProgress: Math.round((updatedTotalPaid / calculationPreview.totalAmount) * 100),
      purchaseHistory: [...(membership.purchaseHistory || []), newPurchase],
      paymentHistory: updatedPaymentHistory,
    };

    setMembership(updatedMembership);

    // Notify parent component of update
    if (onUpdate) {
      onUpdate(updatedMembership);
    }

    // Reset form
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setInvoiceNumber('');
    setIsDifferenceApplicable(false);
    setDifferenceAmount('');
    setPurchaseItems([
      { id: '1', sku: '', itemName: '', category: '', subCategory: '', quantity: 1, price: 0, subtotal: 0 },
    ]);
    setShowOfflinePurchaseModal(false);

    toast.success('Offline purchase recorded successfully');
  };

  const handleViewPurchaseDetails = (purchase: PurchaseRecord) => {
    setSelectedPurchase(purchase);
    setShowPurchaseDetailModal(true);
  };

  // Generate all installment records (paid + pending)
  const allInstallments = useMemo(() => {
    const installments: PaymentHistoryItem[] = [];
    const startDate = new Date(membership.startDate);
    const currentEMI = membership.monthlyEMI || (membership.planAmount / membership.totalInstallments);

    // Create a map of existing payment history for quick lookup
    const paymentMap = new Map(
      membership.paymentHistory.map(p => [p.installmentNumber, p])
    );

    for (let i = 1; i <= membership.totalInstallments; i++) {
      // Check if this installment already has payment data
      const existingPayment = paymentMap.get(i);

      if (existingPayment) {
        // Use existing payment data
        installments.push(existingPayment);
      } else {
        // Generate pending installment
        const installmentDate = new Date(startDate);
        installmentDate.setMonth(startDate.getMonth() + (i - 1));

        installments.push({
          installmentNumber: i,
          amount: currentEMI,
          date: installmentDate.toISOString().split('T')[0],
          method: 'UPI',
          status: 'pending',
        });
      }
    }

    // Include extra payments (e.g., Difference Amounts)
    const extraPayments = membership.paymentHistory.filter(
      (p) => p.installmentNumber > membership.totalInstallments
    );
    installments.push(...extraPayments);

    // Helper to safely parse dates avoiding NaN on DD/MM/YYYY formats
    const parseDateForSort = (dateStr: string) => {
      if (!dateStr) return 0;
      const t = new Date(dateStr).getTime();
      if (!isNaN(t)) return t;
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      }
      return 0;
    };

    // Sort by Date (increasing order), prioritize offline adjustments in a tie
    installments.sort((a, b) => {
      const timeDiff = parseDateForSort(a.date) - parseDateForSort(b.date);
      if (timeDiff === 0) {
        const aIsDiff = a.installmentNumber > membership.totalInstallments;
        const bIsDiff = b.installmentNumber > membership.totalInstallments;
        if (aIsDiff && !bIsDiff) return -1;
        if (!aIsDiff && bIsDiff) return 1;
        return (a.installmentNumber as number) - (b.installmentNumber as number);
      }
      return timeDiff;
    });

    return installments;
  }, [membership.paymentHistory, membership.totalInstallments, membership.startDate, membership.monthlyEMI, membership.planAmount]);

  const handleAssignGroup = (group: GroupItem) => {
    if (membership.groupMembershipId) {
      if (!window.confirm('This member is already assigned to a group. Do you want to reassign?')) {
        return;
      }
    }

    const availableSlots = group.maxCapacity - group.currentMembers;
    if (availableSlots <= 0) {
      toast.error('This group is already full.');
      return;
    }

    // Generate groupMembershipId: {GroupCode}-{sequence}/{position}
    // For mock, using random sequence and position
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const position = group.currentMembers + 1;
    const newGroupMembershipId = `${group.code}-${sequence}/${position}`;

    const updatedMembership: Membership = {
      ...membership,
      groupMembershipId: newGroupMembershipId,
    };

    // Update local state
    setMembership(updatedMembership);

    // Update mock groups (increment currentMembers)
    setMockGroups(prev => prev.map(g =>
      g.id === group.id ? { ...g, currentMembers: g.currentMembers + 1 } : g
    ));

    if (onUpdate) {
      onUpdate(updatedMembership);
    }

    setShowAssignGroupModal(false);
    toast.success(`Assigned to group: ${group.name} (${newGroupMembershipId})`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Memberships
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl">{membership.uid}</h1>
              <Badge variant={getStatusBadgeVariant(membership.status)}>
                {membership.status}
              </Badge>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Memberships → {membership.customerName}
            </p>
          </div>
          <Button onClick={handleManageMembership}>
            Manage Membership
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Customer & Membership Information */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                Customer Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Name</p>
                  <p className="font-medium mt-1">{membership.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    {membership.customerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Phone Number</p>
                  <p className="text-sm mt-1">{membership.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                Membership Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Plan Name</p>
                  <p className="font-medium mt-1">{membership.planName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Status</p>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(membership.status)}>
                      {membership.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Start Date</p>
                    <p className="text-sm mt-1">{formatDate(membership.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">End Date</p>
                    <p className="text-sm mt-1">{formatDate(membership.endDate)}</p>
                  </div>
                </div>
                {membership.groupMembershipId && (
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Group ID</p>
                    <p className="font-medium mt-1 text-primary-600 dark:text-primary-400">
                      {membership.groupMembershipId}
                    </p>
                  </div>
                )}
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setShowAssignGroupModal(true)}
                  >
                    {membership.groupMembershipId ? 'Reassign Group' : 'Assign Group'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary with Add Offline Purchase Button */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Payment Summary
            </h3>
            <Button
              onClick={() => setShowOfflinePurchaseModal(true)}
              size="sm"
              className="gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Add Offline Purchase
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {/* Plan Amount */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Plan Amount</p>
              <p className="text-xl font-semibold mt-2">
                {formatCurrency(paymentSummary.originalPlanAmount)}
              </p>
            </div>

            {/* Offline Purchase Amount - Only show if there are purchases */}
            {paymentSummary.offlinePurchaseAmount > 0 && (
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-400">Offline Purchase Amount</p>
                <p className="text-xl font-semibold mt-2 text-purple-700 dark:text-purple-400">
                  {formatCurrency(paymentSummary.offlinePurchaseAmount)}
                </p>
              </div>
            )}

            {/* Total Amount - Only show if there are offline purchases */}
            {paymentSummary.offlinePurchaseAmount > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs text-indigo-700 dark:text-indigo-400">Total Amount (Plan + Offline)</p>
                <p className="text-xl font-semibold mt-2 text-indigo-700 dark:text-indigo-400">
                  {formatCurrency(paymentSummary.totalAmount)}
                </p>
              </div>
            )}

            {/* Total Paid */}
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-400">Total Paid</p>
              <p className="text-xl font-semibold mt-2 text-green-700 dark:text-green-400">
                {formatCurrency(paymentSummary.totalPaid)}
              </p>
            </div>

            {/* Remaining */}
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-400">Remaining</p>
              <p className="text-xl font-semibold mt-2 text-orange-700 dark:text-orange-400">
                {formatCurrency(paymentSummary.remaining)}
              </p>
            </div>

            {/* Monthly EMI */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400">Monthly EMI</p>
              <p className="text-xl font-semibold mt-2 text-blue-700 dark:text-blue-400">
                {formatCurrency(paymentSummary.monthlyEMI)}
              </p>
            </div>
          </div>

          {/* Payment Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Payment Progress</p>
              <p className="text-sm font-semibold">{membership.paymentProgress}%</p>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
              <div
                className={`${getProgressBarColor(membership.paymentProgress)} h-3 rounded-full transition-all`}
                style={{ width: `${membership.paymentProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
              Payment History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Payment Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Method
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Transaction ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {allInstallments.map((payment) => (
                  <tr
                    key={payment.installmentNumber}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {payment.installmentNumber > membership.totalInstallments
                        ? 'Difference Amount'
                        : `Installment #${payment.installmentNumber}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {payment.transactionId ? (
                        <span className="font-mono text-xs">{payment.transactionId}</span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'paid' && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Paid</span>
                        </div>
                      )}
                      {payment.status === 'pending' && (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      {payment.status === 'failed' && (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'paid' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Download className="w-4 h-4 mr-1.5" />
                          Download Receipt
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdatePayment(payment)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Update
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase History */}
        {membership.purchaseHistory && membership.purchaseHistory.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                Offline Purchase History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Purchase ID
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Purchase Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Items
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Total Purchase Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Amount Adjusted
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Remaining Balance
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {membership.purchaseHistory.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {purchase.purchaseId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(purchase.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {purchase.items.length} item{purchase.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatCurrency(purchase.totalPurchaseAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatCurrency(purchase.amountAdjusted)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatCurrency(purchase.remainingBalanceAfterPurchase)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPurchaseDetails(purchase)}
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Update Payment Modal */}
      {showUpdatePaymentModal && selectedPayment && (
        <FormModal
          title="Update Payment Details"
          description={`Update payment information for Installment #${selectedPayment.installmentNumber}`}
          isOpen={showUpdatePaymentModal}
          onClose={() => {
            setShowUpdatePaymentModal(false);
            setSelectedPayment(null);
          }}
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUpdatePaymentModal(false);
                  setSelectedPayment(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitPaymentUpdate}
              >
                Update Payment
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Mark as Paid Toggle */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div>
                <p className="text-sm font-medium">Mark as Paid</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Update this installment status to paid
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={paymentForm.markAsPaid}
                onClick={() => setPaymentForm({ ...paymentForm, markAsPaid: !paymentForm.markAsPaid })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentForm.markAsPaid
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentForm.markAsPaid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <FormField>
              <FormLabel required>Transaction ID</FormLabel>
              <FormInput
                type="text"
                placeholder="Enter transaction ID"
                value={paymentForm.transactionId}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, transactionId: e.target.value })
                }
              />
            </FormField>

            <FormField>
              <FormLabel required>Payment Method</FormLabel>
              <FormSelect
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value as 'UPI' | 'Card' | 'Cash',
                  })
                }
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </FormSelect>
            </FormField>

            <FormField>
              <FormLabel required>Payment Date</FormLabel>
              <FormInput
                type="date"
                value={paymentForm.paymentDate}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
                }
              />
            </FormField>

            <FormField>
              <FormLabel>Notes</FormLabel>
              <textarea
                placeholder="Add any additional notes about this payment..."
                value={paymentForm.notes}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              />
            </FormField>

            <FormField>
              <FormLabel>Attachments / Images</FormLabel>
              <div className="space-y-2">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    // In a real app, you'd upload these files and get URLs
                    const fileNames = files.map(f => f.name);
                    setPaymentForm({ ...paymentForm, attachments: fileNames });
                    if (files.length > 0) {
                      toast.info(`${files.length} file(s) selected`);
                    }
                  }}
                  className="w-full px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-400 dark:hover:file:bg-blue-900"
                />
                {paymentForm.attachments.length > 0 && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    {paymentForm.attachments.length} file(s) attached: {paymentForm.attachments.join(', ')}
                  </div>
                )}
              </div>
            </FormField>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Installment Amount:</strong> {formatCurrency(selectedPayment.amount)}
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">
                <strong>Due Date:</strong> {formatDate(selectedPayment.date)}
              </p>
            </div>
          </div>
        </FormModal>
      )}

      {/* Offline Purchase Modal */}
      {showOfflinePurchaseModal && (
        <FormModal
          title="Add Offline Purchase"
          description="Record jewellery purchases made in-store"
          isOpen={showOfflinePurchaseModal}
          onClose={() => setShowOfflinePurchaseModal(false)}
          maxWidth="max-w-5xl"
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOfflinePurchaseModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitOfflinePurchase}
              >
                Save Purchase
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Purchase Date and Invoice Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField>
                <FormLabel required>Purchase Date</FormLabel>
                <FormInput
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>Invoice Number</FormLabel>
                <FormInput
                  type="text"
                  maxLength={20}
                  placeholder="Enter invoice number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </FormField>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FormLabel>Items</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPurchaseItem}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Item
                </Button>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          SKU
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Item
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Category
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Quantity
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Price (₹)
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Subtotal (₹)
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {purchaseItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 w-32">
                            <FormInput
                              type="text"
                              list={`sku-list-${item.id}`}
                              placeholder="Search SKU"
                              value={item.sku || ''}
                              onChange={(e) =>
                                handlePurchaseItemChange(item.id, 'sku', e.target.value)
                              }
                            />
                            <datalist id={`sku-list-${item.id}`}>
                              {MOCK_SKUS.map((m) => (
                                <option key={m.sku} value={m.sku}>
                                  {m.name}
                                </option>
                              ))}
                            </datalist>
                          </td>
                          <td className="px-4 py-3">
                            <FormInput
                              type="text"
                              placeholder="e.g., Gold Necklace"
                              value={item.itemName}
                              onChange={(e) =>
                                handlePurchaseItemChange(item.id, 'itemName', e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            <FormSelect
                              value={item.category}
                              onChange={(e) =>
                                handlePurchaseItemChange(item.id, 'category', e.target.value)
                              }
                            >
                              <option value="">Select category</option>
                              {getCategoryNames().map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </FormSelect>
                          </td>
                          <td className="px-4 py-3 w-20">
                            <FormInput
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (isNaN(val)) val = 1;
                                val = Math.min(99, Math.max(1, val));
                                handlePurchaseItemChange(item.id, 'quantity', val);
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <FormInput
                              type="number"
                              min="0"
                              placeholder="0"
                              value={item.price || ''}
                              onChange={(e) =>
                                handlePurchaseItemChange(item.id, 'price', parseFloat(e.target.value) || 0)
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium">
                              {item.subtotal.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePurchaseItem(item.id)}
                              disabled={purchaseItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Purchase Amount and Difference Setup */}
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

                {/* Difference Amount Toggle & Input */}
                <div className="flex-1 space-y-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 max-w-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Difference Amount applicable?</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isDifferenceApplicable}
                      onClick={() => {
                        setIsDifferenceApplicable(!isDifferenceApplicable);
                        if (isDifferenceApplicable) setDifferenceAmount('');
                      }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${isDifferenceApplicable
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDifferenceApplicable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  {isDifferenceApplicable && (
                    <div className="mt-3">
                      <FormLabel>Difference Amount (₹)</FormLabel>
                      <FormInput
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        value={differenceAmount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDifferenceAmount(isNaN(val) ? '' : val);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Total Offline Purchase display */}
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-6 py-3 border border-neutral-200 dark:border-neutral-700 mt-4 md:mt-0 md:ml-auto">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Offline Purchase Amount</p>
                  <p className="text-2xl font-semibold mt-1">
                    {formatCurrency(totalPurchaseAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Preview */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">
                Calculation Preview
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Total Plan Amount</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(calculationPreview.totalPlanAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Total Offline Purchase Amount</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(calculationPreview.totalOfflinePurchaseAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Outstanding Balance</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(calculationPreview.outstandingBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Amount Already Paid</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(calculationPreview.amountAlreadyPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Remaining Months</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {calculationPreview.remainingMonths}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">New Monthly EMI</p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                    {formatCurrency(calculationPreview.newEMI)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* Purchase Detail Modal */}
      {showPurchaseDetailModal && selectedPurchase && (
        <FormModal
          title="Purchase Details"
          description={`Purchase ID: ${selectedPurchase.purchaseId}`}
          isOpen={showPurchaseDetailModal}
          onClose={() => {
            setShowPurchaseDetailModal(false);
            setSelectedPurchase(null);
          }}
          footer={
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPurchaseDetailModal(false);
                  setSelectedPurchase(null);
                }}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Purchase Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Purchase Date</p>
                <p className="text-sm font-medium mt-1">{formatDate(selectedPurchase.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Invoice Number</p>
                <p className="text-sm font-medium mt-1">{selectedPurchase.invoiceNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Amount</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(selectedPurchase.totalPurchaseAmount)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-sm font-medium mb-3">Items Purchased</h4>
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        SKU
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Item
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Quantity
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {selectedPurchase.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">{item.sku || '-'}</td>
                        <td className="px-4 py-3 text-sm">{item.itemName}</td>
                        <td className="px-4 py-3 text-sm">{item.category || '-'}</td>
                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Amount Adjusted from Membership:</span>
                <span className="text-sm font-medium">{formatCurrency(selectedPurchase.amountAdjusted)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Remaining Balance After Purchase:</span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {formatCurrency(selectedPurchase.remainingBalanceAfterPurchase)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-sm font-medium">New Monthly EMI:</span>
                <span className="text-lg font-semibold">{formatCurrency(selectedPurchase.newEMI)}</span>
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* Assign Group Modal */}
      <FormModal
        isOpen={showAssignGroupModal}
        onClose={() => setShowAssignGroupModal(false)}
        title="Assign Group"
        description="Select a group to assign this member to. Groups with no available slots are disabled."
        maxWidth="max-w-3xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">Group Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">Available Slots</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {mockGroups.map((group) => {
                const availableSlots = group.maxCapacity - group.currentMembers;
                const isFull = availableSlots <= 0;

                return (
                  <tr key={group.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm font-medium">{group.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{group.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isFull ? (
                        <span className="text-red-500 font-medium whitespace-nowrap">Group Full</span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {availableSlots} / {group.maxCapacity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        disabled={isFull}
                        onClick={() => handleAssignGroup(group)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormModal>
    </div>
  );
}