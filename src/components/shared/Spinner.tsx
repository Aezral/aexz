import { cn } from '@/lib/utils'
import { IconLoader2, TablerIconsProps } from '@tabler/icons-react'

export default function Spinner(props: TablerIconsProps) {
  return (
    <IconLoader2  {...props} className={cn("animate-spin", props.className)}></IconLoader2>
  )
}
