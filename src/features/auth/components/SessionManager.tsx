import { useState } from 'react';
import { useAuth } from '../context/authContextDef';
import { Key, Trash2, LogOut, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export function SessionManager() {
  const { user, role, logout, logoutAllDevices, deleteAccount } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="rounded border border-border bg-surface p-6 text-sm text-ink-muted">
        No authenticated session detected.
      </div>
    );
  }

  const handleGlobalSignOut = async () => {
    setActionNotice('Terminating all active sessions...');
    await logoutAllDevices();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeleting(true);
    const res = await deleteAccount();
    setIsDeleting(false);
    if (!res.success) {
      setActionNotice(res.error || 'Failed to delete account.');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {actionNotice && (
        <div className="rounded border border-moss/30 bg-moss/10 p-3 text-xs text-moss font-mono">
          {actionNotice}
        </div>
      )}

      {/* Current Active Session Overview */}
      <div className="rounded border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <span className="taxonomy-label">SEC.04 // ACTIVE CREDENTIAL SESSION</span>
          <span className="text-xs font-mono text-moss flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> SECURE TLS SESSION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-ink-muted block mb-0.5">Account Email:</span>
            <span className="font-semibold text-foreground text-sm">{user.email}</span>
          </div>
          <div>
            <span className="text-ink-muted block mb-0.5">Assigned Role:</span>
            <span className="font-semibold text-foreground uppercase">{role}</span>
          </div>
          <div>
            <span className="text-ink-muted block mb-0.5">User UUID:</span>
            <span className="font-mono text-ink-muted text-[11px] truncate block">{user.id}</span>
          </div>
          <div>
            <span className="text-ink-muted block mb-0.5">Email Verification:</span>
            <span className={user.email_confirmed_at ? 'text-moss font-semibold' : 'text-burnt font-semibold'}>
              {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs font-mono text-ink-muted hover:border-ink hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out (This Device)
          </button>
          <button
            onClick={handleGlobalSignOut}
            className="inline-flex items-center gap-2 rounded border border-burnt/40 px-3 py-1.5 text-xs font-mono text-burnt hover:bg-burnt/10 transition-colors"
          >
            <Key className="h-3.5 w-3.5" /> Invalidate All Other Devices
          </button>
        </div>
      </div>

      {/* Data Erasure & Privacy (GDPR / DPDP Hard Delete) */}
      <div className="rounded border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <span className="taxonomy-label">SEC.05 // DATA ERASURE & ACCOUNT TERMINATION</span>
          <Trash2 className="h-4 w-4 text-burnt" />
        </div>
        <p className="text-xs text-ink-muted font-sans leading-relaxed mb-4">
          Permanently remove your account, profile data, activity logs, customized recommendations,
          and badge achievements. In accordance with the India DPDP Act 2023 and GDPR Article 17,
          this executes a hard cascade deletion across all Postgres database records.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 rounded bg-burnt px-4 py-2 text-xs font-mono font-medium text-bone-100 hover:bg-burnt/90 transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5" /> Request Hard Account Deletion
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-burnt bg-surface p-6 rounded shadow-elevation">
            <div className="flex items-center gap-2 text-burnt font-serif font-bold text-lg mb-2">
              <AlertTriangle className="h-5 w-5" /> Confirm Irreversible Deletion
            </div>
            <p className="text-xs text-ink-muted leading-relaxed font-sans mb-4">
              This action cannot be undone. All activity logs, baseline calculations, and recommendations
              will be permanently scrubbed immediately.
            </p>

            <div className="mb-4">
              <label htmlFor="confirm-delete" className="block text-xs font-mono text-ink-muted mb-1">
                Type <strong className="text-burnt">DELETE</strong> to confirm:
              </label>
              <input
                id="confirm-delete"
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-burnt focus:outline-none focus:ring-1 focus:ring-burnt"
                placeholder="DELETE"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded border border-border px-3 py-1.5 text-xs font-mono text-ink-muted hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText !== 'DELETE' || isDeleting}
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 rounded bg-burnt px-4 py-1.5 text-xs font-mono font-medium text-bone-100 hover:bg-burnt/90 disabled:opacity-40 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Purging Data...</span>
                  </>
                ) : (
                  <span>Permanently Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
