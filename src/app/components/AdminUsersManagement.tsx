/**
 * ADMIN USERS MANAGEMENT
 * Screen ID: AD-ADMIN-LIST-01
 * 
 * Manage administrator accounts and permissions
 */

import { useState, useMemo } from 'react';
import {
  Users,
  Mail,
  Shield,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  UserCog,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormSelect,
} from './hb/common/Form';

// Admin user interface
interface AdminUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Manager';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  initials: string;
}

// Mock data
const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    uid: 'ADM-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2 hours ago',
    createdAt: 'Jan 15, 2024',
    initials: 'RS',
  },
  {
    id: '2',
    uid: 'ADM-002',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '5 hours ago',
    createdAt: 'Feb 20, 2024',
    initials: 'PP',
  },
  {
    id: '3',
    uid: 'ADM-003',
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '1 day ago',
    createdAt: 'Mar 10, 2024',
    initials: 'AK',
  },
  {
    id: '4',
    uid: 'ADM-004',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Admin',
    status: 'inactive',
    lastLogin: '2 weeks ago',
    createdAt: 'Jan 5, 2024',
    initials: 'SJ',
  },
  {
    id: '5',
    uid: 'ADM-005',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '3 hours ago',
    createdAt: 'Feb 15, 2024',
    initials: 'MC',
  },
  {
    id: '6',
    uid: 'ADM-006',
    name: 'Anjali Verma',
    email: 'anjali.verma@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '1 hour ago',
    createdAt: 'Mar 5, 2024',
    initials: 'AV',
  },
  {
    id: '7',
    uid: 'ADM-007',
    name: 'David Lee',
    email: 'david.lee@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '6 hours ago',
    createdAt: 'Jan 25, 2024',
    initials: 'DL',
  },
  {
    id: '8',
    uid: 'ADM-008',
    name: 'Neha Singh',
    email: 'neha.singh@company.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '30 mins ago',
    createdAt: 'Feb 1, 2024',
    initials: 'NS',
  },
  {
    id: '9',
    uid: 'ADM-009',
    name: 'Robert Wilson',
    email: 'robert.w@company.com',
    role: 'Admin',
    status: 'inactive',
    lastLogin: '1 month ago',
    createdAt: 'Jan 10, 2024',
    initials: 'RW',
  },
];

