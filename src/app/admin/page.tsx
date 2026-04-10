'use client'

import { useEffect, useState } from 'react'
import { Shield, Search, Download, Users, Building2, BookOpen } from 'lucide-react'
import { fetchUsers, fetchAuditLog } from '@/lib/api'

const tabs = [
  { id: 'audit', label: 'Audit Log', icon: BookOpen },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'departments', label: 'Departments', icon: Building2 },
]

type AuditEntry = {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  details: string
}

type UserRecord = {
  id: string
  name: string
  email: string
  role: string
  department: string | null
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('audit')
  const [search, setSearch] = useState('')
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])

  useEffect(() => {
    fetchAuditLog().then(setAuditLog)
    fetchUsers().then(setUsers)
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin & Audit</h1>
          <p className="text-muted text-sm mt-1">System administration and audit trail</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-card-border rounded-lg text-sm font-medium hover:bg-card-border/50 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-card-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {activeTab === 'audit' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Request</th>
                <th className="px-5 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {auditLog.map((entry) => (
                <tr key={entry.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm text-muted whitespace-nowrap">
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '-'}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium">{entry.user}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      entry.action === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      entry.action === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-zinc-100 text-zinc-600'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-accent font-mono">{entry.target}</td>
                  <td className="px-5 py-3 text-sm text-muted">{entry.details}</td>
                </tr>
              ))}
              {auditLog.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted text-sm">No audit entries yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-sm text-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      u.role === 'FINANCE' ? 'bg-indigo-100 text-indigo-700' :
                      u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                      'bg-zinc-100 text-zinc-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm">{u.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Engineering', code: 'ENG', manager: 'John Doe', employees: 3, budget: 45000 },
            { name: 'Sales', code: 'SAL', manager: 'Unassigned', employees: 1, budget: 65000 },
            { name: 'Finance', code: 'FIN', manager: 'Lisa Park', employees: 1, budget: 20000 },
          ].map((dept) => (
            <div key={dept.code} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{dept.name}</h3>
                <span className="text-xs font-mono text-muted bg-card-border/50 px-2 py-0.5 rounded">{dept.code}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Manager</span>
                  <span className="font-medium">{dept.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Employees</span>
                  <span>{dept.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Annual Travel Budget</span>
                  <span className="font-medium">${dept.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
