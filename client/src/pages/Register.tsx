import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters').regex(/\d/, 'Must contain a number'),
  confirm: z.string(),
  orgName: z.string().min(2, 'Org name must be at least 2 characters').optional(),
  inviteCode: z.string().optional(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })
  .refine(d => !!d.orgName?.trim() || !!d.inviteCode?.trim(), {
    message: 'Provide org name or invite code',
    path: ['orgName'],
  })

type FormData = z.infer<typeof schema>

export default function Register() {
  const { registerMutation } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hero-surface mx-auto mt-6 rounded-full px-6 py-3 flex items-center justify-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/90">TaskManager</p>
        <span className="w-px h-3 bg-white/30"></span>
        <p className="text-sm text-white/90">Create your team workspace.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="surface-card-strong w-full max-w-lg p-6 md:p-8 lg:max-w-2xl">
          <div className="mb-8">
            <p className="page-kicker mb-2">Get Started</p>
            <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
            <p className="mt-1 text-sm text-slate-500">Set up your profile and start planning</p>
          </div>
          <form onSubmit={handleSubmit(d => registerMutation.mutate({ name: d.name, email: d.email, password: d.password, orgName: d.orgName?.trim() || undefined, inviteCode: d.inviteCode?.trim() || undefined }))} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="Full name" error={errors.name?.message} {...register('name')} placeholder="Yugal Kaushik" />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} placeholder="you@example.com" />
            <Input label="Password" type="password" error={errors.password?.message} {...register('password')} placeholder="Min 8 characters" />
            <Input label="Confirm password" type="password" error={errors.confirm?.message} {...register('confirm')} placeholder="Repeat password" />
            <Input label="Organization name (create)" error={errors.orgName?.message} {...register('orgName')} placeholder="My Team" />
            <Input label="Invite code (join)" error={errors.inviteCode?.message} {...register('inviteCode')} placeholder="Optional invite code" />
            {registerMutation.error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 lg:col-span-2">
                {(registerMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed'}
              </p>
            )}
            <Button type="submit" loading={registerMutation.isPending} className="mt-1 w-full lg:col-span-2">
              Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}