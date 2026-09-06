import React from 'react';
import { useApp } from '../../context/AppContext';

export const InvoicePreviewModal: React.FC = () => {
  const {
    previewInvoiceId,
    closeInvoicePreview,
    invoices,
    toggleInvoicePaid,
    showToast
  } = useApp();

  if (!previewInvoiceId) return null;

  const invoice = invoices.find(inv => inv.id === previewInvoiceId);
  if (!invoice) return null;

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';
  const remainingBalance = Math.max(0, invoice.totalAmount - (invoice.paidAmount || 0));

  const handlePrint = () => {
    window.print();
  };

  const handlePDFDownload = () => {
    showToast({
      type: 'success',
      title: 'PDF Generating',
      message: `Print dialog opened for ${invoice.invoiceNumber}. Select "Save as PDF" to download.`,
      liveTag: 'Ready'
    });
    window.print();
  };

  const handleWhatsAppShare = () => {
    const message = `Hello ${invoice.clientName}, your invoice ${invoice.invoiceNumber} for $${invoice.totalAmount.toLocaleString()} is available. Remaining balance: $${remainingBalance.toLocaleString()}.`;
    const cleanPhone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}` : '#';
    window.open(url, '_blank');
    showToast({
      type: 'success',
      title: 'WhatsApp Dispatched',
      message: `Remittance memo opened for ${invoice.clientName}.`
    });
  };

  const handleEmailSend = () => {
    showToast({
      type: 'success',
      title: 'Invoice Sent via Email',
      message: `PDF invoice copy sent to ${invoice.clientEmail}.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface/90 dark:bg-canvas/90 backdrop-blur-md flex flex-col p-2 sm:p-6">
      {/* Top Utility / Control Bar */}
      <div className="w-full max-w-[860px] mx-auto bg-surface-container-lowest dark:bg-canvas-card rounded-2xl shadow-sm px-3 sm:px-space-lg py-space-sm mb-space-md sm:mb-space-lg flex flex-wrap items-center justify-between gap-space-sm sm:gap-space-md border border-outline-variant/30 dark:border-card-border print:hidden">
        {/* Left: Navigation & Status */}
        <div className="flex items-center gap-2 sm:gap-space-md">
          <button
            onClick={closeInvoicePreview}
            className="flex items-center gap-1.5 text-on-surface-variant dark:text-text-medium hover:text-primary dark:hover:text-brand-primary transition-colors font-label-md text-label-md group"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span>Back to Invoices</span>
          </button>

          <span className="w-1 h-4 bg-outline-variant/40 dark:bg-card-border rounded-full"></span>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
              isPaid
                ? 'bg-secondary-container/70 dark:bg-status-emerald-bg text-on-secondary-container dark:text-status-emerald-text'
                : isOverdue
                ? 'bg-error-container/70 dark:bg-status-red-bg text-on-error-container dark:text-status-red-text'
                : 'bg-tertiary-fixed dark:bg-status-amber-bg text-on-tertiary-fixed-variant dark:text-status-amber-text'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaid
                  ? 'bg-secondary dark:bg-status-emerald'
                  : isOverdue
                  ? 'bg-error dark:bg-status-red animate-pulse'
                  : 'bg-tertiary dark:bg-status-amber'
              }`}
            ></span>
            <span>
              {isPaid
                ? 'PAID / SETTLED'
                : isOverdue
                ? 'OVERDUE — Immediate Payment Required'
                : 'PENDING REMITTANCE'}
            </span>
          </div>

          {invoice.poReference && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm">
              {invoice.poReference}
            </span>
          )}
        </div>

        {/* Right: Quick Export & Remittance Actions */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 font-label-md text-label-md transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span className="hidden md:inline">Print</span>
          </button>

          <button
            onClick={handlePDFDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 font-label-md text-label-md transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="hidden md:inline">PDF</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-secondary dark:text-status-emerald-text hover:bg-secondary-container/40 dark:hover:bg-slate-700 font-label-md text-label-md transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="hidden lg:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleEmailSend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-on-surface-variant dark:text-text-medium hover:text-on-surface dark:hover:text-text-high hover:bg-surface-container dark:hover:bg-slate-700 font-label-md text-label-md transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span className="hidden lg:inline">Send Email</span>
          </button>

          <div className="h-6 w-[1px] bg-outline-variant/40 dark:bg-card-border mx-1 hidden sm:block"></div>

          <button
            onClick={() => toggleInvoicePaid(invoice.id)}
            className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-xl font-label-md text-label-md shadow-sm transition-all font-semibold ${
              isPaid
                ? 'bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-high hover:bg-surface-container'
                : 'bg-primary dark:bg-brand-primary hover:bg-primary-container text-on-primary'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPaid ? 'undo' : 'credit_score'}
            </span>
            <span>{isPaid ? 'Mark as Unpaid' : 'Record Payment'}</span>
          </button>
        </div>
      </div>

      {/* Document Stage Canvas: Centered Print-Ready White Sheet */}
      <div className="w-full flex justify-center items-start pb-12 printable-invoice-container">
        {/* Invoice Sheet */}
        <div
          id="invoice-sheet"
          className="w-full max-w-[860px] bg-surface-container-lowest dark:bg-canvas-card rounded-2xl shadow-xl border border-outline-variant/30 dark:border-card-border p-8 sm:p-14 relative overflow-hidden text-on-surface dark:text-text-high"
        >
          {/* Top Brand Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>

          {/* Top Header Section: Agency Branding & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-space-lg pb-space-xl border-b border-outline-variant/20 dark:border-card-border/60">
            {/* Agency Profile */}
            <div className="flex flex-col max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <img
                  alt="ClientFlow Logo"
                  className="h-9 w-auto object-contain dark:brightness-110"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UETwRPRp58A4vVLhzHnN3Nk9ltLwmx7Eof901EVivgdSv4Ik7IM5KjfI_-MGJYaLou0T2YGb0V-1alyQWlElKRx_Um74zTeHWFKCjNnNrfxN8kRsjhZx6PBFVaV8HuZPY21uZX2C78xdsDsySTAGfYsykpX8zOEqolvV7SAQ80khfl1PtDOLWWCZITsveGQhqzJeXgR2MBIN_XDEG5bz0A4ZfqcStr_0i5rPddKouM7QeY-tL3RfU"
                />
                <span className="h-5 w-[1px] bg-outline-variant/50 dark:bg-card-border"></span>
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface dark:text-text-high font-bold">
                  Studio Craft
                </span>
              </div>
              <p className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold">
                Studio Craft & Flow LLC
              </p>
              <div className="flex flex-col mt-1 font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium leading-relaxed">
                <span>440 Brannan St, Suite 300</span>
                <span>San Francisco, CA 94107, United States</span>
                <span className="mt-1 text-primary dark:text-brand-primary">hello@studiocraft.design</span>
                <span className="font-mono text-[11px] text-outline dark:text-text-muted mt-0.5">
                  Tax ID: US-94829103
                </span>
              </div>
            </div>

            {/* Document Identity & Timestamps */}
            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline dark:text-text-muted font-bold">
                Tax Invoice
              </span>
              <h1 className="font-display-lg text-display-lg font-bold text-on-surface dark:text-text-high tracking-tight mt-0.5">
                {invoice.invoiceNumber}
              </h1>
              <div
                className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                  isPaid
                    ? 'bg-secondary-container text-on-secondary-container dark:bg-status-emerald-bg dark:text-status-emerald-text'
                    : isOverdue
                    ? 'bg-error-container text-on-error-container dark:bg-status-red-bg dark:text-status-red-text'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed dark:bg-status-amber-bg dark:text-status-amber-text'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPaid ? 'bg-secondary dark:bg-status-emerald' : isOverdue ? 'bg-error dark:bg-status-red' : 'bg-tertiary dark:bg-status-amber'
                  }`}
                ></span>
                <span>{isPaid ? 'PAID IN FULL' : isOverdue ? 'UNPAID / OVERDUE' : 'PENDING PAYMENT'}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-4 text-left sm:text-right font-body-sm text-body-sm">
                <span className="text-on-surface-variant dark:text-text-muted">PO Reference:</span>
                <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-medium">
                  {invoice.poReference || 'PO-98214'}
                </span>
                <span className="text-on-surface-variant dark:text-text-muted">Issue Date:</span>
                <span className="text-on-surface dark:text-text-high font-medium">{invoice.issueDate}</span>
                <span className="text-on-surface-variant dark:text-text-muted">Due Date:</span>
                <span
                  className={`font-semibold ${
                    isOverdue ? 'text-error dark:text-status-red-text' : 'text-on-surface dark:text-text-high'
                  }`}
                >
                  {invoice.dueDate}
                </span>
                <span className="text-on-surface-variant dark:text-text-muted">Payment Terms:</span>
                <span className="text-on-surface dark:text-text-high">{invoice.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Bilateral Routing Section: Client & Project Meta */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg py-space-xl border-b border-outline-variant/20 dark:border-card-border/60">
            {/* Billed To */}
            <div className="md:col-span-6 flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline dark:text-text-muted font-semibold mb-2">
                Billed To
              </span>
              <div className="bg-surface-container-low/60 dark:bg-canvas-card-elevated/50 rounded-xl p-space-md flex flex-col gap-1 border border-outline-variant/20 dark:border-card-border">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface dark:text-text-high font-bold">
                    {invoice.clientName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest dark:bg-slate-700 text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm">
                    Client CEO
                  </span>
                </div>
                <p className="font-title-md text-title-md text-primary dark:text-brand-primary font-medium">
                  {invoice.clientCompany || 'Direct Client'}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium mt-1 leading-relaxed">
                  {invoice.clientAddress || '742 Evergreen Terrace\nAustin, TX 78701, United States'}
                </p>
                <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-outline-variant/30 dark:border-card-border/60 font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-outline">email</span>
                    {invoice.clientEmail}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-outline">call</span>
                    {invoice.clientPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement Context */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline dark:text-text-muted font-semibold mb-2 block">
                  Engagement Context
                </span>
                <div className="p-space-md rounded-xl bg-surface-container-high/40 dark:bg-canvas-card-elevated/40 flex flex-col gap-2 border border-outline-variant/20 dark:border-card-border">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary dark:text-brand-primary text-[20px]">
                      architecture
                    </span>
                    <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-semibold">
                      Scope of Work
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface dark:text-text-high leading-snug">
                    {invoice.lineItems[0]?.description || 'Website Redesign & Webflow CMS Architecture'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-primary-fixed dark:bg-brand-primary/20 text-on-primary-fixed dark:text-brand-primary font-label-sm text-label-sm font-semibold">
                      Milestone Deliverable
                    </span>
                    <span className="text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
                      Sign-off: Sprint Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Currency & Status Alert Ribbon */}
              <div className="mt-3 p-2.5 rounded-xl bg-surface-container-low dark:bg-canvas-card-elevated flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant dark:text-text-medium border border-outline-variant/20 dark:border-card-border">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">payments</span>
                  Currency: <strong>USD ($)</strong>
                </span>
                <span
                  className={`font-medium flex items-center gap-1 ${
                    isPaid
                      ? 'text-secondary dark:text-status-emerald-text'
                      : isOverdue
                      ? 'text-error dark:text-status-red-text'
                      : 'text-tertiary dark:text-status-amber-text'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {isPaid ? 'Payment Cleared' : isOverdue ? 'Aging past grace period' : 'Net Terms Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <div className="py-space-xl">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted font-label-sm text-label-sm uppercase tracking-wider select-none">
                    <th className="py-3 px-4 rounded-l-xl font-semibold">Item & Description</th>
                    <th className="py-3 px-3 text-center font-semibold w-28">Hours / Qty</th>
                    <th className="py-3 px-4 text-right font-semibold w-32">Rate</th>
                    <th className="py-3 px-4 rounded-r-xl text-right font-semibold w-36">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 dark:divide-card-border/40 text-on-surface dark:text-text-high font-body-sm text-body-sm">
                  {invoice.lineItems.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low/40 dark:hover:bg-canvas-card-elevated/40 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <p className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-4 px-3 text-center align-top font-numeric-md text-numeric-md text-on-surface-variant dark:text-text-medium">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right align-top font-numeric-md text-numeric-md text-on-surface-variant dark:text-text-medium">
                        ${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right align-top font-numeric-md text-numeric-md font-semibold text-on-surface dark:text-text-high">
                        ${(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Block */}
          <div className="flex flex-col sm:flex-row justify-end pt-2 pb-space-xl border-b border-outline-variant/20 dark:border-card-border/60">
            <div className="w-full sm:w-80 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
                <span>Gross Subtotal</span>
                <span className="font-numeric-md text-numeric-md text-on-surface dark:text-text-high font-medium">
                  ${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between items-center text-secondary dark:text-status-emerald-text font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span>Agency Retainer Discount</span>
                    <span className="font-label-sm text-label-sm px-1.5 py-0.2 bg-secondary-container/60 dark:bg-status-emerald-bg rounded">
                      Promo
                    </span>
                  </span>
                  <span className="font-numeric-md text-numeric-md font-medium">
                    -${invoice.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
                <span>Sales Tax ({(invoice.taxRate * 100).toFixed(1)}%)</span>
                <span className="font-numeric-md text-numeric-md text-on-surface dark:text-text-high font-medium">
                  ${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="h-[1px] bg-outline-variant/30 dark:bg-card-border my-1"></div>

              <div className="flex justify-between items-baseline py-1">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-text-high">
                  Total Invoiced
                </span>
                <span className="font-numeric-lg text-numeric-lg font-bold text-primary dark:text-brand-primary">
                  ${invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {invoice.paidAmount > 0 && (
                <div className="flex justify-between items-center text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    Amount Paid (Deposit)
                  </span>
                  <span className="font-numeric-md text-numeric-md text-on-surface dark:text-text-high font-medium">
                    -${invoice.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {/* Outstanding Balance Callout */}
              <div
                className={`mt-2 p-3.5 rounded-xl flex items-center justify-between ${
                  isPaid
                    ? 'bg-secondary-container/30 dark:bg-status-emerald-bg text-secondary dark:text-status-emerald-text'
                    : 'bg-error-container dark:bg-status-red-bg text-on-error-container dark:text-status-red-text'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                    {isPaid ? 'Balance Settled' : 'Remaining Balance'}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {isPaid ? 'Payment confirmed in full' : 'Immediate remittance requested'}
                  </span>
                </div>
                <span className="font-display-lg text-headline-lg font-extrabold">
                  ${remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions & Wire Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg pt-space-xl pb-space-lg">
            {/* Direct Remittance Details */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary dark:text-brand-primary text-[20px]">
                  account_balance
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high">
                  Remittance & Wire Instructions
                </h3>
              </div>

              <div className="bg-surface-container-low dark:bg-canvas-card-elevated rounded-xl p-space-md flex flex-col gap-2 font-body-sm text-body-sm border border-outline-variant/20 dark:border-card-border">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-outline-variant/20 dark:border-card-border/60">
                  <span className="text-on-surface-variant dark:text-text-muted">Bank Name:</span>
                  <span className="col-span-2 text-on-surface dark:text-text-high font-semibold">
                    Bank of America, N.A.
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-outline-variant/20 dark:border-card-border/60">
                  <span className="text-on-surface-variant dark:text-text-muted">ACH / Routing:</span>
                  <span className="col-span-2 font-mono text-on-surface dark:text-text-high font-medium tracking-wide">
                    121000358
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-outline-variant/20 dark:border-card-border/60">
                  <span className="text-on-surface-variant dark:text-text-muted">Account Number:</span>
                  <span className="col-span-2 font-mono text-on-surface dark:text-text-high font-medium tracking-wide">
                    4829104829
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-on-surface-variant dark:text-text-muted">SWIFT / BIC:</span>
                  <span className="col-span-2 font-mono text-on-surface dark:text-text-high font-medium">
                    BOFAUS3N
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 text-on-surface-variant dark:text-text-medium font-body-sm text-body-sm bg-surface-container-high/30 dark:bg-canvas-card-elevated/40 p-2.5 rounded-lg border border-outline-variant/10 dark:border-card-border">
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-brand-primary shrink-0 mt-0.5">
                  info
                </span>
                <p>
                  <strong>Payment Memo Note:</strong> Thank you for your continued partnership! Please mention reference{' '}
                  <strong>{invoice.invoiceNumber}</strong> in all wire memos to accelerate clearing.
                </p>
              </div>
            </div>

            {/* Instant Card Pay / QR Gateway */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary dark:text-status-emerald-text text-[20px]">
                  qr_code_scanner
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high">
                  Pay Online Instantly
                </h3>
              </div>

              <div className="bg-surface-container-low dark:bg-canvas-card-elevated rounded-xl p-space-md flex flex-col items-center justify-center text-center border border-outline-variant/20 dark:border-card-border">
                {/* Simulated QR Code SVG */}
                <div className="w-32 h-32 bg-surface-container-lowest dark:bg-canvas-card p-2 rounded-xl shadow-sm flex items-center justify-center mb-3 border border-outline-variant/30 dark:border-card-border">
                  <svg className="w-full h-full text-on-surface dark:text-text-high" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M0,0 h30 v30 h-30 z M6,6 h18 v18 h-18 z M10,10 h10 v10 h-10 z"></path>
                    <path d="M70,0 h30 v30 h-30 z M76,6 h18 v18 h-18 z M80,10 h10 v10 h-10 z"></path>
                    <path d="M0,70 h30 v30 h-30 z M6,76 h18 v18 h-18 z M10,80 h10 v10 h-10 z"></path>
                    <rect height="8" width="8" x="40" y="5"></rect>
                    <rect height="15" width="8" x="52" y="5"></rect>
                    <rect height="6" width="12" x="40" y="20"></rect>
                    <rect height="18" width="8" x="5" y="40"></rect>
                    <rect height="8" width="15" x="20" y="40"></rect>
                    <rect height="8" width="8" x="25" y="54"></rect>
                    <rect fill="#2563EB" height="20" rx="3" width="20" x="40" y="38"></rect>
                    <rect height="8" width="14" x="68" y="40"></rect>
                    <rect height="18" width="8" x="88" y="40"></rect>
                    <rect height="14" width="10" x="72" y="52"></rect>
                    <rect height="12" width="12" x="40" y="68"></rect>
                    <rect height="6" width="18" x="56" y="68"></rect>
                  </svg>
                </div>

                <span className="font-title-md text-title-md font-semibold text-on-surface dark:text-text-high">
                  Scan to Pay via Card or ACH
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1 max-w-[200px]">
                  Stripe Checkout / Apple Pay / Google Pay enabled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
