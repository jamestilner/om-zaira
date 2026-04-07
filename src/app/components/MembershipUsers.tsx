/**
 * MEMBERSHIP USERS MANAGEMENT
 * Screen ID: AD-CUST-LIST-01
 * 
 * Manage customer memberships and payments
 * Based on /Modules/membership_users_manage.md specifications
 * 
 * Detail Modal: Screen ID: AD-CUST-DETAIL-01
 * Based on /Modules/Customer_Membership_Detail.md specifications
 */

import { useState, useMemo } from 'react';
import {
  Users,
  Download,
  Eye,
  Mail,
  Phone,
  MoreVertical,
  User,
  Plus,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import CustomerDetail from './CustomerDetail';
import AddCustomer, { CustomerFormData } from './AddCustomer';
import AddMembership from './AddMembership';
import { mockCustomers, mockMemberships, getMembershipsByCustomerId } from '../data/membershipData';

// Payment interface
interface Payment {
  id: string;
  installmentNumber: number;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'failed';
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
  country?: string;
  state?: string;
  city?: string;
  area?: string;
}

// Build customer list from membership data with their memberships
const buildCustomersWithMemberships = () => {
  // Group memberships by customer
  const customerMap = new Map<string, Customer>();

  mockMemberships.forEach(membership => {
    if (!customerMap.has(membership.customerId)) {
      const customerData = mockCustomers.find(c => c.id === membership.customerId);
      // Create customer entry with first membership data
      customerMap.set(membership.customerId, {
        id: membership.customerId,
        membershipId: membership.uid,
        name: membership.customerName,
        email: membership.customerEmail,
        phone: membership.customerPhone,
        joinDate: membership.startDate,
        planName: membership.planName,
        planValue: membership.planAmount,
        totalPaid: membership.totalPaid,
        installmentsPaid: membership.installmentsPaid,
        totalInstallments: membership.totalInstallments,
        nextPaymentDate: membership.nextPaymentDate,
        status: membership.status === 'suspended' ? 'pending' : membership.status,
        startDate: membership.startDate,
        endDate: membership.endDate,
        country: customerData?.country,
        state: customerData?.state,
        city: customerData?.city,
        area: customerData?.area,
        payments: membership.paymentHistory.map(p => ({
          id: `${membership.id}-${p.installmentNumber}`,
          installmentNumber: p.installmentNumber,
          amount: p.amount,
          date: p.date,
          method: p.method,
          status: p.status,
        })),
      });
    }
  });

  return Array.from(customerMap.values());
};

const customers: Customer[] = buildCustomersWithMemberships();

export default function MembershipUsers() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | null>(null);
  const [isAddingMembership, setIsAddingMembership] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    planName: 'all',
  });

  const itemsPerPage = 9;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format date with time (DD/MM/YYYY HH:MM)
  const formatDateWithTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Format next payment info
  const formatNextPayment = (customer: Customer) => {
    // Use nextPaymentDate if available, otherwise use endDate for completed customers
    const paymentDate = customer.nextPaymentDate || customer.endDate;
    const date = new Date(paymentDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const paymentAmount = customer.planValue / customer.totalInstallments;
    return `${day}/${month}/${year} ₹${paymentAmount.toLocaleString('en-IN')}`;
  };

  // Get initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate progress percentage
  const calculateProgress = (paid: number, total: number) => {
    return Math.round((paid / total) * 100);
  };

  // Apply filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = searchQuery === '' ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.membershipId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || customer.status === filters.status;

      const matchesPlan = filters.planName === 'all' || customer.planName === filters.planName;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      planName: 'all',
    });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenActionMenuId(null);
  };

  const handleExport = () => {
    console.log('Export customer data');
    toast.success('Export feature coming soon');
  };

  const handleAddCustomer = () => {
    setIsAddingCustomer(true);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = (customerData: CustomerFormData) => {
    if (editingCustomer) {
      // Update existing customer - in real app, this would update the backend
      toast.success('Customer updated successfully');
      console.log('Update customer:', customerData);
    } else {
      // Add new customer - in real app, this would call the backend
      toast.success('Customer added successfully');
      console.log('Add new customer:', customerData);
    }
    setIsAddingCustomer(false);
    setEditingCustomer(null);
    setSelectedCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    // Convert customer to CustomerFormData format
    const customerFormData: CustomerFormData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      country: customer.country || '',
      state: customer.state || '',
      city: customer.city || '',
      area: customer.area || '',
    };
    setEditingCustomer(customerFormData);
    setIsAddingCustomer(true);
    setSelectedCustomer(null);
  };

  const handleAddMembership = () => {
    setIsAddingMembership(true);
  };

  const handleSaveMembership = (membershipData: any) => {
    // Add new membership - in real app, this would call the backend
    toast.success('Membership added successfully');
    console.log('Add new membership:', membershipData);
    setIsAddingMembership(false);
  };

  // Customer Action Menu Component
  const CustomerActionMenu = ({ customer }: { customer: Customer }) => (
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenActionMenuId(openActionMenuId === customer.id ? null : customer.id);
        }}
        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-white/90 dark:hover:bg-neutral-900/90 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {openActionMenuId === customer.id && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(customer);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      )}
    </div>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {paginatedCustomers.map((customer) => {
        const progressPercentage = calculateProgress(customer.installmentsPaid, customer.totalInstallments);

        return (
          <div
            key={customer.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative group"
          >
            <CustomerActionMenu customer={customer} />

            <div
              className="w-full h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 flex items-center justify-center cursor-pointer"
              onClick={() => handleView(customer)}
            >
              <div className="w-20 h-20 rounded-full bg-white dark:bg-neutral-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {getInitials(customer.name)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">UID: {customer.membershipId}</Badge>
                {customer.status === 'pending' ? (
                  <Badge variant="default" className="bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400 text-xs">Pending</Badge>
                ) : customer.status === 'completed' ? (
                  <Badge variant="default" className="bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 text-xs">Completed</Badge>
                ) : (
                  <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                )}
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                {customer.name}
              </h3>

              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-neutral-500 dark:text-neutral-500">Joined:</span>
                  <span className="font-medium text-neutral-900 dark:text-white text-right">
                    {formatDateWithTime(customer.joinDate)}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-neutral-500 dark:text-neutral-500">Next Payment:</span>
                  <span className="font-medium text-right text-primary-600 dark:text-primary-400">
                    {formatNextPayment(customer)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="p-6 space-y-3">
      {paginatedCustomers.map((customer) => {
        const progressPercentage = calculateProgress(customer.installmentsPaid, customer.totalInstallments);

        return (
          <div
            key={customer.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => handleView(customer)}
              >
                <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
                  {getInitials(customer.name)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">UID: {customer.membershipId}</Badge>
                      {customer.status === 'pending' ? (
                        <Badge variant="default" className="bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400 text-xs">Pending</Badge>
                      ) : customer.status === 'completed' ? (
                        <Badge variant="default" className="bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 text-xs">Completed</Badge>
                      ) : (
                        <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {customer.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {customer.phone}
                      </span>
                    </div>
                  </div>
                  <CustomerActionMenu customer={customer} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-500">Joined: </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatDateWithTime(customer.joinDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-500">Next Payment: </span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {formatNextPayment(customer)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              UID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Joined Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Next Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {paginatedCustomers.map((customer) => {
            const progressPercentage = calculateProgress(customer.installmentsPaid, customer.totalInstallments);

            return (
              <tr
                key={customer.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {customer.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Joined {formatDate(customer.joinDate)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-xs">UID: {customer.membershipId}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900 dark:text-white">
                    {formatDateWithTime(customer.joinDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {formatNextPayment(customer)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {customer.status === 'pending' ? (
                    <Badge variant="default" className="bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400 text-xs">Pending</Badge>
                  ) : customer.status === 'completed' ? (
                    <Badge variant="default" className="bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 text-xs">Completed</Badge>
                  ) : (
                    <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === customer.id ? null : customer.id);
                      }}
                      className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === customer.id && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(customer);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // If viewing customer detail, show CustomerDetail component
  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onEdit={handleEditCustomer}
      />
    );
  }

  // If adding/editing customer, show AddCustomer component
  if (isAddingCustomer) {
    return (
      <AddCustomer
        customer={editingCustomer}
        onBack={() => {
          setIsAddingCustomer(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
      />
    );
  }

  // If adding membership, show AddMembership component
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

    return (
      <AddMembership
        customers={customerList}
        plans={planList}
        onBack={() => setIsAddingMembership(false)}
        onSave={handleSaveMembership}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <ListHeader
          title="Customers"
          breadcrumbs={[
            { label: 'Customer Management' },
            { label: 'Customers' },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onAddNew={handleAddCustomer}
          addNewLabel="Add Customer"
          addNewIcon={Plus}
        />


      </div>

      {/* Filters */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      >
        <FilterField label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </FilterField>

        <FilterField label="Plan Name">
          <select
            value={filters.planName}
            onChange={(e) => setFilters({ ...filters, planName: e.target.value })}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Plans</option>
            <option value="Silver Basic">Silver Basic</option>
            <option value="Gold Savings Plan">Gold Savings Plan</option>
            <option value="Platinum Premium">Platinum Premium</option>
            <option value="Diamond Elite">Diamond Elite</option>
          </select>
        </FilterField>
      </FilterDrawer>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-950">
        {paginatedCustomers.length > 0 ? (
          <>
            {viewMode === 'grid' && <GridView />}
            {viewMode === 'list' && <ListView />}
            {viewMode === 'table' && <TableView />}
          </>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No customers found
            </p>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}