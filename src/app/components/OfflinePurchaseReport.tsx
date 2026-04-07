import { useState, useMemo } from 'react';
import { Download, FileText, Eye } from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { FormModal } from './hb/common/Form';

// Mock data for offline purchases
const mockPurchases = [
  {
    id: 'PUR-001',
    date: '2026-04-07T10:30:00Z',
    invoiceId: 'INV-2026-001',
    membershipId: 'MEM-001',
    customerName: 'Priya Sharma',
    itemsCount: 2,
    membershipAmount: 200000,
    amount: 150000,
    items: [
      { name: 'Gold Necklace', sku: 'GN-101', quantity: 1, price: 100000 },
      { name: 'Gold Earrings', sku: 'GE-202', quantity: 1, price: 50000 }
    ]
  },
  {
    id: 'PUR-002',
    date: '2026-04-06T14:20:00Z',
    invoiceId: 'INV-2026-002',
    membershipId: 'MEM-002',
    customerName: 'Rahul Patel',
    itemsCount: 1,
    membershipAmount: 120000,
    amount: 75000,
    items: [
      { name: 'Diamond Ring', sku: 'DR-303', quantity: 1, price: 75000 }
    ]
  },
  {
    id: 'PUR-003',
    date: '2026-04-05T11:45:00Z',
    invoiceId: 'INV-2026-003',
    membershipId: 'MEM-003',
    customerName: 'Anita Desai',
    itemsCount: 3,
    membershipAmount: 300000,
    amount: 210000,
    items: [
      { name: 'Gold Bangle', sku: 'GB-404', quantity: 2, price: 80000 },
      { name: 'Silver Coin', sku: 'SC-505', quantity: 1, price: 50000 }
    ]
  },
];

export default function OfflinePurchaseReport() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedPurchase, setSelectedPurchase] = useState<typeof mockPurchases[0] | null>(null);

  const filteredData = useMemo(() => {
    return mockPurchases.filter((pur) => {
      const query = searchQuery.toLowerCase();
      return (
        searchQuery === '' ||
        pur.customerName.toLowerCase().includes(query) ||
        pur.membershipId.toLowerCase().includes(query) ||
        pur.invoiceId.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

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
          title="Offline Purchase Report"
          breadcrumbs={[
            { label: 'Reports' },
            { label: 'Offline Purchase Report' },
          ]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
          onToggleFilters={() => {}}
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
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Invoice ID</th>
                  <th className="px-6 py-3 font-medium">Membership ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium text-center">Number of Items</th>
                  <th className="px-6 py-3 font-medium">Membership Amount</th>
                  <th className="px-6 py-3 font-medium">Invoice Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((pur) => (
                  <tr key={pur.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(pur.date)}</td>
                    <td className="px-6 py-4 font-mono text-xs">{pur.invoiceId}</td>
                    <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{pur.membershipId}</td>
                    <td className="px-6 py-4">{pur.customerName}</td>
                    <td className="px-6 py-4 text-center">{pur.itemsCount}</td>
                    <td className="px-6 py-4 font-medium text-neutral-500">₹{pur.membershipAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₹{pur.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPurchase(pur)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
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
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500">No offline purchases found matching your criteria.</p>
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

      {/* View Details Modal */}
      {selectedPurchase && (
        <FormModal
          title="Purchase Details"
          description={`Invoice: ${selectedPurchase.invoiceId}`}
          isOpen={!!selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex justify-end">
              <Button onClick={() => setSelectedPurchase(null)}>Close</Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="text-xs text-neutral-500">Date</p>
                <p className="text-sm font-medium mt-1">{formatDateTime(selectedPurchase.date)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Customer</p>
                <p className="text-sm font-medium mt-1">{selectedPurchase.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Membership</p>
                <p className="text-sm font-medium mt-1">{selectedPurchase.membershipId}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Total Amount</p>
                <p className="text-sm font-semibold mt-1">₹{selectedPurchase.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Itemized List</h4>
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="px-4 py-2 font-medium">SKU</th>
                      <th className="px-4 py-2 font-medium">Item Name</th>
                      <th className="px-4 py-2 font-medium text-center">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">Price</th>
                      <th className="px-4 py-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {selectedPurchase.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50 dark:bg-neutral-800 font-semibold border-t border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right">Total:</td>
                      <td className="px-4 py-3 text-right">₹{selectedPurchase.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
