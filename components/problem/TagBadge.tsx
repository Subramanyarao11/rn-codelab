import { cn } from '@/lib/cn'

const TAG_COLORS: Record<string, string> = {
  useState: 'bg-violet-500/20 text-violet-300',
  useEffect: 'bg-violet-500/20 text-violet-300',
  useCallback: 'bg-violet-500/20 text-violet-300',
  useContext: 'bg-violet-500/20 text-violet-300',
  'React.memo': 'bg-violet-500/20 text-violet-300',
  FlatList: 'bg-blue-500/20 text-blue-300',
  ScrollView: 'bg-blue-500/20 text-blue-300',
  TextInput: 'bg-blue-500/20 text-blue-300',
  TouchableOpacity: 'bg-blue-500/20 text-blue-300',
  StyleSheet: 'bg-green-500/20 text-green-300',
  flexbox: 'bg-green-500/20 text-green-300',
  dimensions: 'bg-green-500/20 text-green-300',
  flex: 'bg-green-500/20 text-green-300',
  Platform: 'bg-orange-500/20 text-orange-300',
  AsyncStorage: 'bg-orange-500/20 text-orange-300',
  'React Navigation': 'bg-pink-500/20 text-pink-300',
}

const DEFAULT_COLOR = 'bg-app-control text-app-fg-secondary'

export function TagBadge({ tag }: { tag: string }) {
  const colorClass = TAG_COLORS[tag] ?? DEFAULT_COLOR
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', colorClass)}>
      {tag}
    </span>
  )
}
