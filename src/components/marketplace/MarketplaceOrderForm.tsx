import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

type Source = 'Fiverr' | 'Freelancer.com' | 'Other';

const today = () => new Date().toISOString().slice(0, 10);
const dueInThirtyDays = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};

export const MarketplaceOrderForm: React.FC = () => {
  const { clients, addClient, addProject, createInvoice, showToast } = useApp();
  const [source, setSource] = useState<Source>('Fiverr');
  const [orderId, setOrderId] = useState('');
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [deadline, setDeadline] = useState(dueInThirtyDays());
  const [createDraftInvoice, setCreateDraftInvoice] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setOrderId('');
    setClientName('');
    setCompany('');
    setEmail('');
    setProjectName('');
    setAmount('');
    setCurrency('USD');
    setDeadline(dueInThirtyDays());
    setCreateDraftInvoice(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!clientName.trim() || !email.trim() || !projectName.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      showToast({ type: 'error', title: 'Complete the required fields', message: 'Add a client name, email, project title, and a positive order amount.' });
      return;
    }

    setIsSaving(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const existingClient = clients.find(client => client.email.trim().toLowerCase() === normalizedEmail);
      const client = existingClient || addClient({
        name: clientName.trim(),
        company: company.trim(),
        email: normalizedEmail,
        phone: '',
        currency,
        hourlyRate: 0,
        notes: `Added from ${source}${orderId.trim() ? ` order ${orderId.trim()}` : ''}.`,
        status: 'Active'
      });
      const startDate = today();
      const marketplaceReference = `${source}${orderId.trim() ? ` order ${orderId.trim()}` : ''}`;

      addProject({
        name: projectName.trim(),
        clientId: client.id,
        clientName: `${client.name} (${client.company || ''})`,
        status: 'In Progress',
        startDate,
        deadline,
        price: numericAmount,
        progress: 0,
        scope: `Added manually from ${marketplaceReference}.`
      });

      if (createDraftInvoice) {
        const issueDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const dueDate = new Date(deadline + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        createInvoice({
          clientId: client.id,
          clientName: client.name,
          clientCompany: client.company,
          clientEmail: client.email,
          clientPhone: client.phone,
          clientAddress: client.address,
          issueDate,
          dueDate,
          paymentTerms: 'Marketplace order',
          poReference: orderId.trim() ? `${source}: ${orderId.trim()}` : source,
          notes: `Draft created from ${marketplaceReference}. Confirm payment and marketplace fees before sending.`,
          lineItems: [{ id: `marketplace-${Date.now()}`, description: projectName.trim(), quantity: 1, rate: numericAmount, amount: numericAmount }],
          subtotal: numericAmount,
          taxRate: 0,
          taxAmount: 0,
          discountAmount: 0,
          totalAmount: numericAmount,
          paidAmount: 0,
          status: 'draft',
          currency
        });
      }

      showToast({ type: 'success', title: 'Marketplace order added', message: `ClientFlow created ${existingClient ? 'a project for the existing client' : 'a new client and project'}${createDraftInvoice ? ', plus a draft invoice' : ''}.` });
      reset();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-outline-variant/25 dark:border-card-border p-space-md flex flex-col gap-space-md">
      <div>
        <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">add_business</span>
          Add Marketplace Order
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1">Enter an order once to create its client and project, with an optional draft invoice.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Marketplace
          <select value={source} onChange={event => setSource(event.target.value as Source)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal">
            <option>Fiverr</option><option>Freelancer.com</option><option>Other</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Order ID <span className="font-normal text-on-surface-variant">(optional)</span>
          <input value={orderId} onChange={event => setOrderId(event.target.value)} placeholder="e.g. #FO12345" className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Client name *
          <input required value={clientName} onChange={event => setClientName(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Client email *
          <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Company <span className="font-normal text-on-surface-variant">(optional)</span>
          <input value={company} onChange={event => setCompany(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Project title *
          <input required value={projectName} onChange={event => setProjectName(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Order amount *
          <input required min="0.01" step="0.01" type="number" value={amount} onChange={event => setAmount(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Currency
          <select value={currency} onChange={event => setCurrency(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></select>
        </label>
        <label className="flex flex-col gap-1 font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Target deadline
          <input required type="date" value={deadline} onChange={event => setDeadline(event.target.value)} className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated border border-outline-variant/30 dark:border-card-border font-normal" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-on-surface dark:text-text-high cursor-pointer"><input checked={createDraftInvoice} onChange={event => setCreateDraftInvoice(event.target.checked)} type="checkbox" className="accent-primary" /> Create a draft invoice for this order</label>
      <div className="flex justify-end"><button type="submit" disabled={isSaving} className="px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container disabled:opacity-50 font-label-md text-label-md font-semibold">{isSaving ? 'Adding…' : 'Add order to ClientFlow'}</button></div>
    </form>
  );
};
