/**
 * ROLE MANAGEMENT
 * Screen ID: AD-ROLE-LIST-01
 * 
 * Manage roles and their permissions
 */

import { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Users,
  ChevronRight,
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
} from './hb/common/Form';

// Role and Permission interfaces
interface Permission {
  id: string;
  name: string;
  module: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  createdAt: string;
  status: 'active' | 'inactive';
}

// Available modules and their permissions
const availableModules = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'customers', name: 'Customers' },
  { id: 'memberships', name: 'Memberships' },
  { id: 'plans', name: 'Plans' },
  { id: 'products', name: 'Products' },
  { id: 'categories', name: 'Categories' },
  { id: 'reports', name: 'Reports' },
  { id: 'settings', name: 'Settings' },
  { id: 'admin_users', name: 'Admin Users' },
  { id: 'roles', name: 'Role Management' },
];

// Mock data
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    userCount: 2,
    permissions: availableModules.map(module => ({
      id: `${module.id}-perm`,
      name: module.name,
      module: module.id,
      actions: { create: true, read: true, update: true },
    })),
    createdAt: 'Jan 15, 2024',
    status: 'active',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Standard admin access with limited permissions',
    userCount: 4,
    permissions: [
      {
        id: 'dashboard-perm',
        name: 'Dashboard',
        module: 'dashboard',
        actions: { create: false, read: true, update: false },
      },
      {
        id: 'customers-perm',
        name: 'Customers',
        module: 'customers',
        actions: { create: true, read: true, update: true },
      },
      {
        id: 'memberships-perm',
        name: 'Memberships',
        module: 'memberships',
        actions: { create: true, read: true, update: true },
      },
      {
        id: 'products-perm',
        name: 'Products',
        module: 'products',
        actions: { create: true, read: true, update: true },
      },
      {
        id: 'reports-perm',
        name: 'Reports',
        module: 'reports',
        actions: { create: false, read: true, update: false },
      },
    ],
    createdAt: 'Feb 20, 2024',
    status: 'active',
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Limited access for team management',
    userCount: 3,
    permissions: [
      {
        id: 'dashboard-perm',
        name: 'Dashboard',
        module: 'dashboard',
        actions: { create: false, read: true, update: false },
      },
      {
        id: 'customers-perm',
        name: 'Customers',
        module: 'customers',
        actions: { create: false, read: true, update: true },
      },
      {
        id: 'memberships-perm',
        name: 'Memberships',
        module: 'memberships',
        actions: { create: false, read: true, update: false },
      },
    ],
    createdAt: 'Mar 10, 2024',
    status: 'active',
  },
];

