import { createSignal, For } from 'solid-js'
import { createStore } from 'solid-js/store'

interface ToggleProps<T> {
  id: T
  checked?: boolean
  onChecked: (val: boolean, id: T) => void
}

const Toggle = <T,>(props: ToggleProps<T>) => {
  const [checked, setChecked] = createSignal(props.checked ?? false)

  const onChecked = () => {
    setChecked(!checked())
    props.onChecked(checked(), props.id)
  }

  return (
    <div class='flex items-center w-10 h-4 rounded-full bg-component-hover'>
      {/* <input
        type='checkbox'
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onChecked(e.target.checked, props.id)}
        class='absolute right-5 w-5 h-5 rounded-full border duration-200 ease-in appearance-none cursor-pointer border-holder bg-component-hover checked-style'
      />
      <label for={props.id} class='block overflow-hidden h-5 rounded-full bg-component' /> */}
      <div
        class={`w-5 h-5 rounded-full cursor-pointer duration-300 border border-holder bg-component ${checked() ? 'translate-x-5 bg-success checked-bg border-0' : ''}`}
        onClick={onChecked}
      />
    </div>
  )
}

interface ToggleLabelProps<T> extends ToggleProps<T> {
  title: string
  description?: string
  w?: string
}

const ToggleLabel = <T,>(props: ToggleLabelProps<T>) => (
  <div
    class={`border-component-separator flex flex-row justify-between items-center ${props.w || 'w-full'} border-b min-h-12`}
  >
    <div class='flex flex-col w-5/6'>
      <p class='text-sm'>{props.title}</p>
      <p class='text-sm text-minor'>{props.description}</p>
    </div>
    <Toggle id={props.id} checked={props.checked} onChecked={props.onChecked} />
  </div>
)

type ToggleLabelArrProps = {
  key?: string
  arr: ToggleDataType[]
  w?: string
  onChecked: (val: string[], id?: string) => void
}

const ToggleLabelArr = (props: ToggleLabelArrProps) => {
  const [state, setState] = createStore(props.arr)

  const onChecked = (val: boolean, id: string) => {
    setState((v) => v.Name === id, 'DefaultEnabled', val)
    const d = state.reduce<string[]>((pre, cur) => {
      if (cur.DefaultEnabled) pre.push(cur.Name)
      return pre
    }, [])
    props.onChecked(d, props.key)
  }

  return (
    <For each={state}>
      {(v) => (
        <ToggleLabel
          id={v.Name}
          title={v.Name}
          w={props.w}
          checked={v.DefaultEnabled}
          onChecked={onChecked}
        />
      )}
    </For>
  )
}

export { Toggle, ToggleLabel, ToggleLabelArr }
