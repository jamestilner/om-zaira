import { useState, useMemo } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Mock data for transactions
const mockTransactions = [
  {
    id: 'TXN-001',
    date: '2026-04-07T10:30:00Z',
    membershipId: 'MEM-001',
    customerName: 'Priya Sharma',
    phone: '+91 9876543210',
    amount: 5000,
    installmentNum: 1,
    type: 'UPI',
    transactionId: 'UPI-123456789',
    status: 'paid',
  },
  {
    id: 'TXN-002',
    date: '2026-04-07T11:15:00Z',
    membershipId: 'MEM-002',
    customerName: 'Rahul Patel',
    phone: '+91 9876543211',
    amount: 10000,
    installmentNum: 3,
    type: 'Cash',
    transactionId: 'CASH-9876',
    status: 'paid',
  },
  {
    id: 'TXN-003',
    date: '2026-04-06T15:45:00Z',
    membershipId: 'MEM-003',
    customerName: 'Anita Desai',
    phone: '+91 9876543212',
    amount: 8000,
    installmentNum: 2,
    type: 'Cheque',
    transactionId: 'CHQ-554433',
    status: 'pending',
  },
  {
    id: 'TXN-004',
    date: '2026-04-06T09:20:00Z',
    membershipId: 'MEM-004',
    customerName: 'Vikram Singh',
    phone: '+91 9876543213',
    amount: 15000,
    installmentNum: 1,
    type: 'Card',
    transactionId: 'CARD-112233',
    status: 'failed',
  },
  {
    id: 'TXN-005',
    date: '2026-04-05T14:10:00Z',
    membershipId: 'MEM-001',
    customerName: 'Priya Sharma',
    phone: '+91 9876543210',
    amount: 5000,
    installmentNum: 2,
    type: 'UPI',
    transactionId: 'UPI-987654321',
    status: 'paid',
  },
];

export default function TransactionReport() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
  });

  const filteredData = useMemo(() => {
    return mockTransactions.filter((txn) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        txn.customerName.toLowerCase().includes(query) ||
        txn.phone.includes(query) ||
        txn.transactionId.toLowerCase().includes(query);

      const matchesType = filters.type === 'all' || txn.type === filters.type;
      const matchesStatus = filters.status === 'all' || txn.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <ListHeader
          title="Transaction Report"
          breadcrumbs={[
            { label: 'Reports' },
            { label: 'Transaction Report' },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        
        <div className="px-6 pb-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onReset={() => setFilters({ type: 'all', status: 'all' })}
        onApply={() => { setCurrentPage(1); setShowFilters(false); }}
      >
        <FilterField label="Transaction Type">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
            <option value="Gift Card">Gift Card</option>
          </select>
        </FilterField>
        <FilterField label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </FilterField>
      </FilterDrawer>

      <div className="bg-white dark:bg-neutral-950 p-6">
        {paginatedData.length > 0 ? (
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Membership ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Inst #</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Transaction ID</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((txn) => (
                  <tr key={txn.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(txn.date)}</td>
                    <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{txn.membershipId}</td>
                    <td className="px-6 py-4">{txn.customerName}</td>
                    <td className="px-6 py-4 text-neutral-500">{txn.phone}</td>
                    <td className="px-6 py-4 font-semibold">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">{txn.installmentNum}</td>
                    <td className="px-6 py-4">{txn.type}</td>
                    <td className="px-6 py-4 font-mono text-xs">{txn.transactionId}</td>
                    <td className="px-6 py-4">
                      {txn.status === 'paid' && <Badge className="bg-success-50 text-success-700 hover:bg-success-50">Paid</Badge>}
                      {txn.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                      {txn.status === 'failed' && <Badge variant="destructive">Failed</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500">No transactions found matching your criteria.</p>
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
