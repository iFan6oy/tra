'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PlaneTakeoff,
  ClipboardCheck,
  Receipt,
  Shield,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/requests', label: 'My Requests', icon: PlaneTakeoff },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/reimbursements', label: 'Reimbursements', icon: Receipt },
  { href: '/admin', label: 'Admin & Audit', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '...'

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar-bg flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
          <PlaneTakeoff className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg leading-tight">TRA</h1>
          <p className="text-sidebar-text/50 text-xs">Travel Reimbursement App</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/25'
                  : 'text-sidebar-text/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-sm font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'Loading...'}</p>
            <p className="text-sidebar-text/50 text-xs truncate">{user?.email || ''}</p>
          </div>
          <button className="text-sidebar-text/50 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
