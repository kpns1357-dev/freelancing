import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LineItem, InvoiceStatus } from '../../types';

export const InvoiceDrawer: React.FC = () => {
  const {
    isInvoiceDrawerOpen,
    closeInvoiceDrawer,
    editingInvoiceId,
    preselectedClientIdForInvoice,
    invoices,
    clients,
    createInvoice,
    updateInvoice,
    openInvoicePreview
  } = useApp();

  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [poReference, setPoReference] = useState('');
  const [notes, setNotes] = useState(
    'Payment due within 15 days of invoice date. Direct Wire (FedWire / ACH) or credit card via Stripe payment gateway available in client portal.'
  );

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: 'li-1',
      description: 'Phase 2: Mobile UI/UX Design System',
      quantity: 40,
      rate: 125,
      amount: 5000
    },
    {
      id: 'li-2',
      description: 'Interactive Prototyping & User Testing',
      quantity: 1,
      rate: 1800,
      amount: 1800
    }
  ]);

  const [taxRatePercent, setTaxRatePercent] = useState<number>(8.5);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [status, setStatus] = useState<InvoiceStatus>('pending');

  const isEditing = Boolean(editingInvoiceId);
  const currentInvoice = invoices.find(inv => inv.id === editingInvoiceId);

  useEffect(() => {
    if (currentInvoice) {
      setClientId(currentInvoice.clientId);
      setIssueDate(currentInvoice.issueDate);
      setDueDate(currentInvoice.dueDate);
      setPaymentTerms(currentInvoice.paymentTerms || 'Net 15');
      setPoReference(currentInvoice.poReference || '');
      setNotes(currentInvoice.notes || '');
      setLineItems(currentInvoice.lineItems || []);
      setTaxRatePercent((currentInvoice.taxRate || 0) * 100);
      setDiscountAmount(currentInvoice.discountAmount || 0);
      setStatus(currentInvoice.status);
    } else {
      // New Invoice setup
      const targetClientId = preselectedClientIdForInvoice || clients[0]?.id || '';
      setClientId(targetClientId);
      const now = new Date();
      setIssueDate(now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      const due = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
      setDueDate(due.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      setPaymentTerms('Net 15');
      setPoReference('PO-' + Math.floor(10000 + Math.random() * 90000));
      setNotes(
        'Payment due within 15 days of invoice date. Direct Wire (FedWire / ACH) or credit card via Stripe payment gateway available in client portal.'
      );
      setLineItems([
        {
          id: 'li-' + Date.now() + '-1',
          description: 'Phase 2: Mobile UI/UX Design System',
          quantity: 40,
          rate: 125,
          amount: 5000
        },
        {
          id: 'li-' + Date.now() + '-2',
          description: 'Interactive Prototyping & User Testing',
          quantity: 1,
          rate: 1800,
          amount: 1800
        }
      ]);
      setTaxRatePercent(8.5);
      setDiscountAmount(0);
      setStatus('pending');
    }
  }, [currentInvoice, isInvoiceDrawerOpen, preselectedClientIdForInvoice, clients]);

  if (!isInvoiceDrawerOpen) return null;

  // Real-time calculations
  const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.rate || 0), 0);
  const taxAmount = (subtotal * taxRatePercent) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

  // Line item handlers
  const handleItemChange = (id: string, field: 'description' | 'quantity' | 'rate', val: any) => {
    setLineItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'quantity' || field === 'rate') {
            const q = field === 'quantity' ? Number(val) : item.quantity;
            const r = field === 'rate' ? Number(val) : item.rate;
            updated.amount = q * r;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: 'li-' + Date.now(),
      description: 'New Scope Deliverable',
      quantity: 1,
      rate: 500,
      amount: 500
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const handleDeleteLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSaveInvoice = (asDraft: boolean = false) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (!selectedClient) return;

    const finalStatus: InvoiceStatus = asDraft ? 'draft' : status;

    if (isEditing && editingInvoiceId) {
      updateInvoice(editingInvoiceId, {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientCompany: selectedClient.company,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
        issueDate,
        dueDate,
        paymentTerms,
        poReference,
        notes,
        lineItems,
        subtotal,
        taxRate: taxRatePercent / 100,
        taxAmount,
        discountAmount,
        totalAmount: grandTotal,
        status: finalStatus
      });
      closeInvoiceDrawer();
    } else {
      createInvoice({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientCompany: selectedClient.company,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
        issueDate,
        dueDate,
        paymentTerms,
        poReference,
        notes,
        lineItems,
        subtotal,
        taxRate: taxRatePercent / 100,
        taxAmount,
        discountAmount,
        totalAmount: grandTotal,
        paidAmount: 0,
        status: finalStatus
      });
      closeInvoiceDrawer();
    }
  };

  const handlePreviewCurrent = () => {
    if (editingInvoiceId) {
      openInvoicePreview(editingInvoiceId);
    } else {
      // Create and preview
      const selectedClient = clients.find(c => c.id === clientId);
      if (!selectedClient) return;
      const created = createInvoice({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientCompany: selectedClient.company,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
        issueDate,
        dueDate,
        paymentTerms,
        poReference,
        notes,
        lineItems,
        subtotal,
        taxRate: taxRatePercent / 100,
        taxAmount,
        discountAmount,
        totalAmount: grandTotal,
        paidAmount: 0,
        status
      });
      closeInvoiceDrawer();
      openInvoicePreview(created.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={closeInvoiceDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-3xl bg-surface-container-lowest dark:bg-canvas-card shadow-2xl flex flex-col border-l border-outline-variant/30 dark:border-card-border transform transition-all duration-300">
          {/* Top Bar Header */}
          <div className="p-space-md sm:p-space-lg bg-surface-container-low dark:bg-canvas-card-elevated border-b border-outline-variant/20 dark:border-card-border/60 flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary dark:text-brand-primary text-[24px]">
                receipt_long
              </span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
                  {isEditing ? `Edit Invoice ${currentInvoice?.invoiceNumber}` : 'Draft New Invoice'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                  Two-column ledger computation and dispatch
                </span>
              </div>
            </div>

            <button
              onClick={closeInvoiceDrawer}
              className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-lg">
            {/* Section 1: Client Metadata & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md bg-surface-container-low/50 dark:bg-canvas-card-elevated/40 rounded-xl border border-outline-variant/20 dark:border-card-border">
              {/* Select Client */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
                  Billed To Client
                </label>
                <select
                  className="h-10 px-3 rounded-xl bg-surface-container-lowest dark:bg-canvas-card text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.company ? `${c.company} (${c.name})` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Date */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
                  Issue Date
                </label>
                <div className="flex items-center bg-surface-container-lowest dark:bg-canvas-card px-space-sm h-10 rounded-xl border border-outline-variant/30 dark:border-card-border">
                  <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px] mr-2">
                    calendar_today
                  </span>
                  <input
                    className="bg-transparent font-body-sm text-body-sm text-on-surface dark:text-text-high focus:outline-none w-full font-medium"
                    type="text"
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Terms & Due Date */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
                  Terms & Due Date
                </label>
                <div className="flex items-center bg-surface-container-lowest dark:bg-canvas-card px-space-sm h-10 rounded-xl border border-outline-variant/30 dark:border-card-border">
                  <span className="material-symbols-outlined text-outline dark:text-text-muted text-[18px] mr-2">
                    event_available
                  </span>
                  <input
                    className="bg-transparent font-body-sm text-body-sm text-on-surface dark:text-text-high focus:outline-none w-full font-medium"
                    type="text"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Dynamic Line Items Builder */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
                    Line Items
                  </span>
                  <span className="bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-text-high text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {lineItems.length} items
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                  Unit Rate: Hourly / Fixed
                </span>
              </div>

              {/* Header Titles for Line Items */}
              <div className="grid grid-cols-12 gap-2 px-space-sm text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider">
                <span className="col-span-6 font-semibold">Description / Scope</span>
                <span className="col-span-2 text-center font-semibold">Qty / Hrs</span>
                <span className="col-span-2 text-right font-semibold">Rate ($)</span>
                <span className="col-span-2 text-right font-semibold">Amount</span>
              </div>

              {/* Line Item List Container */}
              <div className="flex flex-col gap-space-xs">
                {lineItems.map(item => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center bg-surface-container-low dark:bg-canvas-card-elevated p-space-xs rounded-xl group transition-colors hover:bg-surface-container-high/40 dark:hover:bg-slate-700/60 border border-outline-variant/15 dark:border-card-border"
                  >
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline-variant dark:text-text-muted group-hover:text-primary dark:group-hover:text-brand-primary cursor-grab text-[18px]">
                        drag_indicator
                      </span>
                      <input
                        className="w-full bg-transparent font-title-md text-title-md text-on-surface dark:text-text-high font-medium focus:outline-none"
                        type="text"
                        value={item.description}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        className="w-full bg-surface-container-lowest dark:bg-canvas-card px-2 py-1 rounded-lg text-center font-numeric-md text-numeric-md text-on-surface dark:text-text-high focus:outline-none font-semibold border border-outline-variant/20 dark:border-card-border"
                        type="number"
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        className="w-full bg-surface-container-lowest dark:bg-canvas-card px-2 py-1 rounded-lg text-right font-numeric-md text-numeric-md text-on-surface dark:text-text-high focus:outline-none font-semibold border border-outline-variant/20 dark:border-card-border"
                        type="number"
                        value={item.rate}
                        onChange={e => handleItemChange(item.id, 'rate', e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="font-numeric-md text-numeric-md font-bold text-on-surface dark:text-text-high">
                        ${(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDeleteLineItem(item.id)}
                        className="p-1 text-on-surface-variant dark:text-text-muted hover:text-error dark:hover:text-status-red-text rounded-md transition-all"
                        type="button"
                        title="Remove row"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Line Item Action */}
              <button
                onClick={handleAddLineItem}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700 text-primary dark:text-brand-primary rounded-xl font-label-md text-label-md font-semibold transition-all border border-outline-variant/20 dark:border-card-border"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Line Item</span>
              </button>
            </div>

            {/* Section 3: Notes & Live Financial Computation Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-start">
              {/* Left: Notes & Wire Instructions */}
              <div className="md:col-span-7 flex flex-col gap-space-xs">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-semibold">
                  Payment Notes & Bank Instructions
                </label>
                <textarea
                  className="w-full bg-surface-container-low dark:bg-canvas-card-elevated p-space-sm rounded-xl font-body-sm text-body-sm text-on-surface dark:text-text-high border border-outline-variant/20 dark:border-card-border focus:outline-none resize-none leading-relaxed"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <div className="flex items-center gap-space-xs text-on-surface-variant dark:text-text-muted font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-secondary dark:text-status-emerald-text text-[16px]">
                    lock
                  </span>
                  <span>256-bit encrypted invoice link provided automatically to client.</span>
                </div>
              </div>

              {/* Right: Live Computation Summary Card */}
              <div className="md:col-span-5 bg-surface-container-low dark:bg-canvas-card-elevated p-space-md rounded-xl flex flex-col gap-space-xs shadow-sm border border-outline-variant/20 dark:border-card-border">
                <div className="flex items-center justify-between text-on-surface-variant dark:text-text-medium font-body-md text-body-md">
                  <span>Subtotal</span>
                  <span className="font-numeric-md text-numeric-md font-semibold text-on-surface dark:text-text-high">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant dark:text-text-medium font-body-md text-body-md">
                  <div className="flex items-center gap-1">
                    <span>Tax Rate</span>
                    <span className="bg-surface-container-high dark:bg-slate-700 px-1.5 py-0.2 rounded font-label-sm text-label-sm font-semibold">
                      {taxRatePercent}%
                    </span>
                  </div>
                  <span className="font-numeric-md text-numeric-md text-on-surface dark:text-text-high">
                    ${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant dark:text-text-medium font-body-md text-body-md">
                  <span>Discount</span>
                  <span className="font-numeric-md text-numeric-md text-secondary dark:text-status-emerald-text">
                    -${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-space-xs mt-space-xs flex items-center justify-between bg-surface-container-lowest dark:bg-canvas-card p-space-xs rounded-lg border border-outline-variant/20 dark:border-card-border">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant dark:text-text-muted font-bold">
                      Grand Total
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                      USD Due
                    </span>
                  </div>
                  <span className="font-numeric-lg text-numeric-lg font-bold text-primary dark:text-brand-primary tracking-tight">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Sticky Action Tray Footer */}
          <div className="px-space-xl py-space-md bg-surface-container-low dark:bg-canvas-card-elevated border-t border-outline-variant/20 dark:border-card-border/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <button
              onClick={() => handleSaveInvoice(true)}
              className="w-full sm:w-auto px-space-md py-2 text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 font-label-md text-label-md rounded-xl transition-colors"
              type="button"
            >
              Save as Draft
            </button>

            <div className="flex items-center gap-space-xs w-full sm:w-auto">
              <button
                onClick={handlePreviewCurrent}
                className="w-full sm:w-auto px-space-md py-2 bg-surface-container-lowest dark:bg-canvas-card hover:bg-surface-container dark:hover:bg-slate-700 text-on-surface dark:text-text-high font-label-md text-label-md rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 border border-outline-variant/30 dark:border-card-border"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleSaveInvoice(false)}
                className="w-full sm:w-auto px-space-lg py-2 bg-primary dark:bg-brand-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover text-on-primary font-label-md text-label-md rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send via Email & WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
