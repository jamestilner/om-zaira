/**
 * SHARED MEMBERSHIP AND CUSTOMER DATA
 * 
 * Centralized data structure to ensure consistency between
 * Membership module and Customer module
 */

// Payment History Item interface
export interface PaymentHistoryItem {
  installmentNumber: number;
  amount: number;
  date: string;
  method: 'UPI' | 'Card' | 'Cash';
  status: 'paid' | 'pending' | 'failed';
  transactionId?: string;
  notes?: string;
  attachments?: string[];
}

// Purchase Item interface
export interface PurchaseItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Purchase Record interface
export interface PurchaseRecord {
  id: string;
  purchaseId: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalPurchaseAmount: number;
  amountAdjusted: number;
  remainingBalanceAfterPurchase: number;
  newEMI: number;
  notes?: string;
}

// Membership interface
export interface MembershipData {
  id: string;
  uid: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planAmount: number;
  installmentsPaid: number;
  totalInstallments: number;
  totalPaid: number;
  remaining: number;
  paymentProgress: number;
  status: 'active' | 'completed' | 'pending' | 'suspended';
  nextPaymentDate: string;
  startDate: string;
  endDate: string;
  paymentHistory: PaymentHistoryItem[];
  monthlyEMI?: number;
  duration?: number;
  purchaseHistory?: PurchaseRecord[];
  groupMembershipId?: string | null;
}

// Customer interface
export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'completed' | 'pending';
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  dob?: string; // YYYY-MM-DD
  anniversaryDate?: string; // YYYY-MM-DD
}

// Mock membership data
export const mockMemberships: MembershipData[] = [
  {
    id: '1',
    uid: 'MEM-2024-001',
    customerName: 'Priya Sharma',
    customerId: '1',
    customerEmail: 'priya.sharma@email.com',
    customerPhone: '+91 98765 43210',
    planName: 'Gold Savings Plan',
    planAmount: 60000,
    installmentsPaid: 6,
    totalInstallments: 12,
    totalPaid: 30000,
    remaining: 30000,
    paymentProgress: 50,
    status: 'active',
    nextPaymentDate: '2025-01-01',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    monthlyEMI: 5000,
    duration: 12,
    paymentHistory: [
      { installmentNumber: 1, amount: 5000, date: '2024-01-15', method: 'UPI', status: 'paid', transactionId: 'TXN240115001' },
      { installmentNumber: 2, amount: 5000, date: '2024-02-15', method: 'Card', status: 'paid', transactionId: 'TXN240215002' },
      { installmentNumber: 3, amount: 5000, date: '2024-03-15', method: 'UPI', status: 'paid', transactionId: 'TXN240315003' },
      { installmentNumber: 4, amount: 5000, date: '2024-04-15', method: 'UPI', status: 'paid', transactionId: 'TXN240415004' },
      { installmentNumber: 5, amount: 5000, date: '2024-05-15', method: 'Card', status: 'paid', transactionId: 'TXN240515005' },
      { installmentNumber: 6, amount: 5000, date: '2024-06-15', method: 'UPI', status: 'paid', transactionId: 'TXN240615006' },
      { installmentNumber: 7, amount: 5000, date: '2025-01-01', method: 'UPI', status: 'pending' },
    ],
    purchaseHistory: [],
    groupMembershipId: 'FDC-001/1',
  },
  {
    id: '2',
    uid: 'MEM-2024-002',
    customerName: 'Rajesh Kumar',
    customerId: '2',
    customerEmail: 'rajesh.kumar@email.com',
    customerPhone: '+91 98765 43211',
    planName: 'Platinum Premium',
    planAmount: 120000,
    installmentsPaid: 8,
    totalInstallments: 10,
    totalPaid: 96000,
    remaining: 24000,
    paymentProgress: 80,
    status: 'active',
    nextPaymentDate: '2025-02-10',
    startDate: '2024-02-10',
    endDate: '2025-02-10',
    monthlyEMI: 12000,
    duration: 10,
    paymentHistory: [
      { installmentNumber: 1, amount: 12000, date: '2024-02-10', method: 'Card', status: 'paid', transactionId: 'TXN240210001' },
      { installmentNumber: 2, amount: 12000, date: '2024-03-10', method: 'UPI', status: 'paid', transactionId: 'TXN240310002' },
      { installmentNumber: 3, amount: 12000, date: '2024-04-10', method: 'Card', status: 'paid', transactionId: 'TXN240410003' },
      { installmentNumber: 4, amount: 12000, date: '2024-05-10', method: 'UPI', status: 'paid', transactionId: 'TXN240510004' },
      { installmentNumber: 5, amount: 12000, date: '2024-06-10', method: 'Card', status: 'paid', transactionId: 'TXN240610005' },
      { installmentNumber: 6, amount: 12000, date: '2024-07-10', method: 'UPI', status: 'paid', transactionId: 'TXN240710006' },
      { installmentNumber: 7, amount: 12000, date: '2024-08-10', method: 'Card', status: 'paid', transactionId: 'TXN240810007' },
      { installmentNumber: 8, amount: 12000, date: '2024-09-10', method: 'UPI', status: 'paid', transactionId: 'TXN240910008' },
      { installmentNumber: 9, amount: 12000, date: '2025-02-10', method: 'UPI', status: 'pending' },
    ],
    purchaseHistory: [],
    groupMembershipId: 'ROY-100/4',
  },
  {
    id: '3',
    uid: 'MEM-2024-003',
    customerName: 'Anita Desai',
    customerId: '3',
    customerEmail: 'anita.desai@email.com',
    customerPhone: '+91 98765 43212',
    planName: 'Silver Basic',
    planAmount: 36000,
    installmentsPaid: 6,
    totalInstallments: 6,
    totalPaid: 36000,
    remaining: 0,
    paymentProgress: 100,
    status: 'completed',
    nextPaymentDate: '2024-12-20',
    startDate: '2024-06-20',
    endDate: '2024-12-20',
    monthlyEMI: 6000,
    duration: 6,
    paymentHistory: [
      { installmentNumber: 1, amount: 6000, date: '2024-06-20', method: 'UPI', status: 'paid', transactionId: 'TXN240620001' },
      { installmentNumber: 2, amount: 6000, date: '2024-07-20', method: 'Card', status: 'paid', transactionId: 'TXN240720002' },
      { installmentNumber: 3, amount: 6000, date: '2024-08-20', method: 'UPI', status: 'paid', transactionId: 'TXN240820003' },
      { installmentNumber: 4, amount: 6000, date: '2024-09-20', method: 'UPI', status: 'paid', transactionId: 'TXN240920004' },
      { installmentNumber: 5, amount: 6000, date: '2024-10-20', method: 'Card', status: 'paid', transactionId: 'TXN241020005' },
      { installmentNumber: 6, amount: 6000, date: '2024-11-20', method: 'UPI', status: 'paid', transactionId: 'TXN241120006' },
    ],
    purchaseHistory: [],
    groupMembershipId: null,
  },
  {
    id: '4',
    uid: 'MEM-2024-004',
    customerName: 'Vikram Singh',
    customerId: '4',
    customerEmail: 'vikram.singh@email.com',
    customerPhone: '+91 98765 43213',
    planName: 'Diamond Elite',
    planAmount: 240000,
    installmentsPaid: 3,
    totalInstallments: 12,
    totalPaid: 60000,
    remaining: 180000,
    paymentProgress: 25,
    status: 'active',
    nextPaymentDate: '2025-03-05',
    startDate: '2024-09-05',
    endDate: '2025-09-05',
    monthlyEMI: 20000,
    duration: 12,
    paymentHistory: [
      { installmentNumber: 1, amount: 20000, date: '2024-09-05', method: 'Card', status: 'paid', transactionId: 'TXN240905001' },
      { installmentNumber: 2, amount: 20000, date: '2024-10-05', method: 'Card', status: 'paid', transactionId: 'TXN241005002' },
      { installmentNumber: 3, amount: 20000, date: '2024-11-05', method: 'UPI', status: 'paid', transactionId: 'TXN241105003' },
      { installmentNumber: 4, amount: 20000, date: '2025-03-05', method: 'UPI', status: 'pending' },
    ],
    purchaseHistory: [],
    groupMembershipId: null,
  },
  {
    id: '5',
    uid: 'MEM-2024-005',
    customerName: 'Meera Patel',
    customerId: '5',
    customerEmail: 'meera.patel@email.com',
    customerPhone: '+91 98765 43214',
    planName: 'Gold Savings Plan',
    planAmount: 60000,
    installmentsPaid: 0,
    totalInstallments: 12,
    totalPaid: 0,
    remaining: 60000,
    paymentProgress: 0,
    status: 'pending',
    nextPaymentDate: '2024-12-25',
    startDate: '2024-12-25',
    endDate: '2025-12-25',
    monthlyEMI: 5000,
    duration: 12,
    paymentHistory: [
      { installmentNumber: 1, amount: 5000, date: '2024-12-25', method: 'UPI', status: 'pending' },
    ],
    purchaseHistory: [],
  },
];

