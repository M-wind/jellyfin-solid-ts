import { SiJellyfin } from 'solid-icons/si'
import { For, type JSX, Show } from 'solid-js'

export type Items = {
  id: Pages
  lable: string
  icon: JSX.Element
}

type MenuItemProps = {
  show: boolean
  title: string
  items: Items[]
  mask?: boolean
  direction?: 'left' | 'right'
  onClick: (id: Pages) => void
  setFocus?: (v: boolean) => void
}

const MenuItem = (props: MenuItemProps) => {
  const onFocus = (v: boolean) => {
    if (props.setFocus) props.setFocus(v)
  }

  return (
    <Show when={props.show}>
      <Show when={props.mask}>
        <div class='fixed top-0 left-0 w-full h-full -z-50 animate-fadeIn bg-black/50 shadow-half' />
      </Show>
      <div
        class={`angle-up relative ${props.direction === 'right' ? 'left-angle-center' : 'ml-11'} mt-2`}
      />
      <div
        class={`shadow-lg bg-component absolute animate-fadeIn ${
          props.direction === 'right' ? 'right-0' : ''
        } z-50 w-72 rounded-xl`}
      >
        <ul class='py-3'>
          <li class='flex relative flex-row justify-between items-center px-6 h-14 border-b select-none border-component'>
            <div class='text-2xl font-semibold text-primary'>{props.title}</div>
            <SiJellyfin class='text-2xl text-primary' />
          </li>
          <For each={props.items}>
            {(item) => (
              <li
                id={item.id}
                onMouseDown={() => {
                  if (item.id !== 'Filter') props.onClick(item.id)
                }}
                onMouseEnter={() => {
                  if (item.id === 'Filter') onFocus(true)
                }}
                onMouseLeave={() => {
                  if (item.id === 'Filter') onFocus(false)
                }}
                class={`flex flex-row justify-between items-center px-6 h-14 ${item.id === 'Filter' ? '' : 'cursor-pointer'} select-none hover:bg-from-to`}
              >
                <div class='text-xl font-medium'>{item.lable}</div>
                {item.icon}
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  )
}

export default MenuItem
