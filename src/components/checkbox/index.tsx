import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { FaSolidAngleDown, FaSolidAngleUp } from 'solid-icons/fa'
import { For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'

interface CheckBoxProps {
  id: string
  checked: boolean
  onChecked: (val: boolean, id: string) => void
}

const CheckBox = ({ id, checked = false, onChecked }: CheckBoxProps) => {
  if (id === undefined) throw 'ID is required!'
  return (
    <input
      type='checkbox'
      id={id}
      checked={checked}
      class='w-5 h-5 cursor-pointer rounded-md border appearance-none border-holder bg-component checked-style'
      onChange={(e) => onChecked(e.target.checked, id)}
    />
  )
}

interface CheckBoxWithLabelProps extends CheckBoxProps {
  title: string
  order?: boolean
  w?: string
  onOrdered?: (index: number) => void
  index?: number
}

const CheckBoxWithLabel = (props: CheckBoxWithLabelProps) => {
  return (
    <div
      class={`border-component-separator flex flex-row items-center ${props.w || 'w-full'} border-b min-h-12`}
    >
      <div class='flex flex-row space-x-2 w-5/6'>
        <CheckBox id={props.id} checked={props.checked} onChecked={props.onChecked} />
        <p class='text-sm'>{props.title}</p>
      </div>
      <Show when={props.order}>
        <div class='w-1/6 flex justify-end pr-4'>
          <button
            type='button'
            class='hover:text-primary cursor-pointer'
            onClick={() => props.onOrdered!(props.index!)}
          >
            {props.index === 0 ? <FaSolidAngleDown /> : <FaSolidAngleUp />}
          </button>
        </div>
      </Show>
    </div>
  )
}

type CheckBoxWithLabelOrderProps = {
  key: string
  arr: ToggleDataType[]
  w?: string
  ordered: (val: string[], id: string) => void
  checked: (val: string[], id: string) => void
}

const CheckBoxWithLabelOrder = ({ key, arr, w, ordered, checked }: CheckBoxWithLabelOrderProps) => {
  const [parent] = createAutoAnimate()
  const [state, setState] = createStore({
    o: arr,
    d: arr,
  })

  const onChecked = (check: boolean, id: string) => {
    setState('d', (v) => v.Name === id, 'DefaultEnabled', check)
    const data = state.d.reduce<string[]>((pre, cur) => {
      if (cur.DefaultEnabled) pre.push(cur.Name)
      return pre
    }, [])
    checked(data, id)
  }

  const onOrdered = (index: number) => {
    const data = [...state.o]
    const arr = [index, index]
    if (index === 0) {
      arr[1] = index + 1
    } else {
      arr[0] = index - 1
    }
    data[arr[0]] = data.splice(arr[1], 1, data[arr[0]])[0]
    setState('o', () => data)
    const d = state.o.reduce<string[]>((pre, cur) => {
      pre.push(cur.Name)
      return pre
    }, [])
    ordered(d, key)
  }

  return (
    <div ref={parent}>
      <For each={state.o}>
        {(v, i) => (
          <CheckBoxWithLabel
            id={v.Name}
            title={v.Name}
            checked={v.DefaultEnabled}
            w={w}
            order={arr.length > 1}
            onChecked={onChecked}
            onOrdered={onOrdered}
            index={i()}
          />
        )}
      </For>
    </div>
  )
}

export { CheckBox, CheckBoxWithLabel, CheckBoxWithLabelOrder }