// Mock customer data derived from memberships
export const mockCustomers: CustomerData[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    joinDate: '2024-01-15',
    status: 'active',
    dob: '1990-03-20',
    anniversaryDate: '2015-03-22',
    country: 'India',
    state: 'Gujarat',
    city: 'Surat',
    area: 'Vesu',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43211',
    joinDate: '2024-02-10',
    status: 'active',
    dob: '1985-05-10',
    anniversaryDate: '2010-04-18',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    area: 'Andheri',
  },
  {
    id: '3',
    name: 'Anita Desai',
    email: 'anita.desai@email.com',
    phone: '+91 98765 43212',
    joinDate: '2024-06-20',
    status: 'completed',
    dob: '1992-03-25',
    anniversaryDate: '2020-03-21',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    area: 'Connaught Place',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43213',
    joinDate: '2024-09-05',
    status: 'active',
    dob: '1980-08-15',
    anniversaryDate: '2005-09-10',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    area: 'Malviya Nagar',
  },
  {
    id: '5',
    name: 'Meera Patel',
    email: 'meera.patel@email.com',
    phone: '+91 98765 43214',
    joinDate: '2024-12-25',
    status: 'pending',
    dob: '1995-12-05',
    anniversaryDate: '2018-11-20',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Navrangpura',
  },
];

// Helper function to get memberships by customer ID
export const getMembershipsByCustomerId = (customerId: string): MembershipData[] => {
  return mockMemberships.filter(membership => membership.customerId === customerId);
};

// Helper function to get customer by ID
export const getCustomerById = (customerId: string): CustomerData | undefined => {
  return mockCustomers.find(customer => customer.id === customerId);
};

// Helper function to get membership by UID
export const getMembershipByUid = (uid: string): MembershipData | undefined => {
  return mockMemberships.find(membership => membership.uid === uid);
};
