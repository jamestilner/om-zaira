/**
 * CUSTOMER DETAIL PAGE
 * Screen ID: AD-CUST-DETAIL-01
 * 
 * Customer detail view with tabs: Basic Details and Membership Plans
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, Mail, Phone, Calendar, CreditCard, Eye, Edit2, MapPin, Globe, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import MembershipDetail from './MembershipDetail';
import { getMembershipsByCustomerId, MembershipData } from '../data/membershipData';

// Payment interface
interface Payment {
  id: string;
  installmentNumber: number;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'failed';
}

// Membership interface (for customer's purchased memberships)
interface Membership {
  id: string;
  membershipId: string;
  planName: string;
  planValue: number;
  totalPaid: number;
  installmentsPaid: number;
  totalInstallments: number;
  nextPaymentDate: string | null;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
  payments: Payment[];
  monthlyEMI?: number;
}

// Customer interface
interface Customer {
  id: string;
  membershipId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  planName: string;
  planValue: number;
  totalPaid: number;
  installmentsPaid: number;
  totalInstallments: number;
  nextPaymentDate: string | null;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
  payments: Payment[];
  memberships?: Membership[];
  country?: string;
  state?: string;
  city?: string;
  area?: string;
}

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
  onEdit?: (customer: Customer) => void;
}

type TabType = 'basic' | 'memberships';

export default function CustomerDetail({ customer, onBack, onEdit }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [selectedMembershipData, setSelectedMembershipData] = useState<MembershipData | null>(null);

  // Get all memberships for this customer from shared data and maintain local state
  const allCustomerMemberships = getMembershipsByCustomerId(customer.id);
  const [localMemberships, setLocalMemberships] = useState<MembershipData[]>(allCustomerMemberships);

  // Update local state when customer changes
  useEffect(() => {
    setLocalMemberships(getMembershipsByCustomerId(customer.id));
  }, [customer.id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Convert to local Membership interface format
  const customerMemberships: Membership[] = localMemberships.length > 0 
    ? localMemberships.map(m => ({
        id: m.id,
        membershipId: m.uid,
        planName: m.planName,
        planValue: m.planAmount,
        totalPaid: m.totalPaid,
        installmentsPaid: m.installmentsPaid,
        totalInstallments: m.totalInstallments,
        nextPaymentDate: m.nextPaymentDate,
        status: m.status === 'suspended' ? 'pending' : m.status,
        startDate: m.startDate,
        endDate: m.endDate,
        payments: m.paymentHistory.map(p => ({
          id: `${m.id}-${p.installmentNumber}`,
          installmentNumber: p.installmentNumber,
          amount: p.amount,
          date: p.date,
          method: p.method,
          status: p.status,
        })),
        monthlyEMI: m.monthlyEMI,
      }))
    : customer.memberships || [
        {
          id: '1',
          membershipId: customer.membershipId,
          planName: customer.planName,
          planValue: customer.planValue,
          totalPaid: customer.totalPaid,
          installmentsPaid: customer.installmentsPaid,
          totalInstallments: customer.totalInstallments,
          nextPaymentDate: customer.nextPaymentDate,
          status: customer.status,
          startDate: customer.startDate,
          endDate: customer.endDate,
          payments: customer.payments,
        },
      ];

  // Calculate progress percentage
  const calculateProgress = (paid: number, total: number) => {
    return total > 0 ? Math.round((paid / total) * 100) : 0;
  };

  // Handle membership update from MembershipDetail
  const handleMembershipUpdate = (updatedMembership: MembershipData) => {
    setLocalMemberships(prev => 
      prev.map(m => m.id === updatedMembership.id ? updatedMembership : m)
    );
    setSelectedMembership(null);
    setSelectedMembershipData(null);
  };

  // Handle view membership details
  const handleViewMembership = (membership: Membership) => {
    // Find the full membership data
    const fullMembershipData = localMemberships.find(m => m.id === membership.id);
    if (fullMembershipData) {
      setSelectedMembershipData(fullMembershipData);
      setSelectedMembership(membership);
    }
  };

  // If viewing membership detail, show that component
  if (selectedMembership && selectedMembershipData) {
    return (
      <MembershipDetail
        membership={selectedMembershipData}
        onClose={() => {
          setSelectedMembership(null);
          setSelectedMembershipData(null);
        }}
        onUpdate={handleMembershipUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                {customer.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Customer Management</span>
                <span>›</span>
                <span>Customers</span>
                <span>›</span>
                <span>{customer.name}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Basic Details
            </button>
            <button
              onClick={() => setActiveTab('memberships')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'memberships'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Plans / Memberships
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        {activeTab === 'basic' ? (
          // Basic Details Tab
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900" />
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-neutral-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {getInitials(customer.name)}
                    </span>
                  </div>
                  <div className="flex-1 pb-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                      {customer.name}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Customer ID: {customer.membershipId}
                    </p>
                  </div>
                  <div className="pb-2 flex items-center gap-2">
                    {customer.status === 'pending' ? (
                      <Badge variant="default" className="bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400">
                        Pending
                      </Badge>
                    ) : customer.status === 'completed' ? (
                      <Badge variant="default" className="bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400">
                        Active
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (onEdit) {
                          onEdit(customer);
                        } else {
                          toast.info('Edit customer feature coming soon');
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Contact Information
                    </h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Email Address</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white break-words">
                          {customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Phone Number</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {customer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Country</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {customer.country || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <Map className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">State</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {customer.state || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">City & Area</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {customer.city || '-'}{customer.area ? `, ${customer.area}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Membership Information
                    </h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Join Date</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatDate(customer.joinDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Total Memberships</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {customerMemberships.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Memberships Tab
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Membership Plans
                  </h3>
                  <Badge variant="secondary">
                    {customerMemberships.length} {customerMemberships.length === 1 ? 'Plan' : 'Plans'}
                  </Badge>
                </div>
              </div>

              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm">Membership ID</th>
                      <th className="text-left px-6 py-3 text-sm">Plan</th>
                      <th className="text-left px-6 py-3 text-sm">Installments</th>
                      <th className="text-left px-6 py-3 text-sm">Payment Progress</th>
                      <th className="text-left px-6 py-3 text-sm">Status</th>
                      <th className="text-left px-6 py-3 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {customerMemberships.map((membership) => {
                      const progressPercentage = calculateProgress(
                        membership.installmentsPaid,
                        membership.totalInstallments
                      );
                      const getProgressBarColor = (progress: number) => {
                        if (progress >= 75) return 'bg-success-500 dark:bg-success-400';
                        if (progress >= 50) return 'bg-primary-500 dark:bg-primary-400';
                        if (progress >= 25) return 'bg-warning-500 dark:bg-warning-400';
                        return 'bg-danger-500 dark:bg-danger-400';
                      };

                      return (
                        <tr
                          key={membership.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-medium">{membership.membershipId}</span>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Started {formatDate(membership.startDate)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-sm">{membership.planName}</span>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {formatCurrency(membership.planValue)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-sm font-medium">
                                {membership.installmentsPaid}/{membership.totalInstallments}
                              </span>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {formatCurrency(membership.monthlyEMI || (membership.planValue / membership.totalInstallments))}/mo
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                  {formatCurrency(membership.totalPaid)}
                                </span>
                                <span className="font-medium">{progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                <div
                                  className={`${getProgressBarColor(progressPercentage)} h-2 rounded-full transition-all`}
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {membership.status === 'pending' ? (
                              <Badge variant="default" className="bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400">
                                Pending
                              </Badge>
                            ) : membership.status === 'completed' ? (
                              <Badge variant="default" className="bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400">
                                Active
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMembership(membership)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}