import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestore';
import { MarketplaceConnection } from '../../types';
import { MarketplaceOrderForm } from '../marketplace/MarketplaceOrderForm';

export const SettingsView: React.FC = () => {
  const { darkMode, toggleDarkMode, clearWorkspace, showToast } = useApp();
  const { user, logOut, updateDisplayName } = useAuth();
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [fiverrConnection, setFiverrConnection] = useState<MarketplaceConnection | null>(null);
  const [fiverrProfileUrl, setFiverrProfileUrl] = useState('');
  const [fiverrGigUrl, setFiverrGigUrl] = useState('');
  const [isSavingFiverr, setIsSavingFiverr] = useState(false);

  useEffect(() => {
    if (!user) return;
    return firestoreService.subscribeMarketplaceConnection(user.uid, 'fiverr', connection => {
      setFiverrConnection(connection);
      setFiverrProfileUrl(connection?.profileUrl || '');
      setFiverrGigUrl(connection?.gigUrl || '');
    });
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateDisplayName(profileName.trim());
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your display name has been updated successfully.'
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update profile.'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSavePreferences = () => {
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Agency preferences and defaults updated.'
    });
  };

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };

  const handleSaveFiverrLinks = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!isValidUrl(fiverrProfileUrl) || !isValidUrl(fiverrGigUrl)) {
      showToast({ type: 'error', title: 'Check the links', message: 'Use complete https:// links for your Fiverr profile or Gig.' });
      return;
    }
    setIsSavingFiverr(true);
    try {
      await firestoreService.saveMarketplaceConnection(user.uid, {
        provider: 'fiverr',
        status: fiverrProfileUrl || fiverrGigUrl ? 'manual' : 'not_connected',
        profileUrl: fiverrProfileUrl.trim(),
        gigUrl: fiverrGigUrl.trim()
      });
      showToast({ type: 'success', title: 'Fiverr links saved', message: 'Your public marketplace links are now stored in your private workspace.' });
    } catch (error) {
      showToast({ type: 'error', title: 'Could not save Fiverr links', message: 'Please try again.' });
    } finally {
      setIsSavingFiverr(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-3xl gap-space-xl max-w-4xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-text-high tracking-tight font-bold">
            Settings & Workspace
          </h1>
          <span className="bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-medium font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
            Precision Ledger
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-text-medium mt-1">
          Configure agency entity profile, billing preferences, remittance defaults, and data controls.
        </p>
      </div>

      {/* Account & Authentication Card */}
      {user && (
        <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">manage_accounts</span>
              <span>Account & Security</span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              ● Cloud Sync Active
            </span>
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Account Email
              </label>
              <input
                className="h-10 px-3 rounded-lg bg-surface-container-high/60 dark:bg-canvas-card-elevated/50 text-on-surface-variant dark:text-text-muted font-body-md text-body-md border border-outline-variant/30 dark:border-card-border cursor-not-allowed"
                disabled
                value={user.email || ''}
                type="email"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
                Display Name / Owner
              </label>
              <div className="flex gap-2">
                <input
                  className="h-10 px-3 flex-1 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-1 focus:ring-primary"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  type="text"
                />
                <button
                  type="submit"
                  disabled={isUpdatingProfile || profileName === (user.displayName || '')}
                  className="px-3.5 h-10 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-label-md text-xs font-semibold transition-colors"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 dark:border-card-border/60 text-xs text-on-surface-variant dark:text-text-muted">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span>User ID:</span>
              <span className="bg-surface-container-high dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                {user.uid}
              </span>
            </div>
            <button
              onClick={() => logOut()}
              type="button"
              className="text-error hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign out of this session</span>
            </button>
          </div>
        </div>
      )}

      {/* Agency Identity Card */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high">
          Agency Identity & Invoicing Headers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Agency Legal Name
            </label>
            <input
              className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none"
              defaultValue="Studio Craft & Flow LLC"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Billing Email
            </label>
            <input
              className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none"
              defaultValue="hello@studiocraft.design"
              type="email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Tax ID / EIN
            </label>
            <input
              className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none"
              defaultValue="US-94829103"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
              Default Currency
            </label>
            <select className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-sm text-body-sm border border-outline-variant/30 dark:border-card-border focus:outline-none">
              <option>USD ($) — United States Dollar</option>
              <option>EUR (€) — Euro</option>
              <option>GBP (£) — British Pound</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">
            Registered Business Address
          </label>
          <input
            className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none"
            defaultValue="440 Brannan St, Suite 300, San Francisco, CA 94107, United States"
            type="text"
          />
        </div>
      </div>

      {/* Theme & Display Options */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high">
          Interface Appearance
        </h3>
        <div className="flex items-center justify-between p-space-sm bg-surface-container-low dark:bg-canvas-card-elevated rounded-xl border border-outline-variant/20 dark:border-card-border">
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-on-surface dark:text-text-high font-medium">
              Executive Dark Mode
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted">
              Deep slate tones (#0B0F19) with high-contrast glowing accents.
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-xl font-label-md text-label-md font-semibold transition-all ${
              darkMode
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-surface-container-high text-on-surface'
            }`}
            type="button"
          >
            {darkMode ? 'Dark Mode: ON' : 'Dark Mode: OFF'}
          </button>
        </div>
      </div>

      {/* Marketplace Connections */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col gap-1">
          <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
            <span>Marketplace Connections</span>
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
            Keep marketplace references with your private ClientFlow workspace. Login credentials are never requested or stored here.
          </p>
        </div>

        <div className="rounded-xl border border-outline-variant/25 dark:border-card-border p-space-md flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-on-surface dark:text-text-high">Freelancer.com</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1">
                Direct project and milestone sync is ready for server-side setup. It requires your approved Freelancer developer credentials.
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">Setup required</span>
          </div>
          <div className="text-xs text-on-surface-variant dark:text-text-muted">
            Add the secure backend and OAuth credentials described in <code>MARKETPLACE_INTEGRATION_PLAN.md</code>; never add them to this frontend's environment variables.
          </div>
        </div>

        <form onSubmit={handleSaveFiverrLinks} className="rounded-xl border border-outline-variant/25 dark:border-card-border p-space-md flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-on-surface dark:text-text-high">Fiverr</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-muted mt-1">
                Save public profile and Gig links. Automatic order synchronization is intentionally unavailable without approved Fiverr partner access.
              </p>
            </div>
            <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${fiverrConnection?.status === 'manual' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-surface-container-high dark:bg-canvas-card-elevated text-on-surface-variant dark:text-text-muted'}`}>
              {fiverrConnection?.status === 'manual' ? 'Links saved' : 'Not connected'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Fiverr profile URL</label>
              <input value={fiverrProfileUrl} onChange={event => setFiverrProfileUrl(event.target.value)} placeholder="https://www.fiverr.com/your-name" type="url" className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface dark:text-text-high font-semibold">Primary Gig URL</label>
              <input value={fiverrGigUrl} onChange={event => setFiverrGigUrl(event.target.value)} placeholder="https://www.fiverr.com/s/…" type="url" className="h-10 px-3 rounded-lg bg-surface-container-low dark:bg-canvas-card-elevated text-on-surface dark:text-text-high font-body-md text-body-md border border-outline-variant/30 dark:border-card-border focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-xs text-on-surface-variant dark:text-text-muted">Last updated: {fiverrConnection?.lastUpdatedAt ? new Date(fiverrConnection.lastUpdatedAt).toLocaleString() : 'Not yet saved'}</span>
            <button type="submit" disabled={isSavingFiverr} className="px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container disabled:opacity-50 font-label-md text-label-md font-semibold transition-colors">{isSavingFiverr ? 'Saving...' : 'Save Fiverr links'}</button>
          </div>
        </form>
      </div>

      <MarketplaceOrderForm />

      {/* Data Management Card */}
      <div className="bg-surface-container-lowest dark:bg-canvas-card border border-outline-variant/20 dark:border-card-border rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-text-high flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-500 text-[20px]">cleaning_services</span>
          <span>Workspace Data Controls</span>
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-text-medium">
          Start fresh by clearing all prototype and sample data from your account. All changes sync immediately to your Cloud Firestore workspace.
        </p>

        <div className="flex flex-wrap items-center gap-space-sm pt-2">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data in your workspace to start fresh?')) {
                clearWorkspace();
              }
            }}
            className="px-4 py-2 rounded-xl bg-error-container/40 dark:bg-status-red-bg text-error dark:text-status-red-text font-label-md text-label-md font-semibold hover:bg-error-container transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>Clear Workspace & Start Fresh</span>
          </button>

          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl bg-primary dark:bg-brand-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow-sm transition-all"
            type="button"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
