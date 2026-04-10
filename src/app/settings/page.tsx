'use client'

import { useState } from 'react'
import { Settings, Bell, Shield, Palette, Building2, Save } from 'lucide-react'

export default function SettingsPage() {
  const [approvalLevels, setApprovalLevels] = useState(3)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoReminders, setAutoReminders] = useState(true)
  const [reminderDays, setReminderDays] = useState(3)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted text-sm mt-1">Configure your TRA instance</p>
      </div>

      {/* Approval Configuration */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Approval Chain
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Number of Approval Levels</label>
          <select
            value={approvalLevels}
            onChange={(e) => setApprovalLevels(Number(e.target.value))}
            className="w-48 px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} Level{n > 1 ? 's' : ''}</option>
            ))}
          </select>
          <p className="text-muted text-xs mt-1.5">
            Each request must be approved at every level before proceeding
          </p>
        </div>

        <div className="space-y-3">
          {Array.from({ length: approvalLevels }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={
                    i === 0 ? 'Direct Supervisor' :
                    i === 1 ? 'Department Head' :
                    i === 2 ? 'Finance Director' :
                    `Approver Level ${i + 1}`
                  }
                  className="w-full px-3 py-2 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
              <select className="px-3 py-2 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                <option>Auto-assign by department</option>
                <option>Manual assignment</option>
                <option>Role-based</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent" />
          Notifications
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-background/50 rounded-lg cursor-pointer">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-muted text-xs">Receive emails for approvals, status changes, and reminders</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 rounded accent-accent"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-background/50 rounded-lg cursor-pointer">
            <div>
              <p className="text-sm font-medium">Auto Reminders</p>
              <p className="text-muted text-xs">Automatically remind approvers of pending requests</p>
            </div>
            <input
              type="checkbox"
              checked={autoReminders}
              onChange={(e) => setAutoReminders(e.target.checked)}
              className="w-5 h-5 rounded accent-accent"
            />
          </label>
          {autoReminders && (
            <div className="pl-3">
              <label className="block text-sm font-medium mb-1.5">Reminder Interval</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  min={1}
                  max={14}
                  className="w-20 px-3 py-2 rounded-lg border border-card-border bg-transparent text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <span className="text-sm text-muted">days</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Organization */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-accent" />
          Organization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Company Name</label>
            <input
              type="text"
              defaultValue="Acme Corp"
              className="w-full px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Default Currency</label>
            <select className="w-full px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              <option>USD ($)</option>
              <option>EUR (E)</option>
              <option>GBP (L)</option>
              <option>CAD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Fiscal Year Start</label>
            <select className="w-full px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              <option>January</option>
              <option>April</option>
              <option>July</option>
              <option>October</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Max Per-Trip Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                type="number"
                defaultValue={5000}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/25">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}
