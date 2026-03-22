import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <div className="text-4xl">🫥</div>
      <h1 className="text-xl font-extrabold text-zinc-900">Page not found</h1>
      <p className="text-sm text-zinc-600">That link doesn’t match anything in the demo catalog.</p>
      <div className="flex justify-center gap-2">
        <Link href="/search">
          <Button>Browse</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">Home</Button>
        </Link>
      </div>
    </div>
  )
}