// Role configurations
const roleConfig = {
  'Super Admin': {
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  'Admin': {
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  'Manager': {
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
};

export default function AdminUsersManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    role: 'Admin' as 'Super Admin' | 'Admin' | 'Manager',
    status: 'active' as 'active' | 'inactive',
    password: '',
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
  });

  const itemsPerPage = 9;

  // Apply filters
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(user => {
      const matchesSearch = searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.uid.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filters.status === 'all' || user.status === filters.status;

      const matchesRole = filters.role === 'all' || user.role === filters.role;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      role: 'all',
    });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleEdit = (user: AdminUser) => {
    console.log('Edit user:', user.id);
    setEditingAdmin(user);
    setAdminForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
    });
    setShowAdminModal(true);
    setOpenActionMenuId(null);
  };

  const handleDelete = (user: AdminUser) => {
    console.log('Delete user:', user.id);
    toast.success('Delete admin feature coming soon');
    setOpenActionMenuId(null);
  };

  // Admin User Action Menu Component
  const AdminActionMenu = ({ user }: { user: AdminUser }) => (
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenActionMenuId(openActionMenuId === user.id ? null : user.id);
        }}
        className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-white/90 dark:hover:bg-neutral-900/90 rounded-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {openActionMenuId === user.id && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Admin
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
          >
            <Trash2 className="w-4 h-4" />
            Delete Admin
          </button>
        </div>
      )}
    </div>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {paginatedUsers.map((user) => {
        const config = roleConfig[user.role];

        return (
          <div
            key={user.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative group"
          >
            <AdminActionMenu user={user} />

            <div
              className="w-full h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 flex items-center justify-center cursor-pointer"
              onClick={() => handleEdit(user)}
            >
              <div className="w-20 h-20 rounded-full bg-white dark:bg-neutral-950 border-4 border-white dark:border-neutral-950 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {user.initials}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">UID: {user.uid}</Badge>
                <Badge variant="outline" className={`text-xs border ${config.badgeClass}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                {user.status === 'inactive' ? (
                  <Badge variant="destructive" className="text-xs">Inactive</Badge>
                ) : (
                  <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                )}
              </div>

              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                {user.name}
              </h3>

              <div className="space-y-1 mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Last login: {user.lastLogin}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {user.createdAt}</span>
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
      {paginatedUsers.map((user) => {
        const config = roleConfig[user.role];

        return (
          <div
            key={user.id}
            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all relative"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => handleEdit(user)}
              >
                <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
                  {user.initials}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">UID: {user.uid}</Badge>
                      <Badge variant="outline" className={`text-xs border ${config.badgeClass}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role}
                      </Badge>
                      {user.status === 'inactive' ? (
                        <Badge variant="destructive" className="text-xs">Inactive</Badge>
                      ) : (
                        <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {user.lastLogin}
                      </span>
                    </div>
                  </div>
                  <AdminActionMenu user={user} />
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {user.createdAt}
                  </span>
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
              Admin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              UID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {paginatedUsers.map((user) => {
            const config = roleConfig[user.role];

            return (
              <tr
                key={user.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-xs">UID: {user.uid}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`text-xs border ${config.badgeClass}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{user.lastLogin}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'inactive' ? (
                    <Badge variant="destructive" className="text-xs">Inactive</Badge>
                  ) : (
                    <Badge variant="default" className="bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400 text-xs">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{user.createdAt}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === user.id ? null : user.id);
                      }}
                      className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openActionMenuId === user.id && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Admin
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Admin
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
        title="Admin Users"
        breadcrumbs={[
          { label: 'Settings' },
          { label: 'Admin Users' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAddNew={() => {
          setEditingAdmin(null);
          setAdminForm({
            name: '',
            email: '',
            role: 'Admin',
            status: 'active',
            password: '',
          });
          setShowAdminModal(true);
        }}
        addNewLabel="Add New"
      />

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
            <option value="inactive">Inactive</option>
          </select>
        </FilterField>

        <FilterField label="Role">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </FilterField>
      </FilterDrawer>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-950">
        {paginatedUsers.length > 0 ? (
          <>
            {viewMode === 'grid' && <GridView />}
            {viewMode === 'list' && <ListView />}
            {viewMode === 'table' && <TableView />}
          </>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No admin users found
            </p>
            <Button onClick={() => toast.success('Add admin feature coming soon')}>
              <Plus className="w-4 h-4" />
              Add Admin
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Admin Modal */}
      <FormModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title={editingAdmin ? 'Edit Admin' : 'Add Admin'}
        onSubmit={() => {
          if (editingAdmin) {
            const updatedUsers = adminUsers.map(user =>
              user.id === editingAdmin.id ? { ...user, ...adminForm } : user
            );
            setAdminUsers(updatedUsers);
            toast.success('Admin updated successfully');
          } else {
            const newAdmin: AdminUser = {
              id: (adminUsers.length + 1).toString(),
              uid: `ADM-${adminUsers.length + 1}`,
              name: adminForm.name,
              email: adminForm.email,
              role: adminForm.role,
              status: adminForm.status,
              lastLogin: 'Just now',
              createdAt: new Date().toLocaleDateString(),
              initials: adminForm.name.split(' ').map(name => name[0]).join('').toUpperCase(),
            };
            setAdminUsers([...adminUsers, newAdmin]);
            toast.success('Admin added successfully');
          }
          setShowAdminModal(false);
        }}
      >
        <FormField>
          <FormLabel>Name</FormLabel>
          <FormInput
            value={adminForm.name}
            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
            placeholder="Enter admin name"
            required
          />
        </FormField>

        <FormField>
          <FormLabel>Email</FormLabel>
          <FormInput
            value={adminForm.email}
            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
            placeholder="Enter admin email"
            required
          />
        </FormField>

        <FormField>
          <FormLabel>Role</FormLabel>
          <FormSelect
            value={adminForm.role}
            onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as 'Super Admin' | 'Admin' | 'Manager' })}
            required
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Status</FormLabel>
          <FormSelect
            value={adminForm.status}
            onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value as 'active' | 'inactive' })}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
        </FormField>

        <FormField>
          <FormLabel>Password</FormLabel>
          <FormInput
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            placeholder="Enter admin password"
            type="password"
            required
          />
        </FormField>
      </FormModal>
    </div>
  );
}