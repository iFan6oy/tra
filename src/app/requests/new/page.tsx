'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, Plus, Trash2, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createRequest } from '@/lib/api'

const expenseCategories = [
  'AIRFARE', 'HOTEL', 'MEALS', 'GROUND_TRANSPORT', 'RENTAL_CAR',
  'FUEL', 'PARKING', 'REGISTRATION', 'BAGGAGE', 'OTHER',
]

type EstimateRow = {
  category: string
  description: string
  amount: string
}

export default function NewRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [purpose, setPurpose] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [estimates, setEstimates] = useState<EstimateRow[]>([
    { category: 'AIRFARE', description: '', amount: '' },
    { category: 'HOTEL', description: '', amount: '' },
  ])

  const addEstimate = () => {
    setEstimates([...estimates, { category: 'MEALS', description: '', amount: '' }])
  }

  const removeEstimate = (index: number) => {
    setEstimates(estimates.filter((_, i) => i !== index))
  }

  const updateEstimate = (index: number, field: keyof EstimateRow, value: string) => {
    const updated = [...estimates]
    updated[index] = { ...updated[index], [field]: value }
    setEstimates(updated)
  }

  const estimatedTotal = estimates.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

  const handleSubmit = async (submit: boolean) => {
    if (!user) return
    setSaving(true)
    await createRequest({
      purpose,
      destination,
      departureDate,
      returnDate,
      notes,
      requesterId: user.id,
      submit,
      estimates: estimates
        .filter(e => e.description && e.amount)
        .map(e => ({
          category: e.category,
          description: e.description,
          amount: parseFloat(e.amount),
        })),
    })
    router.push('/requests')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/requests" className="p-2 hover:bg-card-border/50 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Travel Request</h1>
          <p className="text-muted text-sm mt-1">Submit a pre-trip travel estimate for approval</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <PlaneTakeoff className="w-5 h-5 text-accent" />
          Trip Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Purpose of Travel</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Annual DevOps Conference"
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Estimated Expenses</h2>
          <button
            onClick={addEstimate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-accent text-sm font-medium hover:bg-accent/5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Line
          </button>
        </div>
        <div className="space-y-3">
          {estimates.map((est, i) => (
            <div key={i} className="flex items-start gap-3">
              <select
                value={est.category}
                onChange={(e) => updateEstimate(i, 'category', e.target.value)}
                className="w-44 px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={est.description}
                onChange={(e) => updateEstimate(i, 'description', e.target.value)}
                placeholder="Description"
                className="flex-1 px-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                <input
                  type="number"
                  value={est.amount}
                  onChange={(e) => updateEstimate(i, 'amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-card-border bg-transparent text-sm text-right focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
              <button
                onClick={() => removeEstimate(i)}
                className="p-2.5 text-muted hover:text-danger rounded-lg hover:bg-danger/5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-3 border-t border-card-border">
          <div className="text-right">
            <p className="text-sm text-muted">Estimated Total</p>
            <p className="text-2xl font-bold">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/requests"
          className="px-4 py-2.5 border border-card-border rounded-lg text-sm font-medium hover:bg-card-border/50 transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="px-4 py-2.5 border border-card-border rounded-lg text-sm font-medium hover:bg-card-border/50 transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/25 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </div>
    </div>
  )
}
