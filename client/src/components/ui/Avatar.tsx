import { getInitials, getAvatarColor } from '../../utils/formatters'

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
  url?: string | null
}

export default function Avatar({ name, size = 'md', url }: Props) {
  const dims = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' }[size]
  if (url) return <img src={url} alt={name} className={`${dims} rounded-full object-cover ring-2 ring-white shadow-sm`} />
  return (
    <div className={`${dims} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-semibold shrink-0 ring-2 ring-white shadow-sm`}>
      {getInitials(name)}
    </div>
  )
}