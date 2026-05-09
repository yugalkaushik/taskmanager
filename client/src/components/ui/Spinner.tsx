interface Props { size?: 'sm' | 'md' | 'lg' }

export default function Spinner({ size = 'md' }: Props) {
  const s = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-8 w-8 border-[3px]' }[size]
  return <div className={`${s} animate-spin rounded-full border-slate-200 border-r-cyan-500 border-t-sky-600`} />
}