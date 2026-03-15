import { Label } from '@/components/ui/label'
import type { Option } from '@/components/ui/multi-select'
import MultipleSelector from '@/components/ui/multi-select'

const categories: Option[] = [
  {
    value: 'punctuation',
    label: 'punctuation'
  },
  {
    value: 'numbers',
    label: 'numbers'
  }
]


type Props = {
  value: Option[]
  onChange: (options: Option[]) => void
}


const MultipleSelectWithPlaceholderDemo = ({ value, onChange }: Props) => {
  return (
    <div className='w-full max-w-xs space-y-2'>
      {/* <Label>Multiselect with placeholder and clear</Label> */}

      <MultipleSelector
        commandProps={{
          label: 'Select categories'
        }}
        defaultOptions={categories}
        placeholder='Select categories'
        emptyIndicator={<p className='text-center text-sm'>All configurations applied</p>}

        value={value}
        onChange={(onChange)}
        className='w-full'
      />
      <p className='text-muted-foreground text-xs' role='region' aria-live='polite'>
        Inspired by{' '}
        <a
          // href='https://shadcnui-expansions.typeart.cc/docs/multiple-selector'
          className='hover:text-primary underline'
          target='_blank'
        >
          shadcn/ui expressions
        </a>
      </p>
    </div>
  )
}

export default MultipleSelectWithPlaceholderDemo
