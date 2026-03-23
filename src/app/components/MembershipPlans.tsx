/**
 * MEMBERSHIP PLANS MANAGEMENT
 * Screen ID: AD-PLAN-LIST-01
 * 
 * Create and manage membership plans with pricing, installments, and benefits
 * Based on /Modules/Membership_Plans_Management.md specifications
 */

import { useState, useMemo } from 'react';
import {
  Crown,
  Plus,
  Edit2,
  MoreVertical,
  Power,
  PowerOff,
  Check,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterPanel, FilterField } from './hb/common/FilterPanel';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

// Plan interface
interface Plan {
  id: string;
  uid: string;
  name: string;
  description: string;
  totalAmount: number;
  installments: number;
  planColor: 'bronze' | 'gold' | 'platinum' | 'diamond';
  benefits: string[];
  subscribers: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock plan data
const mockPlans: Plan[] = [
  {
    id: '1',
    uid: 'PLAN-001',
    name: 'Gold Savings Plan',
    description: 'Most popular plan with excellent value',
    totalAmount: 60000,
    installments: 12,
    planColor: 'gold',
    benefits: [
      '10% discount on jewelry purchases',
      'Priority access to exclusive collections',
      'Free jewelry cleaning twice a year',
    ],
    subscribers: 328,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    uid: 'PLAN-002',
    name: 'Silver Basic',
    description: 'Perfect entry-level plan for new members',
    totalAmount: 36000,
    installments: 12,
    planColor: 'bronze',
    benefits: [
      '5% discount on all jewelry purchases',
      'Early access to new collections',
      'Free annual jewelry cleaning',
    ],
    subscribers: 142,
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    uid: 'PLAN-003',
    name: 'Platinum Premium',
    description: 'Premium plan with maximum benefits',
    totalAmount: 120000,
    installments: 12,
    planColor: 'platinum',
    benefits: [
      '15% discount on jewelry purchases',
      'VIP access to exclusive events',
      'Free jewelry cleaning quarterly',
    ],
    subscribers: 85,
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    uid: 'PLAN-004',
    name: 'Diamond Elite',
    description: 'Ultimate luxury plan for elite customers',
    totalAmount: 240000,
    installments: 12,
    planColor: 'diamond',
    benefits: [
      '20% discount on all purchases',
      'Personal jewelry consultant',
      'Unlimited free cleaning & maintenance',
    ],
    subscribers: 43,
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    uid: 'PLAN-005',
    name: 'Bronze Starter',
    description: 'Affordable starter plan',
    totalAmount: 24000,
    installments: 12,
    planColor: 'bronze',
    benefits: [
      '3% discount on purchases',
      'Free annual jewelry inspection',
      'Birthday greeting card',
    ],
    subscribers: 152,
    status: 'inactive',
    createdAt: '2024-02-15',
  },
  {
    id: '6',
    uid: 'PLAN-006',
    name: 'Gold Plus',
    description: 'Enhanced gold plan with additional perks',
    totalAmount: 72000,
    installments: 12,
    planColor: 'gold',
    benefits: [
      '12% discount on jewelry purchases',
      'VIP event invitations',
      'Quarterly jewelry cleaning',
    ],
    subscribers: 95,
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '7',
    uid: 'PLAN-007',
    name: 'Platinum Ultra',
    description: 'Ultra premium platinum experience',
    totalAmount: 150000,
    installments: 12,
    planColor: 'platinum',
    benefits: [
      '18% discount on all purchases',
      'Personal shopping assistant',
      'Monthly jewelry maintenance',
    ],
    subscribers: 67,
    status: 'active',
    createdAt: '2024-03-01',
  },
  {
    id: '8',
    uid: 'PLAN-008',
    name: 'Diamond Supreme',
    description: 'Supreme luxury membership',
    totalAmount: 300000,
    installments: 12,
    planColor: 'diamond',
    benefits: [
      '25% discount on all purchases',
      'Dedicated concierge service',
      'Lifetime warranty coverage',
    ],
    subscribers: 28,
    status: 'active',
    createdAt: '2024-03-05',
  },
  {
    id: '9',
    uid: 'PLAN-009',
    name: 'Bronze Lite',
    description: 'Budget-friendly membership option',
    totalAmount: 18000,
    installments: 12,
    planColor: 'bronze',
    benefits: [
      '2% discount on purchases',
      'Newsletter subscription',
      'Birthday wishes',
    ],
    subscribers: 203,
    status: 'active',
    createdAt: '2024-03-10',
  },
];

// Plan color configurations
const planColorConfig = {
  bronze: {
    label: 'Bronze',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  gold: {
    label: 'Gold',
    badgeClass: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  platinum: {
    label: 'Platinum',
    badgeClass: 'bg-slate-50 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400 border-slate-200 dark:border-slate-800',
  },
  diamond: {
    label: 'Diamond',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
};

export default function MembershipPlans() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    planType: 'all',
  });

  const itemsPerPage = 9;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Calculate monthly payment
  const calculateMonthly = (total: number, installments: number) => {
    return Math.round(total / installments);
  };

  // Apply filters
  const filteredPlans = useMemo(() => {
    return mockPlans.filter(plan => {
      const matchesSearch = searchQuery === '' ||
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.uid.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || plan.status === filters.status;
      
      const matchesPlanType = filters.planType === 'all' || plan.planColor === filters.planType;

      return matchesSearch && matchesStatus && matchesPlanType;
    });
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      planType: 'all',
    });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleEdit = (plan: Plan) => {
    console.log('Edit plan:', plan.id);
    toast.success('Plan edit feature coming soon');
    setOpenActionMenuId(null);
  };

  const handleToggleStatus = (plan: Plan) => {
    const newStatus = plan.status === 'active' ? 'inactive' : 'active';
    console.log(`Toggle status for ${plan.name} to ${newStatus}`);
    toast.success(`Plan marked as ${newStatus}`);
    setOpenActionMenuId(null);
  };

  // Plan Action Menu Component
  const PlanActionMenu = ({ plan }: { plan: Plan }) => (
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenActionMenuId(openActionMenuId === plan.id ? null : plan.id);
        }}
        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-white/90 dark:hover:bg-neutral-900/90 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {openActionMenuId === plan.id && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(plan);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Plan
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(plan);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
          >
            {plan.status === 'active' ? (
              <>
                <PowerOff className="w-4 h-4" />
                Mark as Inactive
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Mark as Active
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {paginatedPlans.map((plan) => {
        const colorConfig = planColorConfig[plan.planColor];
        const monthlyPayment = calculateMonthly(plan.totalAmount, plan.installments);

        return (
          <div
            key={plan.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative group"
          >
            <PlanActionMenu plan={plan} />
            
            <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 flex items-center justify-center cursor-pointer"
              onClick={() => handleEdit(plan)}
            >
              <Crown className="w-16 h-16 text-primary-400 dark:text-primary-600" />
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">UID: {plan.uid}</Badge>
                {plan.status === 'inactive' ? (
                  <Badge variant="destructive" className="text-xs">Inactive</Badge>
                ) : (
                  <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                )}
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                {plan.name}
              </h3>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                {plan.description}
              </p>

              <div className="mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(plan.totalAmount)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {plan.installments} installments × {formatCurrency(monthlyPayment)}/mo
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span>Subscribers</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{plan.subscribers}</span>
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
      {paginatedPlans.map((plan) => {
        const colorConfig = planColorConfig[plan.planColor];
        const monthlyPayment = calculateMonthly(plan.totalAmount, plan.installments);

        return (
          <div
            key={plan.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative"
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer flex items-center justify-center"
                onClick={() => handleEdit(plan)}
              >
                <Crown className="w-12 h-12 text-primary-400 dark:text-primary-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">UID: {plan.uid}</Badge>
                      {plan.status === 'inactive' ? (
                        <Badge variant="destructive" className="text-xs">Inactive</Badge>
                      ) : (
                        <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>
                  <PlanActionMenu plan={plan} />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">Total: </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(plan.totalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">Monthly: </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-600 dark:text-neutral-400">Subscribers: </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{plan.subscribers}</span>
                    </div>
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
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              UID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Pricing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Subscribers
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
          {paginatedPlans.map((plan) => {
            const colorConfig = planColorConfig[plan.planColor];
            const monthlyPayment = calculateMonthly(plan.totalAmount, plan.installments);

            return (
              <tr 
                key={plan.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-primary-400 dark:text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {plan.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {plan.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-xs">UID: {plan.uid}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`text-xs border ${colorConfig.badgeClass}`}>
                    {colorConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(plan.totalAmount)}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {plan.installments} × {formatCurrency(monthlyPayment)}/mo
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-900 dark:text-white font-semibold">
                  {plan.subscribers}
                </td>
                <td className="px-6 py-4">
                  {plan.status === 'inactive' ? (
                    <Badge variant="destructive" className="text-xs">Inactive</Badge>
                  ) : (
                    <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === plan.id ? null : plan.id);
                      }}
                      className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === plan.id && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(plan);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Plan
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(plan);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                        >
                          {plan.status === 'active' ? (
                            <>
                              <PowerOff className="w-4 h-4" />
                              Mark as Inactive
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4" />
                              Mark as Active
                            </>
                          )}
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <ListHeader
        title="Plans"
        breadcrumbs={[
          { label: 'Plans Management' },
          { label: 'Plans' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAddNew={() => toast.success('Add new plan feature coming soon')}
        addNewLabel="Add New"
      />

      {/* Filters */}
      <FilterPanel
        isOpen={showFilters}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FilterField label="Status">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FilterField>

          <FilterField label="Plan Type">
            <select
              value={filters.planType}
              onChange={(e) => setFilters({ ...filters, planType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="bronze">Bronze</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
            </select>
          </FilterField>
        </div>
      </FilterPanel>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-950">
        {paginatedPlans.length > 0 ? (
          <>
            {viewMode === 'grid' && <GridView />}
            {viewMode === 'list' && <ListView />}
            {viewMode === 'table' && <TableView />}
          </>
        ) : (
          <div className="p-12 text-center">
            <Crown className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No plans found
            </p>
            <Button onClick={() => toast.success('Add new plan feature coming soon')}>
              <Plus className="w-4 h-4" />
              Add Plan
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredPlans.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlans.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}