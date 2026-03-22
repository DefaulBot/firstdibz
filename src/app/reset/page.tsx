'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/AuthProvider'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { supabase, supabaseConfigured } = useAuth()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    // If this page is opened without a recovery session, show a helpful hint.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setMessage('Open the reset link from your email to set a new password.')
      }
    })
  }, [supabase])

  async function submit() {
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      if (password.trim().length < 8) throw new Error('Use at least 8 characters.')
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('Password updated. You can sign in now.')
      setTimeout(() => router.push('/signin'), 700)
    } catch (e: any) {
      setError(e?.message ?? 'Could not update password')
    } finally {
      setBusy(false)
    }
  }

  return (
    !supabaseConfigured ? (
      <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-soft">
        <div className="text-xl font-extrabold text-zinc-900">Supabase not configured</div>
        <div className="mt-2 text-sm text-zinc-600">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.</div>
      </div>
    ) : (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-soft">
      <div className="text-xl font-extrabold text-zinc-900">Reset password</div>
      <div className="mt-1 text-sm text-zinc-600">Set a new password for your account.</div>

      <div className="mt-6 space-y-3">
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            type="password"
            className="pl-11"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}
        {message ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">{message}</div>
        ) : null}

        <Button size="lg" onClick={submit} disabled={busy}>
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </div>
    </div>
    )
  )
}
