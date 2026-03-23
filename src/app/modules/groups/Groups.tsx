import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Edit,
  Plus
} from 'lucide-react';
import GroupForm, { GroupItem, GroupCategory } from './GroupForm';

const initialMockGroups: GroupItem[] = [
  {
    id: 'GRP-001',
    name: 'Mumbai Elite Traders',
    code: 'MET-FDC-01',
    category: 'FDC',
    maxCapacity: 50,
    currentMembers: 42,
    status: 'Active',
    createdAt: '2025-10-15T10:00:00',
  },
  {
    id: 'GRP-002',
    name: 'Surat Diamond Merchants',
    code: 'SDM-ROY-01',
    category: 'Royal',
    maxCapacity: 20,
    currentMembers: 20,
    status: 'Active',
    createdAt: '2025-11-01T14:30:00',
  },
  {
    id: 'GRP-003',
    name: 'Bengaluru Trade Group',
    code: 'BTG-FDC-04',
    category: 'FDC',
    maxCapacity: 75,
    currentMembers: 10,
    status: 'Inactive',
    createdAt: '2026-02-01T13:00:00',
  }
];

export default function Groups() {
  const [groups, setGroups] = useState<GroupItem[]>(initialMockGroups);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  // Computed existing codes for validation
  const existingCodes = useMemo(() => groups.map((g) => g.code), [groups]);

  // Derived filtered data
  const filteredData = useMemo(() => {
    let data = [...groups];

    // Filter by Search (Name or Code)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(group => 
        group.name.toLowerCase().includes(query) || 
        group.code.toLowerCase().includes(query)
      );
    }

    // Sort by Date Desc
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [groups, searchQuery]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Handlers
  const handleOpenAddForm = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (group: GroupItem) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (group: GroupItem) => {
    if (editingGroup) {
      // Update existing
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
    } else {
      // Create new
      setGroups([group, ...groups]);
    }
    // Form component handles its own close
  };

  return (
    <div className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Group Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage groups, categories, and capacities
            </p>
          </div>
           <button
             onClick={handleOpenAddForm}
             className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
           >
             <Plus className="w-4 h-4" />
             Create Group
           </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg mb-6 flex items-center justify-between p-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search groups or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="text-sm text-neutral-500">
            Total {filteredData.length} records
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
             <thead className="bg-neutral-50/50 dark:bg-neutral-900/20">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Group Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Group Code</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Capacity</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {filteredData.map((group) => {
                
                // Status Badge Logic
                let badgeClass = '';
                let StatusIcon = CheckCircle2;
                
                if (group.status === 'Active') {
                  badgeClass = 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400';
                  StatusIcon = CheckCircle2;
                } else {
                  badgeClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
                  StatusIcon = XCircle;
                }

                return (
                  <tr key={group.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    {/* Group Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{group.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Group Code */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{group.code}</p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                         group.category === 'FDC' 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' 
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                       }`}>
                         {group.category}
                       </span>
                    </td>

                    {/* Capacity */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-neutral-900 dark:text-white font-medium">{group.maxCapacity}</p>
                    </td>

                    {/* Status Widget */}
                    <td className="px-5 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {group.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDate(group.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEditForm(group)}
                          className="p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 rounded transition-colors" 
                          title="Edit group"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Layers className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                      No groups found
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Try adjusting your search criteria or create a new group.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GroupForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingGroup}
        existingCodes={existingCodes}
      />

    </div>
  );
}
