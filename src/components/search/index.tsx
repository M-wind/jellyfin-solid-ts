import { IoSearch } from 'solid-icons/io'
import { createSignal, onCleanup, onMount } from 'solid-js'

type SearchsProps = {
  w?: string
  onClick: (v: string) => void
  onBlur?: (v: boolean) => void
  value?: string
}

const Searchs = (props: SearchsProps) => {
  let timer = 0

  const [flag, setFlag] = createSignal(false)

  const onChange = (v: string) => {
    if (flag()) return
    clearTimeout(timer)
    timer = setTimeout(() => props.onClick(v), 500)
  }

  onCleanup(() => clearTimeout(timer))

  let input: HTMLInputElement | undefined

  onMount(() => {
    if (input) input.focus()
  })

  return (
    <div class={`relative ${props.w || 'w-full'}`}>
      <input
        ref={input}
        // autofocus
        value={props.value || ''}
        onInput={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (props.onBlur) props.onBlur(false)
        }}
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
