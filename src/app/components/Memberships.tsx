import { useState, useMemo } from 'react';
import {
  Users,
  Eye,
  Ban,
  CreditCard,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import MembershipDetail from './MembershipDetail';
import AddMembership from './AddMembership';
import { toast } from 'sonner';
import { mockMemberships, MembershipData, mockCustomers } from '../data/membershipData';

// Membership interface
interface PaymentHistoryItem {
  installmentNumber: number;
  amount: number;
  date: string;
  method: 'UPI' | 'Card' | 'Cash';
  status: 'paid' | 'pending' | 'failed';
  transactionId?: string;
}

interface Membership {
  id: string;
  uid: string;
  customerName: string;
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
  purchaseHistory?: any[];
  groupMembershipId?: string | null;
}

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships as Membership[]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateFrom, setSelectedDateFrom] = useState('');
  const [selectedDateTo, setSelectedDateTo] = useState('');
  const [isAddingMembership, setIsAddingMembership] = useState(false);

  const itemsPerPage = 10;

  // Filter and search
  const filteredMemberships = useMemo(() => {
    return memberships.filter((membership) => {
      const matchesSearch =
        membership.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membership.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membership.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membership.planName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || membership.status === selectedStatus;

      const matchesDateRange = (() => {
        if (!selectedDateFrom && !selectedDateTo) return true;
        const membershipStart = new Date(membership.startDate);
        const fromDate = selectedDateFrom ? new Date(selectedDateFrom) : null;
        const toDate = selectedDateTo ? new Date(selectedDateTo) : null;

        if (fromDate && toDate) {
          return membershipStart >= fromDate && membershipStart <= toDate;
        } else if (fromDate) {
          return membershipStart >= fromDate;
        } else if (toDate) {
          return membershipStart <= toDate;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [memberships, searchQuery, selectedStatus, selectedDateFrom, selectedDateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredMemberships.length / itemsPerPage);
  const paginatedMemberships = filteredMemberships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: memberships.length,
      active: memberships.filter((m) => m.status === 'active').length,
      completed: memberships.filter((m) => m.status === 'completed').length,
    };
  }, [memberships]);

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

  const handleAddMembership = () => {
    setIsAddingMembership(true);
  };

  const handleSaveMembership = (membershipData: any) => {
    // Add new membership - in real app, this would call the backend
    toast.success('Membership created successfully');
    console.log('Add new membership:', membershipData);
    setIsAddingMembership(false);
  };

  // Show add membership form
  if (isAddingMembership) {
    // Prepare customer list
    const customerList = mockCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
    }));

    // Prepare plan list - mock data from plans
    const planList = [
      {
        id: '1',
        uid: 'PLAN-001',
        name: 'Gold Savings Plan',
        description: 'Most popular plan with excellent value',
        totalAmount: 60000,
        installments: 12,
      },
      {
        id: '2',
        uid: 'PLAN-002',
        name: 'Silver Basic',
        description: 'Perfect entry-level plan for new members',
        totalAmount: 36000,
        installments: 12,
      },
      {
        id: '3',
        uid: 'PLAN-003',
        name: 'Platinum Premium',
        description: 'Premium plan with maximum benefits',
        totalAmount: 120000,
        installments: 12,
      },
      {
        id: '4',
        uid: 'PLAN-004',
        name: 'Diamond Elite',
        description: 'Ultimate luxury plan for elite customers',
        totalAmount: 240000,
        installments: 12,
      },
      {
        id: '5',
        uid: 'PLAN-005',
        name: 'Bronze Starter',
        description: 'Affordable starter plan',
        totalAmount: 24000,
        installments: 12,
      },
    ];

    // Prepare group list - mock data
    const groupList = [
      { id: 'GRP-001', name: 'Mumbai Elite Traders' },
      { id: 'GRP-002', name: 'Surat Diamond Merchants' },
      { id: 'GRP-003', name: 'Bengaluru Trade Group' }
    ];

    return (
      <AddMembership
        customers={customerList}
        plans={planList}
        groups={groupList}
        onBack={() => setIsAddingMembership(false)}
        onSave={handleSaveMembership}
      />
    );
  }

  // Show detail view
  if (selectedMembership) {
    return (
      <MembershipDetail
        membership={selectedMembership}
        onClose={() => setSelectedMembership(null)}
        onUpdate={(updatedMembership) => {
          // Update the membership in the list
          setMemberships(prev => 
            prev.map(m => m.id === updatedMembership.id ? updatedMembership : m)
          );
          setSelectedMembership(updatedMembership);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total / Active</p>
              <p className="text-3xl mt-1">{stats.total} / {stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed</p>
              <p className="text-3xl mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</p>
              <p className="text-3xl mt-1">
                ₹{memberships.reduce((sum, m) => sum + m.totalPaid, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">Memberships</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Monitor and manage all membership subscriptions
          </p>
        </div>
        <Button
          onClick={handleAddMembership}
          className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Membership
        </Button>
      </div>

      <ListHeader
        title=""
        breadcrumbs={[
          { label: 'Memberships' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by membership ID, customer or plan..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => setCurrentPage(1)}
        onReset={() => {
          setSelectedStatus('all');
          setSelectedDateFrom('');
          setSelectedDateTo('');
          setCurrentPage(1);
        }}
      >
        <FilterField label="Status">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </FilterField>

        <FilterField label="Start Date Range">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDateFrom}
              onChange={(e) => setSelectedDateFrom(e.target.value)}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-neutral-500 dark:text-neutral-400">to</span>
            <input
              type="date"
              value={selectedDateTo}
              onChange={(e) => setSelectedDateTo(e.target.value)}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </FilterField>
      </FilterDrawer>

      {/* Table View */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="text-left px-6 py-3 text-sm">Membership ID</th>
                <th className="text-left px-6 py-3 text-sm">Customer</th>
                <th className="text-left px-6 py-3 text-sm">Plan</th>
                <th className="text-left px-6 py-3 text-sm">Group ID</th>
                <th className="text-left px-6 py-3 text-sm">Installments</th>
                <th className="text-left px-6 py-3 text-sm">Payment Progress</th>
                <th className="text-left px-6 py-3 text-sm">Status</th>
                <th className="text-left px-6 py-3 text-sm">Next Payment</th>
                <th className="text-left px-6 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {paginatedMemberships.map((membership) => (
                <tr
                  key={membership.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium">{membership.uid}</span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Started {new Date(membership.startDate).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium">{membership.customerName}</span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {membership.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm">{membership.planName}</span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        ₹{membership.planAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {membership.groupMembershipId ? (
                      <span className="text-sm font-medium">{membership.groupMembershipId}</span>
                    ) : (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm font-medium">
                        {membership.installmentsPaid}/{membership.totalInstallments}
                      </span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        ₹{(
                          membership.monthlyEMI || 
                          (membership.remaining / Math.max(1, membership.totalInstallments - membership.installmentsPaid))
                        ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          ₹{membership.totalPaid.toLocaleString('en-IN')}
                        </span>
                        <span className="font-medium">{membership.paymentProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className={`${getProgressBarColor(membership.paymentProgress)} h-2 rounded-full transition-all`}
                          style={{ width: `${membership.paymentProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadgeVariant(membership.status)}>
                      {membership.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {membership.nextPaymentDate 
                        ? new Date(membership.nextPaymentDate).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMembership(membership)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {membership.status === 'suspended' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('Membership management coming soon')}
                        >
                          <Ban className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Footer */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        Showing {paginatedMemberships.length} of {filteredMemberships.length} memberships
      </div>

      {/* Empty State */}
      {filteredMemberships.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">No memberships found</p>
        </div>
      )}
    </div>
  );
}