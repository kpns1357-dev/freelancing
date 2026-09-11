import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus } from '../../types';
import { handleFormKeyDown } from '../../utils/formNavigation';
import { COUNTRY_CODES, normalizePhoneNumber, parsePhoneNumber } from '../../utils/countryCodes';

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
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [hourlyRate, setHourlyRate] = useState(150);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [address, setAddress] = useState('');

  // Duplicate phone warning modal state
  const [isSamePhoneModalOpen, setIsSamePhoneModalOpen] = useState(false);
  const [samePhoneWarningClient, setSamePhoneWarningClient] = useState<Client | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = Boolean(selectedClientIdForDrawer);
  const currentClient = clients.find(c => c.id === selectedClientIdForDrawer);

  useEffect(() => {
    if (currentClient) {
      setName(currentClient.name || '');
      setCompany(currentClient.company || '');
      setEmail(currentClient.email || '');
      const parsed = parsePhoneNumber(currentClient.phone || '');
      setCountryCode(parsed.countryCode);
      setPhoneLocal(parsed.localNumber);
      setCurrency(currentClient.currency || 'USD');
      setHourlyRate(currentClient.hourlyRate || 150);
      setNotes(currentClient.notes || '');
      setStatus(currentClient.status || 'Active');
      setAddress(currentClient.address || '');
      setErrors({});
      setIsSamePhoneModalOpen(false);
      setSamePhoneWarningClient(null);
    } else {
      // New Client Defaults
      setName('');
      setCompany('');
      setEmail('');
      setCountryCode('+91');
      setPhoneLocal('');
      setCurrency('USD');
      setHourlyRate(150);
      setNotes('');
      setStatus('Active');
      setAddress('');
      setErrors({});
      setIsSamePhoneModalOpen(false);
      setSamePhoneWarningClient(null);
    }
  }, [currentClient, isClientDrawerOpen]);

  if (!isClientDrawerOpen) return null;

  // Filter client's invoices and projects
  const clientInvoices = invoices.filter(inv => inv.clientId === selectedClientIdForDrawer);
  const clientProjects = projects.filter(p => p.clientId === selectedClientIdForDrawer);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    const trimmedName = name.trim();
    const trimmedCompany = company.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) errs.name = 'Client name is required';
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid business email (e.g. name@company.com)';
    }
    if (!trimmedCompany) errs.company = 'Company name is required';

    // Duplicate Check: ensure same name & company or same email does not already exist in database
    const otherClients = clients.filter(c => c.id !== selectedClientIdForDrawer);
    const existingDuplicate = otherClients.find(
      c =>
        (c.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
         c.company.trim().toLowerCase() === trimmedCompany.toLowerCase()) ||
        (c.email.trim().toLowerCase() === trimmedEmail.toLowerCase())
    );

    if (existingDuplicate) {
      errs.general = `Duplicate Record: A client with this name & company ("${existingDuplicate.name}" - ${existingDuplicate.company}) or email (${existingDuplicate.email}) already exists in your directory.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getFullPhoneNumber = () => {
    return phoneLocal.trim() ? `${countryCode} ${phoneLocal.trim()}` : '';
  };

  const handleSave = (bypassPhoneWarning = false) => {
    if (!validate()) return;

    const fullPhone = getFullPhoneNumber();
    const normPhone = normalizePhoneNumber(fullPhone);

    // If phone number is provided and not yet acknowledged, check for matching numbers in other clients
    if (normPhone && !bypassPhoneWarning) {
      const otherClients = clients.filter(c => c.id !== selectedClientIdForDrawer);
      const existingWithSamePhone = otherClients.find(c => {
        const existingNorm = normalizePhoneNumber(c.phone);
        return existingNorm && (existingNorm === normPhone || existingNorm.endsWith(normPhone) || normPhone.endsWith(existingNorm));
      });

      if (existingWithSamePhone) {
        setSamePhoneWarningClient(existingWithSamePhone);
        setIsSamePhoneModalOpen(true);
        return;
      }
    }

    executeSave(fullPhone);
  };

  const executeSave = (savedPhone: string) => {
    setIsSamePhoneModalOpen(false);
    setSamePhoneWarningClient(null);

    if (isEditing && selectedClientIdForDrawer) {
      updateClient(selectedClientIdForDrawer, {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: savedPhone,
        currency,
        hourlyRate: Number(hourlyRate),
        notes,
        status,
        address
      });
      closeClientDrawer();
    } else {
      addClient({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: savedPhone,
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
    const fullPhone = getFullPhoneNumber();
    showToast({
      type: 'success',
      title: 'WhatsApp Dispatch',
      message: `Message sent to ${name} (${fullPhone || 'connected number'}).`,
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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div 
          onKeyDown={handleFormKeyDown}
          className="w-screen max-w-full sm:max-w-2xl bg-surface-container-lowest dark:bg-canvas-card shadow-2xl flex flex-col border-l border-outline-variant/30 dark:border-card-border transform transition-all duration-300"
        >
          {/* Drawer Top Header */}
          <div className="p-space-md sm:p-space-lg bg-surface-container-low dark:bg-canvas-card-elevated border-b border-outline-variant/20 dark:border-card-border/60 flex items-start justify-between">
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
                {/* General Duplicate Warning Alert */}
                {errors.general && (
                  <div className="p-3.5 rounded-xl bg-error-container/80 dark:bg-status-red-bg border border-error/50 dark:border-status-red text-on-error-container dark:text-status-red-text text-body-sm flex items-start gap-2.5 shadow-sm">
                    <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-error dark:text-status-red">
                      error
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs uppercase tracking-wider">Duplicate Record Prevented</span>
                      <span className="font-medium text-xs mt-0.5">{errors.general}</span>
                    </div>
                  </div>
                )}

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
                      placeholder="e.g. John Doe"
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
                      placeholder="e.g. Acme Corp"
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

                {/* Email & Phone with Country Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                      Email Address *
                    </label>
                    <input
                      className={`h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.email ? 'border-error' : 'border-outline-variant/30 dark:border-card-border'
                      }`}
                      placeholder="client@company.com"
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
                    <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold flex items-center justify-between">
                      <span>WhatsApp / Phone</span>
                      <span className="text-[11px] font-normal text-on-surface-variant dark:text-text-muted">Direct messaging</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {/* Country Code Select */}
                      <div className="relative w-36 shrink-0">
                        <select
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          className="w-full h-10 pl-2.5 pr-6 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer font-medium"
                        >
                          {COUNTRY_CODES.map(c => (
                            <option key={c.code + c.country} value={c.code}>
                              {c.flag} {c.code} ({c.iso})
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined text-[16px] text-outline dark:text-text-muted absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          expand_more
                        </span>
                      </div>

                      {/* Phone Local Number */}
                      <input
                        className="flex-1 h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. 98765 43210"
                        type="tel"
                        value={phoneLocal}
                        onChange={e => setPhoneLocal(e.target.value)}
                      />
                    </div>
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
                onClick={() => handleSave(false)}
                className="px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container dark:hover:bg-brand-primary-hover shadow-sm font-label-md text-label-md font-semibold transition-all"
                type="button"
              >
                {isEditing ? 'Save Changes' : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Same Phone Number Warning Modal */}
      {isSamePhoneModalOpen && samePhoneWarningClient && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-surface-container-lowest dark:bg-canvas-card border border-amber-500/40 rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 text-on-surface dark:text-text-high">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                <span className="material-symbols-outlined text-[24px]">contact_phone</span>
              </div>
              <div>
                <h3 className="font-title-lg text-base font-bold text-on-surface dark:text-text-high">
                  Duplicate Number Alert
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-text-muted">
                  Phone number matches an existing client
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-2.5">
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm leading-snug">
                Number is same. Do you mean that this is the same person, but with a different account?
              </p>
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 space-y-1">
                <div><span className="font-semibold">Existing Client:</span> {samePhoneWarningClient.name} ({samePhoneWarningClient.company})</div>
                <div><span className="font-semibold">Phone:</span> {samePhoneWarningClient.phone}</div>
                <div><span className="font-semibold">Email:</span> {samePhoneWarningClient.email}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-primary dark:bg-brand-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary-container shadow-sm transition-all text-center"
              >
                Yes, Different Account (Proceed)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSamePhoneModalOpen(false);
                  setSamePhoneWarningClient(null);
                  closeClientDrawer();
                  openClientDrawer(samePhoneWarningClient.id);
                }}
                className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-surface-container dark:bg-canvas-card-elevated text-on-surface dark:text-text-high hover:bg-surface-container-high font-label-md text-xs font-semibold border border-outline-variant/30 dark:border-card-border transition-colors text-center"
              >
                No, View Existing Client
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSamePhoneModalOpen(false);
                  setSamePhoneWarningClient(null);
                }}
                className="w-full sm:w-auto py-2 px-2.5 rounded-xl text-on-surface-variant dark:text-text-muted hover:text-on-surface dark:hover:text-text-high text-xs font-medium text-center"
              >
                Edit Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
