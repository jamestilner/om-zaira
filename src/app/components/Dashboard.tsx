/**
 * ADMIN DASHBOARD
 * Screen ID: AD-DASH-01
 * 
 * Overview dashboard with KPI metrics and recent activity
 * Based on /Modules/Dashboard.md specifications
 */

import { 
  Users, 
  CreditCard, 
  Clock, 
  Package, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  IndianRupee,
} from 'lucide-react';
import { PageHeader } from './hb/listing';
import { StatCard } from './hb/common/StatCard';
import { Badge } from './ui/badge';
import { mockMemberships, mockCustomers } from '../data/membershipData';

// Mock data for KPI metrics
const kpiMetrics = [
  {
    label: 'Total Users',
    value: '1,247',
    icon: Users,
    trend: {
      value: '+12.5% from last month',
      positive: true,
    },
  },
  {
    label: 'Active Memberships',
    value: '894',
    icon: CreditCard,
    trend: {
      value: '+8.2% from last month',
      positive: true,
    },
  },
  {
    label: 'Pending Payments',
    value: '₹2.4L',
    icon: Clock,
    trend: {
      value: '-5.3% from last month',
      positive: true,
    },
  },
  {
    label: 'Active Products',
    value: '156',
    icon: Package,
    trend: {
      value: '+3.1% from last month',
      positive: true,
    },
  },
  {
    label: 'Upcoming Events',
    value: '8',
    icon: Calendar,
    trend: {
      value: '+2 from last week',
      positive: true,
    },
  },
];

// Activity types and their corresponding badge styles
type ActivityType = 'Payment' | 'Purchase' | 'Registration' | 'Event';
type ActivityStatus = 'Success' | 'Failed' | 'Info';

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  amount?: string;
  time: string;
  status: ActivityStatus;
}

// Mock data for recent activities
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'Payment',
    description: 'Priya Sharma paid installment for Gold Savings Plan',
    amount: '₹5,000',
    time: '2 mins ago',
    status: 'Success',
  },
  {
    id: '2',
    type: 'Purchase',
    description: 'Rajesh Kumar purchased Diamond Necklace Set',
    amount: '₹45,000',
    time: '15 mins ago',
    status: 'Success',
  },
  {
    id: '3',
    type: 'Registration',
    description: 'New customer registered - Anjali Patel',
    amount: '-',
    time: '1 hour ago',
    status: 'Info',
  },
  {
    id: '4',
    type: 'Event',
    description: 'New event created - New Year Collection Launch',
    amount: '-',
    time: '2 hours ago',
    status: 'Info',
  },
  {
    id: '5',
    type: 'Payment',
    description: 'Vikram Singh payment failed for Platinum Plan',
    amount: '₹8,000',
    time: '3 hours ago',
    status: 'Failed',
  },
  {
    id: '6',
    type: 'Purchase',
    description: 'Meera Desai purchased Gold Bangles Set',
    amount: '₹32,500',
    time: '4 hours ago',
    status: 'Success',
  },
  {
    id: '7',
    type: 'Registration',
    description: 'New customer registered - Suresh Malhotra',
    amount: '-',
    time: '5 hours ago',
    status: 'Info',
  },
  {
    id: '8',
    type: 'Payment',
    description: 'Kavita Reddy paid installment for Silver Savings Plan',
    amount: '₹3,500',
    time: '6 hours ago',
    status: 'Success',
  },
];

// Helper function to get badge variant based on activity type
const getTypeBadgeVariant = (type: ActivityType): string => {
  const variants: Record<ActivityType, string> = {
    Payment: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    Purchase: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    Registration: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
    Event: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  };
  return variants[type];
};

// Helper function to get badge variant based on status
const getStatusBadgeVariant = (status: ActivityStatus): string => {
  const variants: Record<ActivityStatus, string> = {
    Success: 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400',
    Failed: 'bg-error-50 text-error-700 dark:bg-error-950/50 dark:text-error-400',
    Info: 'bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400',
  };
  return variants[status];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateStr));
};

const getDaysLeft = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(today.getFullYear(), month - 1, day);
  
  if (target.getTime() < today.getTime()) {
    target.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const statusPriority: Record<string, number> = { paid: 0, pending: 1, failed: 2 };

const allPaymentsData = mockMemberships
  .flatMap(m => 
    m.paymentHistory.map(p => ({
      id: `${m.id}-${p.installmentNumber}`,
      customerName: m.customerName,
      planName: m.planName,
      amount: p.amount,
      date: p.date,
      status: p.status
    }))
  )
  .sort((a, b) => {
    // Primary sort: status priority (paid → pending → failed)
    const statusDiff = (statusPriority[a.status] ?? 3) - (statusPriority[b.status] ?? 3);
    if (statusDiff !== 0) return statusDiff;
    // Secondary sort: newest date first within each status group
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

const recentPaymentsData = allPaymentsData.filter(p => p.status === 'paid').slice(0, 8);

// Summary stats
const paidPayments = allPaymentsData.filter(p => p.status === 'paid');
const pendingPayments = allPaymentsData.filter(p => p.status === 'pending');
const failedPayments = allPaymentsData.filter(p => p.status === 'failed');
const totalCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0);
const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);



const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400';
    case 'pending':
      return 'bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400';
    case 'failed':
      return 'bg-error-50 text-error-700 dark:bg-error-950/50 dark:text-error-400';
    default:
      return 'bg-neutral-50 text-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-400';
  }
};

export default function Dashboard() {
  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Dashboard
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Welcome back, Admin
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            {/* Admin Info */}
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Admin User
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                admin@omzaira.com
              </p>
            </div>
            {/* Admin Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                AU
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpiMetrics.map((metric, index) => (
          <StatCard
            key={index}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Received Payments - Full Width */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Received Payments</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{recentPaymentsData.length} payment records</p>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-neutral-50/50 dark:bg-neutral-900/20">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Plan/Product</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {recentPaymentsData.map((payment) => (
                <tr key={payment.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{payment.customerName}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{payment.planName}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(payment.date)}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentStatusBadge(payment.status)}`}>
                      {payment.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {payment.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentPaymentsData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Recent Activity Panel */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Latest transactions and updates
          </p>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recentActivities.map((activity) => (
                <tr 
                  key={activity.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeVariant(activity.type)}`}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {activity.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {activity.time}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeVariant(activity.status)}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State (hidden when there's data) */}
        {recentActivities.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              No recent activity yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}