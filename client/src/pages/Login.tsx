import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { loginMutation } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hero-surface mx-auto mt-6 rounded-full px-6 py-3 flex items-center justify-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/90">TaskManager</p>
        <span className="w-px h-3 bg-white/30"></span>
        <p className="text-sm text-white/90">A focused project board for teams.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="surface-card-strong w-full max-w-sm p-6 md:p-7">
          <div className="mb-8">
            <p className="page-kicker mb-2">Welcome Back</p>
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Continue to your team workspace</p>
          </div>
          <form onSubmit={handleSubmit(d => loginMutation.mutate(d))} className="flex flex-col gap-4">
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} placeholder="you@example.com" />
            <Input label="Password" type="password" error={errors.password?.message} {...register('password')} placeholder="........" />
            {loginMutation.error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {(loginMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed'}
              </p>
            )}
            <Button type="submit" loading={loginMutation.isPending} className="mt-1 w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}