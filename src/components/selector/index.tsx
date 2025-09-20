import { FaSolidAngleDown, FaSolidCheck } from 'solid-icons/fa'
import { For, Show, batch, createSignal } from 'solid-js'

type SelectProps<T> = {
  disabled?: boolean
  readonly?: boolean
  data?: SelectorDataType<T>[]
  default?: T
  id?: string
  w?: string
  onSelect?: (val: SelectorDataType<T>, id?: string) => void
}

const findDefault = <T,>(data: SelectorDataType<T>[] | undefined, d: T) => {
  return data?.find((v) => v.Value === d)
}

const Selector = <T,>(props: SelectProps<T>) => {
  const [selected, setSelected] = createSignal(findDefault(props.data, props.default))

  const [fVal, setFVal] = createSignal(props.data)

  const [show, setShow] = createSignal(false)

  const fetchVal = (val: string) => {
    const v = props.data?.filter((v) => v.Name.toLowerCase().indexOf(val.toLowerCase()) !== -1)
    setFVal(v)
  }

  const upSelect = (val: SelectorDataType<T>) => {
    if (val.Value === selected()?.Value) return
    setSelected(val)
    if (props.onSelect) props.onSelect(val, props.id)
    setShow(false)
  }

  return (
    <div class={`relative mt-1 ${props.w || 'w-full'}`}>
      <input
        class='py-3 pr-10 pl-6 w-full cursor-pointer disabled:cursor-default base-component disabled:brightness-75'
        readonly={props.readonly}
        disabled={props.disabled}
        value={selected()?.Name}
        // onFocus={() => setShow(true)}
        onBlur={() => {
          batch(() => {
            setShow(false)
            setFVal(props.data)
          })
        }}
        onClick={() => setShow(!show())}
        onChange={(e) => fetchVal(e.target.value)}
      />
      <button
        type='button'
        class='flex absolute inset-y-0 right-0 items-center pr-4 ml-3 pointer-events-none'
      >
        <FaSolidAngleDown />
      </button>
      <Show when={show()}>
        <ul class='overflow-y-auto absolute z-50 py-1 mt-1 w-full max-h-64 rounded-md shadow-lg bg-component min-h-12 scrollbar-0'>
          <For each={fVal()}>
            {(v) => (
              <li
                class='relative py-2 pr-9 pl-3 cursor-pointer select-none hover:bg-component-hover'
                onMouseDown={() => upSelect(v)}
              >
                <div class='flex items-center ml-3 font-normal truncate'>
                  {v.Name === '' ? <>&emsp;</> : v.Name}
                </div>
                <Show when={v.Value === selected()?.Value}>
                  <span class='flex absolute inset-y-0 right-0 items-center pr-4'>
                    <FaSolidCheck class='text-primary' />
                  </span>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  )
}

export default Selector
