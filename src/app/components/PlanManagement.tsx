/**
 * PLAN MANAGEMENT
 * Screen ID: AD-PLAN-LIST-01
 * 
 * Plan management with grid/list/table views
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
  Eye,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import PlanDetail from './PlanDetail';
import AddPlan from './AddPlan';
import { toast } from 'sonner';

// Plan interface
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

interface PlanManagementProps {
  onNavigate?: (page: string) => void;
}

// Mock plan data
const mockPlans: Plan[] = [
  {
    id: '1',
    uid: 'PLN-001',
    title: 'Gold Savings Plan',
    description: 'Most popular plan with excellent value for regular savings',
    amount: 60000,
    installments: 12,
    amountPerInstallment: 5000,
    complementaryInstallments: 0,
    status: 'active',
    createdAt: '2024-01-15',
    subscribers: 328,
  },
  {
    id: '2',
    uid: 'PLN-002',
    title: 'Silver Basic Plan',
    description: 'Perfect entry-level plan for new members',
    amount: 36000,
    installments: 12,
    amountPerInstallment: 3000,
    complementaryInstallments: 0,
    status: 'active',
    createdAt: '2024-01-20',
    subscribers: 142,
  },
  {
    id: '3',
    uid: 'PLN-003',
    title: 'Platinum Premium Plan',
    description: 'Premium plan with exclusive benefits and higher returns',
    amount: 120000,
    installments: 12,
    amountPerInstallment: 10000,
    complementaryInstallments: 0,
    status: 'active',
    createdAt: '2024-02-01',
    subscribers: 89,
  },
  {
    id: '4',
    uid: 'PLN-004',
    title: 'Diamond Elite Plan',
    description: 'Elite plan for high-value customers with maximum benefits',
    amount: 240000,
    installments: 12,
    amountPerInstallment: 20000,
    complementaryInstallments: 0,
    status: 'active',
    createdAt: '2024-02-10',
    subscribers: 45,
  },
  {
    id: '5',
    uid: 'PLN-005',
    title: 'Bronze Starter Plan',
    description: 'Entry-level plan for first-time savers',
    amount: 24000,
    installments: 12,
    amountPerInstallment: 2000,
    complementaryInstallments: 0,
    status: 'inactive',
    createdAt: '2024-01-05',
    subscribers: 67,
  },
];

export default function PlanManagement({ onNavigate }: PlanManagementProps) {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlanType, setSelectedPlanType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedDuration, setSelectedDuration] = useState('all');

  const itemsPerPage = viewMode === 'table' ? 10 : viewMode === 'list' ? 8 : 12;

  // Filter and search
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || plan.status === selectedStatus;

      // Price range filter
      const matchesPrice = 
        (!priceRange.min || plan.amount >= parseFloat(priceRange.min)) &&
        (!priceRange.max || plan.amount <= parseFloat(priceRange.max));

      // Duration filter
      const matchesDuration =
        selectedDuration === 'all' || 
        (selectedDuration === '6' && plan.installments === 6) ||
        (selectedDuration === '12' && plan.installments === 12) ||
        (selectedDuration === '24' && plan.installments === 24);

      return matchesSearch && matchesStatus && matchesPrice && matchesDuration;
    });
  }, [plans, searchQuery, selectedStatus, priceRange, selectedDuration]);

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: plans.length,
      active: plans.filter((p) => p.status === 'active').length,
      subscribers: plans.reduce((sum, p) => sum + (p.subscribers || 0), 0),
    };
  }, [plans]);

  const handleToggleStatus = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: plan.status === 'active' ? 'inactive' : 'active',
            }
          : plan
      )
    );
    toast.success('Plan status updated successfully');
  };

  const handleSavePlan = (planData: any) => {
    const api = parseFloat(planData.amountPerInstallment);
    const inst = parseInt(planData.installments);
    const cInst = parseInt(planData.complementaryInstallments) || 0;
    
    const newPlan: Plan = {
      id: (plans.length + 1).toString(),
      uid: `PLN-${String(plans.length + 1).padStart(3, '0')}`,
      title: planData.title,
      description: planData.description,
      amount: api * (inst + cInst),
      installments: inst,
      amountPerInstallment: api,
      complementaryInstallments: cInst,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      subscribers: 0,
    };

    setPlans((prev) => [...prev, newPlan]);
    setIsAddingPlan(false);
    toast.success('Plan created successfully');
  };

  const handleUpdatePlan = (planId: string, planData: any) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const api = parseFloat(planData.amountPerInstallment);
          const inst = parseInt(planData.installments);
          const cInst = parseInt(planData.complementaryInstallments) || 0;
          return {
            ...plan,
            title: planData.title,
            description: planData.description,
            amount: api * (inst + cInst),
            installments: inst,
            amountPerInstallment: api,
            complementaryInstallments: cInst,
          };
        }
        return plan;
      }
      )
    );
    setSelectedPlan(null);
    toast.success('Plan updated successfully');
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedPlanType('all');
    setPriceRange({ min: '', max: '' });
    setSelectedDuration('all');
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  // Show detail view
  if (selectedPlan) {
    return (
      <PlanDetail
        plan={selectedPlan}
        onBack={() => setSelectedPlan(null)}
        onSave={handleUpdatePlan}
        onNavigateToMemberships={() => onNavigate && onNavigate('memberships')}
      />
    );
  }

  // Show add view
  if (isAddingPlan) {
    return (
      <AddPlan
        onBack={() => setIsAddingPlan(false)}
        onSave={handleSavePlan}
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
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Plans</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Plans</p>
              <p className="text-3xl mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Power className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Subscribers</p>
              <p className="text-3xl mt-1">{stats.subscribers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* List Header */}
      <ListHeader
        title="Plan Management"
        breadcrumbs={[
          { label: 'Plan Management' },
          { label: 'Plans' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAddNew={() => setIsAddingPlan(true)}
        addNewLabel="Add New Plan"
      />

      {/* Filter Drawer */}
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

        <FilterField label="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-neutral-500 dark:text-neutral-400">to</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </FilterField>

        <FilterField label="Duration">
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Durations</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
          </select>
        </FilterField>
      </FilterDrawer>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                    {plan.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{plan.uid}</p>
                  <h3 className="mt-1">{plan.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount</span>
                    <span className="font-medium">₹{plan.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Installments</span>
                    <span className="font-medium">{plan.installments} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Per Month</span>
                    <span className="font-medium">₹{plan.amountPerInstallment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Subscribers</span>
                    <span className="font-medium">{plan.subscribers || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(plan.id)}
                  >
                    {plan.status === 'active' ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {paginatedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate">{plan.title}</h3>
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{plan.uid}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-center gap-8 text-sm">
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Total Amount</p>
                    <p className="font-medium mt-1">₹{plan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Installments</p>
                    <p className="font-medium mt-1">{plan.installments} months</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Per Month</p>
                    <p className="font-medium mt-1">₹{plan.amountPerInstallment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Subscribers</p>
                    <p className="font-medium mt-1">{plan.subscribers || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(plan.id)}
                  >
                    {plan.status === 'active' ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left px-6 py-3 text-sm">Plan ID</th>
                  <th className="text-left px-6 py-3 text-sm">Plan Name</th>
                  <th className="text-left px-6 py-3 text-sm">Description</th>
                  <th className="text-left px-6 py-3 text-sm">Total Amount</th>
                  <th className="text-left px-6 py-3 text-sm">Installments</th>
                  <th className="text-left px-6 py-3 text-sm">Per Month</th>
                  <th className="text-left px-6 py-3 text-sm">Subscribers</th>
                  <th className="text-left px-6 py-3 text-sm">Status</th>
                  <th className="text-left px-6 py-3 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm">{plan.uid}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{plan.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 max-w-xs">
                        {plan.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">₹{plan.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{plan.installments} months</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">₹{plan.amountPerInstallment.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{plan.subscribers || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(plan.id)}
                        >
                          {plan.status === 'active' ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <Crown className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">No plans found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsAddingPlan(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Plan
          </Button>
        </div>
      )}
    </div>
  );
}