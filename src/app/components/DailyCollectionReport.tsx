import { useState, useMemo } from 'react';
import { Download, FileText } from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { Pagination } from './hb/common/Pagination';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Mock data for daily collections
const mockCollections = [
  {
    id: 'COL-001',
    time: '2026-04-07T10:30:00Z',
    membershipId: 'MEM-001',
    customerName: 'Priya Sharma',
    phone: '+91 9876543210',
    amount: 5000,
    paidInstallments: 1,
    totalInstallments: 12,
    pendingAmount: 55000,
    type: 'UPI',
    transactionId: 'UPI-123456789',
    status: 'paid',
  },
  {
    id: 'COL-002',
    time: '2026-04-07T11:15:00Z',
    membershipId: 'MEM-002',
    customerName: 'Rahul Patel',
    phone: '+91 9876543211',
    amount: 10000,
    paidInstallments: 3,
    totalInstallments: 10,
    pendingAmount: 70000,
    type: 'Cash',
    transactionId: 'CASH-9876',
    status: 'paid',
  },
  {
    id: 'COL-003',
    time: '2026-04-07T14:45:00Z',
    membershipId: 'MEM-003',
    customerName: 'Anita Desai',
    phone: '+91 9876543212',
    amount: 8000,
    paidInstallments: 2,
    totalInstallments: 8,
    pendingAmount: 48000,
    type: 'Cheque',
    transactionId: 'CHQ-554433',
    status: 'pending',
  },
];

export default function DailyCollectionReport() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return mockCollections.filter((col) => {
      const query = searchQuery.toLowerCase();
      return (
        searchQuery === '' ||
        col.customerName.toLowerCase().includes(query) ||
        col.membershipId.toLowerCase().includes(query) ||
        col.phone.includes(query)
      );
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <ListHeader
          title="Daily Collection Report"
          breadcrumbs={[
            { label: 'Reports' },
            { label: 'Daily Collection Report' },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="px-6 pb-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 p-6">
        {paginatedData.length > 0 ? (
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Membership ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Installment #</th>
                  <th className="px-6 py-3 font-medium">Pending Amt</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Transaction ID</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((col) => (
                  <tr key={col.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">{formatTime(col.time)}</td>
                    <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{col.membershipId}</td>
                    <td className="px-6 py-4">{col.customerName}</td>
                    <td className="px-6 py-4 text-neutral-500">{col.phone}</td>
                    <td className="px-6 py-4 font-semibold">₹{col.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">{col.paidInstallments}/{col.totalInstallments}</td>
                    <td className="px-6 py-4 text-orange-600">₹{col.pendingAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">{col.type}</td>
                    <td className="px-6 py-4 font-mono text-xs">{col.transactionId}</td>
                    <td className="px-6 py-4">
                      {col.status === 'paid' && <Badge className="bg-success-50 text-success-700 hover:bg-success-50">Paid</Badge>}
                      {col.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                      {col.status === 'failed' && <Badge variant="destructive">Failed</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500">No collections found matching your criteria.</p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
