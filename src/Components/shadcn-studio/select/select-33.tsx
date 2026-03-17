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
    <div className='w-full max-w-45 space-y-2'>
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
    </div>
  )
}

export default MultipleSelectWithPlaceholderDemo