export default function RoleManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Role form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Permissions state
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const itemsPerPage = 9;

  // Apply filters
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch =
        searchQuery === '' ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || role.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, roles, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      description: '',
      status: 'active',
    });
    setPermissions(
      availableModules.map(module => ({
        id: `${module.id}-perm`,
        name: module.name,
        module: module.id,
        actions: { create: false, read: false, update: false },
      }))
    );
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      status: role.status,
    });
    setPermissions(role.permissions);
    setShowRoleModal(true);
  };

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.userCount > 0) {
      toast.error(`Cannot delete role with ${role.userCount} assigned users`);
      return;
    }
    setRoles(roles.filter(r => r.id !== role.id));
    toast.success('Role deleted successfully');
  };

  const handleSubmitRole = () => {
    if (!roleForm.name || !roleForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRole) {
      // Update existing role
      const updatedRoles = roles.map(role =>
        role.id === editingRole.id
          ? { ...role, ...roleForm, permissions }
          : role
      );
      setRoles(updatedRoles);
      toast.success('Role updated successfully');
    } else {
      // Add new role
      const newRole: Role = {
        id: (roles.length + 1).toString(),
        name: roleForm.name,
        description: roleForm.description,
        status: roleForm.status,
        userCount: 0,
        permissions,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setRoles([...roles, newRole]);
      toast.success('Role created successfully');
    }

    setShowRoleModal(false);
  };

  const togglePermission = (moduleId: string, action: keyof Permission['actions']) => {
    setPermissions(permissions.map(perm =>
      perm.module === moduleId
        ? { ...perm, actions: { ...perm.actions, [action]: !perm.actions[action] } }
        : perm
    ));
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {paginatedRoles.map((role) => (
        <div
          key={role.id}
          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <Badge
                variant={role.status === 'active' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {role.status}
              </Badge>
            </div>

            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              {role.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
              {role.description}
            </p>

            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{role.userCount} users</span>
              </div>
              <span className="text-xs">{role.createdAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewPermissions(role)}
                className="flex-1"
              >
                View Permissions
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditRole(role)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteRole(role)}
                className="text-error-600 dark:text-error-400"
                disabled={role.userCount > 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="p-6 space-y-3">
      {paginatedRoles.map((role) => (
        <div
          key={role.id}
          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {role.name}
                  </h3>
                  <Badge
                    variant={role.status === 'active' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {role.status}
                  </Badge>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {role.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{role.userCount} users</span>
                  </div>
                  <span className="text-xs">{role.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewPermissions(role)}
              >
                Permissions
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditRole(role)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteRole(role)}
                className="text-error-600 dark:text-error-400"
                disabled={role.userCount > 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Users
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
          {paginatedRoles.map((role) => (
            <tr
              key={role.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    {role.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {role.description}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Users className="w-4 h-4" />
                  <span>{role.userCount}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant={role.status === 'active' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {role.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {role.createdAt}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPermissions(role)}
                  >
                    Permissions
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditRole(role)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRole(role)}
                    className="text-error-600 dark:text-error-400"
                    disabled={role.userCount > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <ListHeader
        title="Role Management"
        breadcrumbs={[
          { label: 'Settings' },
          { label: 'Role Management' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAddNew={handleAddRole}
        addNewLabel="Add Role"
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => setCurrentPage(1)}
        onReset={() => {
          setSelectedStatus('all');
          setCurrentPage(1);
        }}
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
      </FilterDrawer>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-950">
        {paginatedRoles.length > 0 ? (
          <>
            {viewMode === 'grid' && <GridView />}
            {viewMode === 'list' && <ListView />}
            {viewMode === 'table' && <TableView />}
          </>
        ) : (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No roles found
            </p>
            <Button onClick={handleAddRole}>
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredRoles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRoles.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Role Modal */}
      {showRoleModal && (
        <FormModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          title={editingRole ? 'Edit Role' : 'Add Role'}
          description={editingRole ? 'Update role details and permissions' : 'Create a new role with permissions'}
          maxWidth="max-w-4xl"
          onSubmit={handleSubmitRole}
          submitLabel={editingRole ? 'Update Role' : 'Create Role'}
        >
          <div className="space-y-6">
            {/* Basic Details */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                Role Details
              </h3>

              <div className="space-y-4">
                <FormField>
                  <FormLabel required>Role Name</FormLabel>
                  <FormInput
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    placeholder="e.g., Content Manager, Sales Representative"
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Description</FormLabel>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Describe the role's responsibilities and purpose..."
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                  />
                </FormField>

                <FormField>
                  <FormLabel>Status</FormLabel>
                  <select
                    value={roleForm.status}
                    onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                Permissions
              </h3>

              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Module
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Create
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Read
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        Update
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {permissions.map((permission) => (
                      <tr key={permission.module} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-sm font-medium">
                          {permission.name}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(permission.module, 'create')}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors mx-auto ${
                              permission.actions.create
                                ? 'bg-success-500 text-white'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}
                          >
                            {permission.actions.create && <Check className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(permission.module, 'read')}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors mx-auto ${
                              permission.actions.read
                                ? 'bg-primary-500 text-white'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}
                          >
                            {permission.actions.read && <Check className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(permission.module, 'update')}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors mx-auto ${
                              permission.actions.update
                                ? 'bg-warning-500 text-white'
                                : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}
                          >
                            {permission.actions.update && <Check className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* View Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <FormModal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedRole(null);
          }}
          title={`${selectedRole.name} Permissions`}
          description={selectedRole.description}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedRole(null);
                }}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Module
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Create
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Read
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {selectedRole.permissions.map((permission) => (
                  <tr key={permission.module} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {permission.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {permission.actions.create ? (
                        <Check className="w-5 h-5 text-success-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {permission.actions.read ? (
                        <Check className="w-5 h-5 text-primary-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {permission.actions.update ? (
                        <Check className="w-5 h-5 text-warning-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormModal>
      )}
    </div>
  );
}