import { useState, useEffect } from 'react';
import {
  FormModal,
  FormLabel,
  FormField,
  FormInput,
  FormSelect,
  FormGrid,
  FormSection,
} from '../../components/hb/common/Form';

export type GroupCategory = 'FDC' | 'Royal';
export type GroupStatus = 'Active' | 'Inactive';

export interface GroupItem {
  id: string;
  name: string;
  code: string;
  category: GroupCategory;
  maxCapacity: number;
  currentMembers: number;
  status: GroupStatus;
  createdAt: string; // ISO String
}

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupItem) => void;
  initialData?: GroupItem | null;
  existingCodes: string[];
}

const emptyForm: Omit<GroupItem, 'id' | 'createdAt'> = {
  name: '',
  code: '',
  category: 'FDC',
  maxCapacity: 0,
  currentMembers: 0,
  status: 'Active',
};

export default function GroupForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingCodes,
}: GroupFormProps) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          code: initialData.code,
          category: initialData.category,
          maxCapacity: initialData.maxCapacity,
          currentMembers: initialData.currentMembers,
          status: initialData.status,
        });
      } else {
        setFormData(emptyForm);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Group code is required';
    } else {
      // Check uniqueness: Only throw error if it's a new code or changed code
      const isNewPattern = !initialData;
      const codeChanged = initialData && initialData.code !== formData.code;
      if ((isNewPattern || codeChanged) && existingCodes.includes(formData.code)) {
        newErrors.code = 'Group code must be unique';
      }
    }

    if (formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Max capacity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const now = new Date().toISOString();
      const payload: GroupItem = {
        id: initialData ? initialData.id : `GRP-${Date.now()}`,
        name: formData.name,
        code: formData.code,
        category: formData.category,
        maxCapacity: Number(formData.maxCapacity),
        currentMembers: Number(formData.currentMembers),
        status: formData.status,
        createdAt: initialData ? initialData.createdAt : now,
      };
      
      onSubmit(payload);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData(emptyForm);
    setErrors({});
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Edit Group' : 'Create Group'}
      description={initialData ? 'Update an existing group details' : 'Add a new group to the system'}
      onSubmit={handleSubmit}
      submitLabel={initialData ? 'Update Group' : 'Save Group'}
      maxWidth="max-w-lg"
    >
      <FormSection>
        <FormField>
          <FormLabel htmlFor="group-name" required>Group Name</FormLabel>
          <FormInput
            id="group-name"
            placeholder="e.g. Mumbai Elite Traders"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={errors.name ? 'border-error-500' : ''}
          />
          {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
        </FormField>

        <FormGrid cols={2}>
          <FormField>
            <FormLabel htmlFor="group-code" required>Group Code</FormLabel>
            <FormInput
              id="group-code"
              placeholder="e.g. MET-01"
              value={formData.code}
              onChange={(e) => {
                setFormData({ ...formData, code: e.target.value.toUpperCase() });
                if (errors.code) setErrors({ ...errors, code: '' });
              }}
              className={errors.code ? 'border-error-500 uppercase' : 'uppercase'}
            />
            {errors.code && <p className="mt-1 text-xs text-error-500">{errors.code}</p>}
          </FormField>

          <FormField>
             <FormLabel htmlFor="group-category" required>Category</FormLabel>
             <FormSelect
               id="group-category"
               value={formData.category}
               onChange={(e) => setFormData({ ...formData, category: e.target.value as GroupCategory })}
             >
               <option value="FDC">FDC</option>
               <option value="Royal">Royal</option>
             </FormSelect>
          </FormField>
        </FormGrid>

        <FormGrid cols={2}>
          <FormField>
            <FormLabel htmlFor="group-capacity" required>Max Capacity</FormLabel>
             <FormInput
                id="group-capacity"
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={formData.maxCapacity || ''}
                onChange={(e) => {
                  setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 });
                  if (errors.maxCapacity) setErrors({ ...errors, maxCapacity: '' });
                }}
                className={errors.maxCapacity ? 'border-error-500' : ''}
              />
              {errors.maxCapacity && <p className="mt-1 text-xs text-error-500">{errors.maxCapacity}</p>}
          </FormField>

          <FormField>
             <FormLabel htmlFor="group-status" required>Status</FormLabel>
             <FormSelect
               id="group-status"
               value={formData.status}
               onChange={(e) => setFormData({ ...formData, status: e.target.value as GroupStatus })}
             >
               <option value="Active">Active</option>
               <option value="Inactive">Inactive</option>
             </FormSelect>
          </FormField>
        </FormGrid>
      </FormSection>
    </FormModal>
  );
}
