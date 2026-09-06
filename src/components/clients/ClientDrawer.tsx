import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientStatus } from '../../types';

export const ClientDrawer: React.FC = () => {
  const {
    isClientDrawerOpen,
    closeClientDrawer,
    selectedClientIdForDrawer,
    clients,
    projects,
    invoices,
    addClient,
    updateClient,
    deleteClient,
    openInvoiceDrawer,
    openInvoicePreview,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'invoices' | 'projects' | 'whatsapp'>('general');

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [hourlyRate, setHourlyRate] = useState(150);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [address, setAddress] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = Boolean(selectedClientIdForDrawer);
  const currentClient = clients.find(c => c.id === selectedClientIdForDrawer);

  useEffect(() => {
    if (currentClient) {
      setName(currentClient.name || '');
      setCompany(currentClient.company || '');
      setEmail(currentClient.email || '');
      setPhone(currentClient.phone || '');
      setCurrency(currentClient.currency || 'USD');
      setHourlyRate(currentClient.hourlyRate || 150);
      setNotes(currentClient.notes || '');
      setStatus(currentClient.status || 'Active');
      setAddress(currentClient.address || '');
      setErrors({});
    } else {
      // New Client Defaults
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setCurrency('USD');
      setHourlyRate(150);
      setNotes('');
      setStatus('Active');
      setAddress('');
      setErrors({});
    }
  }, [currentClient, isClientDrawerOpen]);

  if (!isClientDrawerOpen) return null;

  // Filter client's invoices and projects
  const clientInvoices = invoices.filter(inv => inv.clientId === selectedClientIdForDrawer);
  const clientProjects = projects.filter(p => p.clientId === selectedClientIdForDrawer);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Client name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid business email (e.g. name@company.com)';
    }
    if (!company.trim()) errs.company = 'Company name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEditing && selectedClientIdForDrawer) {
      updateClient(selectedClientIdForDrawer, {
        name,
        company,
        email,
        phone,
        currency,
        hourlyRate: Number(hourlyRate),
        notes,
        status,
        address
      });
      closeClientDrawer();
    } else {
      addClient({
        name,
        company,
        email,
        phone,
        currency,
        hourlyRate: Number(hourlyRate),
        notes,
        status,
        address
      });
      closeClientDrawer();
    }
  };

  const handleDelete = () => {
    if (!selectedClientIdForDrawer) return;
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const result = deleteClient(selectedClientIdForDrawer);
      if (!result.success) {
        // Warning already shown by context
      }
    }
  };

  const handleCreateInvoiceForClient = () => {
    if (selectedClientIdForDrawer) {
      closeClientDrawer();
      openInvoiceDrawer(null, selectedClientIdForDrawer);
    }
  };

  const handleSendWhatsAppPing = () => {
    showToast({
      type: 'success',
      title: 'WhatsApp Dispatch',
      message: `Message sent to ${name} (${phone || 'connected number'}).`,
      liveTag: 'Sent'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={closeClientDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-surface-container-lowest dark:bg-canvas-card shadow-2xl flex flex-col border-l border-outline-variant/30 dark:border-card-border transform transition-all duration-300">
          {/* Drawer Top Header */}
          <div className="p-space-lg bg-surface-container-low dark:bg-canvas-card-elevated border-b border-outline-variant/20 dark:border-card-border/60 flex items-start justify-between">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary flex items-center justify-center font-bold text-[16px] shrink-0 border border-outline-variant/30 dark:border-card-border">
                {name
                  ? name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'CF'}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold truncate">
                    {isEditing ? name : 'Add New Client'}
                  </h2>
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold ${
                      status === 'Active'
                        ? 'bg-secondary-container/50 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                        : status === 'Onboarding'
                        ? 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium mt-0.5">
                  {company || 'Onboard a new client partner'}
                </span>
              </div>
            </div>

            <button
              onClick={closeClientDrawer}
              className="p-1.5 text-on-surface-variant dark:text-text-muted hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 rounded-lg transition-colors"
              type="button"
              title="Close drawer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Drawer Tab Navigation */}
          {isEditing && (
            <div className="flex items-center border-b border-outline-variant/20 dark:border-card-border/60 px-space-lg bg-surface-container-lowest dark:bg-canvas-card">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-3 px-space-sm font-label-md text-label-md transition-all border-b-2 ${
                  activeTab === 'general'
                    ? 'border-primary dark:border-brand-primary text-primary dark:text-brand-primary font-bold'
                    : 'border-transparent text-on-surface-variant dark:text-text-medium hover:text-on-surface'
                }`}
                type="button"
              >
                General Info
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-3 px-space-sm font-label-md text-label-md transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'invoices'
                    ? 'border-primary dark:border-brand-primary text-primary dark:text-brand-primary font-bold'
                    : 'border-transparent text-on-surface-variant dark:text-text-medium hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Invoices</span>
                <span className="bg-surface-container dark:bg-slate-800 text-[11px] px-1.5 py-0.2 rounded-full font-semibold">
                  {clientInvoices.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-space-sm font-label-md text-label-md transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'border-primary dark:border-brand-primary text-primary dark:text-brand-primary font-bold'
                    : 'border-transparent text-on-surface-variant dark:text-text-medium hover:text-on-surface'
                }`}
                type="button"
              >
                <span>Projects</span>
                <span className="bg-surface-container dark:bg-slate-800 text-[11px] px-1.5 py-0.2 rounded-full font-semibold">
                  {clientProjects.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`py-3 px-space-sm font-label-md text-label-md transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'whatsapp'
                    ? 'border-primary dark:border-brand-primary text-primary dark:text-brand-primary font-bold'
                    : 'border-transparent text-on-surface-variant dark:text-text-medium hover:text-on-surface'
                }`}
                type="button"
              >
                <span>WhatsApp Log</span>
              </button>
            </div>
          )}

          {/* Drawer Body Canvas */}
          <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-lg">
            {activeTab === 'general' && (
              <div className="flex flex-col gap-space-md">
                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Client Contact Name *
                    </label>
                    <input
                      className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.name ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
                      }`}
                      placeholder="e.g. Sarah Jenkins"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    {errors.name && (
                      <span className="font-body-sm text-body-sm text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Company / Organization *
                    </label>
                    <input
                      className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.company ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
                      }`}
                      placeholder="e.g. Apex Design Studio"
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                    {errors.company && (
                      <span className="font-body-sm text-body-sm text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.company}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Email Address *
                    </label>
                    <input
                      className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.email ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
                      }`}
                      placeholder="sarah@apexstudio.io"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <span className="font-body-sm text-body-sm text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      WhatsApp / Phone
                    </label>
                    <input
                      className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+1 (555) 234-5678"
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status & Billing address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Engagement Status
                    </label>
                    <select
                      className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      value={status}
                      onChange={e => setStatus(e.target.value as ClientStatus)}
                    >
                      <option value="Active">Active Engagement</option>
                      <option value="Onboarding">Onboarding Queue</option>
                      <option value="Archived">Archived / Inactive</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Hourly Rate / Retainer ($/hr)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 font-numeric-md text-numeric-md text-outline">$</span>
                      <input
                        className="h-10 pl-7 pr-12 w-full rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-numeric-md text-numeric-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                        type="number"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(Number(e.target.value))}
                      />
                      <span className="absolute right-3 font-label-sm text-label-sm text-on-surface-variant dark:text-text-muted">
                        / hr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                    Billing Address
                  </label>
                  <input
                    className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. 742 Evergreen Terrace, Austin, TX 78701"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>

                {/* Internal Notes & Payment Terms */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Internal Notes & Payment Terms
                    </label>
                    <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                      Confidential
                    </span>
                  </div>
                  <textarea
                    className="p-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                    rows={4}
                    placeholder="Add billing terms, specific client nuances, preferences..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                {/* Quick WhatsApp Dispatch Preview Card */}
                {phone && (
                  <div className="bg-secondary/5 dark:bg-status-emerald-bg border border-secondary/20 dark:border-status-emerald/30 rounded-xl p-space-sm flex items-start gap-space-xs">
                    <span className="material-symbols-outlined text-secondary dark:text-status-emerald-text text-[22px] shrink-0 mt-0.5">
                      chat_bubble
                    </span>
                    <div className="flex flex-col gap-1 text-on-surface dark:text-text-high">
                      <span className="font-label-md text-label-md font-semibold text-secondary dark:text-status-emerald-text">
                        Quick WhatsApp Dispatch
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                        Send a pre-formatted message acknowledging payment or invoice generation directly to this client's connected mobile channel ({phone}).
                      </p>
                      <button
                        onClick={handleSendWhatsAppPing}
                        className="text-secondary dark:text-status-emerald-text font-label-sm text-label-sm font-semibold hover:underline flex items-center gap-1 self-start mt-1"
                        type="button"
                      >
                        <span>Send "Payment Reminder / Invoice Ready"</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface dark:text-text-high font-bold">
                    Past Invoices & Balances
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                    {clientInvoices.length} total issued
                  </span>
                </div>

                {clientInvoices.length === 0 ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant py-4 text-center">
                    No invoices generated for this client yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {clientInvoices.map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => openInvoicePreview(inv.id)}
                        className="p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated hover:bg-surface-container dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between cursor-pointer border border-outline-variant/20 dark:border-card-border"
                      >
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high">
                            {inv.invoiceNumber}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                            Due {inv.dueDate} • {inv.paymentTerms}
                          </span>
                        </div>
                        <div className="flex items-center gap-space-sm">
                          <span className="font-numeric-md text-numeric-md font-bold text-on-surface dark:text-text-high">
                            ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                              inv.status === 'paid'
                                ? 'bg-secondary/10 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                                : inv.status === 'overdue'
                                ? 'bg-error-container/50 dark:bg-status-red-bg text-error dark:text-status-red-text'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface dark:text-text-high font-bold">
                    Active Deliverables
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                    {clientProjects.length} deliverables
                  </span>
                </div>

                {clientProjects.length === 0 ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant py-4 text-center">
                    No active projects linked to this client yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {clientProjects.map(proj => (
                      <div
                        key={proj.id}
                        className="p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated flex items-center justify-between border border-outline-variant/20 dark:border-card-border"
                      >
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high">
                            {proj.name}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                            {proj.scope || 'Design system milestone'} • {proj.status}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 dark:bg-brand-primary/20 text-primary dark:text-brand-primary font-label-sm text-label-sm font-semibold">
                          {proj.progress}% Done
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp History Tab */}
            {activeTab === 'whatsapp' && (
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface dark:text-text-high font-bold">
                    Logged Communication Logs
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                    Synced via WhatsApp Web
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated flex flex-col gap-1 border border-outline-variant/20 dark:border-card-border">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm font-semibold text-secondary dark:text-status-emerald-text">
                        Incoming Message
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                        Yesterday at 4:12 PM
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface dark:text-text-high">
                      "{name}: Hey Alex, just reviewed the staging environment for the portal. Looks sharp! Will release payment on cycle."
                    </p>
                  </div>

                  <div className="p-space-sm rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated flex flex-col gap-1 border border-outline-variant/20 dark:border-card-border">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm font-semibold text-primary dark:text-brand-primary">
                        Automated Dispatch
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
                        Oct 15 at 9:00 AM
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface dark:text-text-high">
                      "ClientFlow Bot: Invoice for milestone release was issued with instant payment link."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Bottom Action Tray */}
          <div className="p-space-md bg-surface-container-low dark:bg-canvas-card-elevated border-t border-outline-variant/20 dark:border-card-border/60 flex items-center justify-between gap-space-sm">
            {isEditing ? (
              <button
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl text-error dark:text-status-red-text hover:bg-error-container/30 dark:hover:bg-status-red-bg transition-colors font-label-md text-label-md font-semibold flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Delete Client</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-space-xs">
              {isEditing && (
                <button
                  onClick={handleCreateInvoiceForClient}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-lowest dark:bg-canvas-card text-on-surface dark:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 font-label-md text-label-md font-medium transition-colors border border-outline-variant/30 dark:border-card-border"
                  type="button"
                >
                  Create Invoice
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover shadow-sm font-label-md text-label-md font-semibold transition-all"
                type="button"
              >
                {isEditing ? 'Save Changes' : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
