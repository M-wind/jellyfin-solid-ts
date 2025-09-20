import { IoSearch } from 'solid-icons/io'
import { createSignal, onCleanup } from 'solid-js'

type SearchsProps = {
  w?: string
  onClick: (v: string) => void
}

const Searchs = (props: SearchsProps) => {
  const timer = 0

  const [flag, setFlag] = createSignal(false)

  const onChange = (v: string) => {
    if (v === '' || flag()) return
    clearTimeout(timer)
    setTimeout(() => props.onClick(v), 500)
  }

  onCleanup(() => clearTimeout(timer))

  return (
    <div class={`relative ${props.w || 'w-full'}`}>
      <input
        autofocus
        onInput={(e) => onChange(e.target.value)}
        onCompositionStart={() => setFlag(true)}
        onCompositionEnd={() => setFlag(false)}
        class='pl-11 w-full h-14 rounded-full border border-secondary/50 disable-default focus:border-primary'
      />
      <button type='button' class='flex absolute inset-y-0 left-3 items-center'>
        <IoSearch class='text-2xl text-primary' />
      </button>
    </div>
  )
}

export default Searchs
