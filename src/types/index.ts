export type ClientStatus = 'Active' | 'Onboarding' | 'Archived';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  currency: string;
  hourlyRate: number;
  notes: string;
  status: ClientStatus;
  avatarUrl?: string;
  address?: string;
  taxId?: string;
  createdAt: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  price: number;
  progress: number; // 0 to 100
  scope?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "#INV-2024-048"
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  issueDate: string; // "Oct 10, 2024" or ISO
  dueDate: string;
  paymentTerms: string; // "Net 15", "Net 30", etc.
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.085 for 8.5%
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  poReference?: string;
  notes?: string;
  currency?: string;
  createdAt: string;
}

export type ActivityType = 'payment' | 'comment' | 'client' | 'invoice' | 'reminder';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  highlightText?: string;
  statusTag?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  liveTag?: string;
  undoAction?: () => void;
}

export type NavPath = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'analytics' | 'settings';
