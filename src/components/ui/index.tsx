import { X, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { OrderStatus, QuoteStatus } from '../../types'
import { ORDER_STATUS, QUOTE_STATUS } from '../../lib/utils'

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20 }: { size?: number }) => (
  <Loader2 size={size} className="animate-spin text-brand" />
)

export const FullPageSpinner = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Spinner size={28} />
  </div>
)

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const MODAL_SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

export const Modal = ({ open, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full card p-6 animate-slide-up', MODAL_SIZES[size])}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

// ── Empty state ───────────────────────────────────────────────────────────────
export const EmptyState = ({ message, icon: Icon }: { message: string; icon?: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <Icon size={36} className="text-ink-faint mb-3" />}
    <p className="text-ink-muted text-sm">{message}</p>
  </div>
)

// ── Status badge ──────────────────────────────────────────────────────────────
export const OrderBadge = ({ status }: { status: OrderStatus }) => {
  const cfg = ORDER_STATUS[status]
  return <span className={cfg.badge}><span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />{cfg.label}</span>
}

export const QuoteBadge = ({ status }: { status: QuoteStatus }) => {
  const cfg = QUOTE_STATUS[status]
  return <span className={cfg.badge}>{cfg.label}</span>
}

// ── Stats card ────────────────────────────────────────────────────────────────
interface StatCardProps { label: string; value: string | number; sub?: string; color?: string }
export const StatCard = ({ label, value, sub, color = 'text-ink' }: StatCardProps) => (
  <div className="card p-5">
    <p className="text-xs text-ink-faint uppercase tracking-wider mb-1">{label}</p>
    <p className={cn('text-2xl font-semibold', color)}>{value}</p>
    {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
  </div>
)

// ── Search input ──────────────────────────────────────────────────────────────
interface SearchProps { value: string; onChange: (v: string) => void; placeholder?: string }
export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }: SearchProps) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="input max-w-xs"
  />
)

// ── Confirm dialog ────────────────────────────────────────────────────────────
interface ConfirmProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; loading?: boolean }
export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, loading }: ConfirmProps) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex items-start gap-3 mb-5">
      <AlertCircle size={18} className="text-accent-amber shrink-0 mt-0.5" />
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
    <div className="flex gap-2 justify-end">
      <button onClick={onClose} className="btn-ghost">Cancelar</button>
      <button onClick={onConfirm} disabled={loading} className="btn-primary">
        {loading ? <Spinner size={14} /> : 'Confirmar'}
      </button>
    </div>
  </Modal>
)
