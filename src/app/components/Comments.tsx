/**
 * COMMENTS (CALL LOGS) MODULE
 * 
 * Admin page for viewing and managing customer call logs
 */

import { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Eye,
  X,
  User,
  FileText,
  Edit2,
  Users
} from 'lucide-react';
import { mockCallLogs, CallLogItem, CallLogStatus } from '../data/callLogsData';
import {
  FormModal,
  FormLabel,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormGrid,
  FormSection,
} from './hb/common/Form';
import { FilterDrawer } from './hb/common/FilterDrawer';

const ITEMS_PER_PAGE = 10;

const statusFilters: { label: string; value: CallLogStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Connected', value: 'Connected' },
  { label: 'Not Connected', value: 'Not Connected' },
  { label: 'Follow-up', value: 'Follow-up' },
];

const getStatusBadge = (status: CallLogStatus) => {
  switch (status) {
    case 'Connected':
      return {
        className: 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400',
        icon: CheckCircle2,
      };
    case 'Not Connected':
      return {
        className: 'bg-error-50 text-error-700 dark:bg-error-950/50 dark:text-error-400',
        icon: XCircle,
      };
    case 'Follow-up':
      return {
        className: 'bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-400',
        icon: Clock,
      };
  }
};

const formatCallDate = (datetime: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(datetime));
};

const formatCallTime = (datetime: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(datetime));
};

const emptyForm = {
  customerName: '',
  phone: '',
  groupName: '',
  groupCode: '',
  date: '',
  time: '',
  agentName: '',
  notes: '',
  status: 'Connected' as CallLogStatus,
};

