import { CheckIcon, CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCopy } from '../hooks/use-copy'

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  value: string
  label?: string
}

export function CopyButton({ value, label, className, ...props }: CopyButtonProps) {
  const { copied, copy } = useCopy()

  async function handleClick() {
    await copy(value)
    toast.success('Copied to clipboard', { description: value.replace(/^https?:\/\//, '') })
  }

  return (
    <Button onClick={handleClick} className={cn('relative', className)} aria-label={label ?? 'Copy link'} {...props}>
      <span className={cn('flex items-center gap-1.5 transition-all', copied && 'scale-75 opacity-0')}>
        <CopyIcon />
        {label}
      </span>
      <span className={cn('absolute inset-0 flex items-center justify-center gap-1.5 transition-all', !copied && 'scale-125 opacity-0')}>
        <CheckIcon />
        {label && 'Copied'}
      </span>
    </Button>
  )
}