export default function Comments() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer Filter States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CallLogStatus | 'All'>('All');
  const [customerFilter, setCustomerFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  
  // Active Filter States (applied after clicking "Apply")
  const [activeStatusFilter, setActiveStatusFilter] = useState<CallLogStatus | 'All'>('All');
  const [activeCustomerFilter, setActiveCustomerFilter] = useState('');
  const [activeAgentFilter, setActiveAgentFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(mockCallLogs);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLog, setViewingLog] = useState<CallLogItem | null>(null);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derive unique customers for autocomplete
  const uniqueCustomers = useMemo(() => {
    const map = new Map<string, {name: string, phone: string, groupName: string, groupCode: string}>();
    callLogs.forEach(log => {
      if (!map.has(log.customerName)) {
        map.set(log.customerName, {
          name: log.customerName,
          phone: log.phone,
          groupName: log.groupName,
          groupCode: log.groupCode
        });
      }
    });
    return Array.from(map.values());
  }, [callLogs]);

  // Derive unique agents for filter
  const uniqueAgents = useMemo(() => Array.from(new Set(callLogs.map(l => l.agentName))), [callLogs]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...callLogs];

    // Search query filter (applies to name, phone, notes)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (log) =>
          log.customerName.toLowerCase().includes(query) ||
          log.phone.replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
          log.notes.toLowerCase().includes(query)
      );
    }

    // Advanced Drawer Filters
    if (activeStatusFilter !== 'All') {
      data = data.filter((log) => log.status === activeStatusFilter);
    }
    if (activeCustomerFilter) {
      data = data.filter((log) => log.customerName === activeCustomerFilter);
    }
    if (activeAgentFilter) {
      data = data.filter((log) => log.agentName === activeAgentFilter);
    }

    // Sort by datetime desc
    data.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

    return data;
  }, [searchQuery, activeStatusFilter, activeCustomerFilter, activeAgentFilter, callLogs]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setActiveStatusFilter(statusFilter);
    setActiveCustomerFilter(customerFilter);
    setActiveAgentFilter(agentFilter);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setCustomerFilter('');
    setAgentFilter('');
    
    setActiveStatusFilter('All');
    setActiveCustomerFilter('');
    setActiveAgentFilter('');
    setCurrentPage(1);
  };

  const handleApplyDrawerFilters = () => {
    applyFilters();
    setIsFilterDrawerOpen(false);
  };

  const handleResetDrawerFilters = () => {
    resetFilters();
    setIsFilterDrawerOpen(false);
  };

  const handleSaveComment = () => {
    if (!addForm.customerName || !addForm.phone || !addForm.date || !addForm.time || !addForm.agentName) {
      return;
    }

    if (editMode && editingId) {
      // Update existing
      const updatedLogs = callLogs.map(log => 
        log.id === editingId 
        ? {
            ...log,
            customerName: addForm.customerName,
            phone: addForm.phone,
            groupName: addForm.groupName || log.groupName, // preserve if empty visually
            groupCode: addForm.groupCode || log.groupCode,
            datetime: `${addForm.date}T${addForm.time}:00`,
            agentName: addForm.agentName,
            notes: addForm.notes,
            status: addForm.status,
          }
        : log
      );
      setCallLogs(updatedLogs);
    } else {
      // Create new
      const newLog: CallLogItem = {
        id: `CL-${String(callLogs.length + 1).padStart(3, '0')}`,
        customerName: addForm.customerName,
        phone: addForm.phone,
        groupName: addForm.groupName || 'General',
        groupCode: addForm.groupCode || 'GRP-000',
        datetime: `${addForm.date}T${addForm.time}:00`,
        agentName: addForm.agentName,
        notes: addForm.notes,
        status: addForm.status,
      };
      setCallLogs([newLog, ...callLogs]);
    }

    closeFormModal();
  };

  const closeFormModal = () => {
    setAddForm(emptyForm);
    setShowAddModal(false);
    setEditMode(false);
    setEditingId(null);
  };

  const handleViewLog = (log: CallLogItem) => {
    setViewingLog(log);
    setShowViewModal(true);
  };

  const handleEditLog = () => {
    if (viewingLog) {
      const [datePart, timePart] = viewingLog.datetime.split('T');
      setAddForm({
        customerName: viewingLog.customerName,
        phone: viewingLog.phone,
        groupName: viewingLog.groupName,
        groupCode: viewingLog.groupCode,
        date: datePart,
        time: timePart.substring(0, 5),
        agentName: viewingLog.agentName,
        notes: viewingLog.notes,
        status: viewingLog.status,
      });
      setEditingId(viewingLog.id);
      setEditMode(true);
      setShowViewModal(false);
      setShowAddModal(true);
    }
  };

  const handleCustomerNameChange = (val: string) => {
    setAddForm(prev => {
      const next = { ...prev, customerName: val };
      // Try to auto-fill phone and group
      const existing = uniqueCustomers.find(c => c.name.toLowerCase() === val.toLowerCase());
      if (existing) {
        next.phone = existing.phone;
        next.groupName = existing.groupName;
        next.groupCode = existing.groupCode;
      }
      return next;
    });
  };

  // Count active filters
  const activeFiltersCount = 
    (activeStatusFilter !== 'All' ? 1 : 0) + 
    (activeCustomerFilter ? 1 : 0) + 
    (activeAgentFilter ? 1 : 0);

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Comments
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Customer call logs and follow-ups
            </p>
          </div>
          <button
            onClick={() => {
              setAddForm(emptyForm);
              setEditMode(false);
              setEditingId(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Comment
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg mb-6">
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex w-full">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, phone or notes..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 bg-primary-600 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-neutral-950">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results count */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-neutral-50/50 dark:bg-neutral-900/20">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Date and Time
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Agent Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {paginatedData.map((log) => {
                const badge = getStatusBadge(log.status);
                const StatusIcon = badge.icon;
                return (
                  <tr
                    key={log.id}
                    onClick={() => handleViewLog(log)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatCallDate(log.datetime)}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatCallTime(log.datetime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {log.customerName}
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {log.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {log.groupName}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {log.groupCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {log.agentName}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate" title={log.notes}>
                        {log.notes}
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                    No call logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Wrapper */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{' '}
              {filteredData.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 ring-1 ring-primary-200 dark:ring-primary-800'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== FILTER DRAWER ===== */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={handleApplyDrawerFilters}
        onReset={handleResetDrawerFilters}
        title="Filter Comments"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Customer
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Customers</option>
              {uniqueCustomers.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Agent
            </label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Agents</option>
              {uniqueAgents.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CallLogStatus | 'All')}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="All">All Statuses</option>
              <option value="Connected">Connected</option>
              <option value="Not Connected">Not Connected</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
        </div>
      </FilterDrawer>

      {/* ===== ADD/EDIT COMMENT MODAL ===== */}
      <FormModal
        isOpen={showAddModal}
        onClose={closeFormModal}
        title={editMode ? "Edit Comment" : "Add Comment"}
        description={editMode ? "Update customer call details" : "Log a new customer call record"}
        onSubmit={handleSaveComment}
        submitLabel={editMode ? "Update Comment" : "Save Comment"}
        maxWidth="max-w-lg"
      >
        <FormSection>
          <FormGrid cols={2}>
            <FormField>
              <FormLabel htmlFor="add-customerName" required>Customer Name</FormLabel>
              <div className="relative">
                <FormInput
                  id="add-customerName"
                  list="customer-suggestions"
                  placeholder="Seach or enter name..."
                  value={addForm.customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  required
                />
                <datalist id="customer-suggestions">
                  {uniqueCustomers.map(c => (
                    <option key={c.name} value={c.name} />
                  ))}
                </datalist>
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </FormField>
            <FormField>
              <FormLabel htmlFor="add-phone" required>Phone</FormLabel>
              <FormInput
                id="add-phone"
                placeholder="+91 98765 43210"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                required
              />
            </FormField>
          </FormGrid>

          <FormGrid cols={2}>
            <FormField>
              <FormLabel htmlFor="add-date" required>Call Date</FormLabel>
              <FormInput
                id="add-date"
                type="date"
                value={addForm.date}
                onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                required
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="add-time" required>Call Time</FormLabel>
              <FormInput
                id="add-time"
                type="time"
                value={addForm.time}
                onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}
                required
              />
            </FormField>
          </FormGrid>

          <FormGrid cols={2}>
            <FormField>
              <FormLabel htmlFor="add-agentName" required>Agent Name</FormLabel>
              <FormInput
                id="add-agentName"
                placeholder="Enter agent name"
                value={addForm.agentName}
                onChange={(e) => setAddForm({ ...addForm, agentName: e.target.value })}
                required
              />
            </FormField>
            <FormField>
              <FormLabel htmlFor="add-status" required>Status</FormLabel>
              <FormSelect
                id="add-status"
                value={addForm.status}
                onChange={(e) => setAddForm({ ...addForm, status: e.target.value as CallLogStatus })}
              >
                <option value="Connected">Connected</option>
                <option value="Not Connected">Not Connected</option>
                <option value="Follow-up">Follow-up</option>
              </FormSelect>
            </FormField>
          </FormGrid>

          <FormField>
            <FormLabel htmlFor="add-notes">Notes</FormLabel>
            <FormTextarea
              id="add-notes"
              placeholder="Enter call notes..."
              value={addForm.notes}
              onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
              rows={3}
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* ===== VIEW COMMENT MODAL ===== */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingLog(null);
        }}
        title="Call Log Details"
        description={viewingLog ? `${viewingLog.customerName} — ${formatCallDate(viewingLog.datetime)}` : ''}
        maxWidth="max-w-lg"
      >
        {viewingLog && (() => {
          const badge = getStatusBadge(viewingLog.status);
          const StatusIcon = badge.icon;
          return (
            <div className="space-y-5">
              {/* Status Badge & Actions - Top */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
                  <StatusIcon className="w-4 h-4" />
                  {viewingLog.status}
                </span>
                
                <button
                  onClick={handleEditLog}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Customer</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{viewingLog.customerName}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Phone</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{viewingLog.phone}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Group</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{viewingLog.groupName}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Date & Time</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatCallDate(viewingLog.datetime)} at {formatCallTime(viewingLog.datetime)}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Agent</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{viewingLog.agentName}</p>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Notes</p>
                </div>
                <p className="text-sm text-neutral-900 dark:text-white leading-relaxed">
                  {viewingLog.notes || 'No notes recorded for this call.'}
                </p>
              </div>
            </div>
          );
        })()}
      </FormModal>
    </div>
  );
}
