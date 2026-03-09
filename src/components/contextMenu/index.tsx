import { type JSX, Show, batch } from 'solid-js'
import { createMutable } from 'solid-js/store'

type MenuProps = {
  menuId: string
  children: JSX.Element
}

type ItemProps<T> = {
  onClick?: (id?: string, data?: T) => void
  id?: string
  disabled?: boolean
  class?: string
  children?: JSX.Element
}

type MenuState<T> = {
  position: {
    x: number
    y: number
  }
  visible: boolean
  data?: T
  id: string
}

const useContextMenu = <T,>() => {
  const state = createMutable<MenuState<T>>({
    position: { x: 0, y: 0 },
    visible: false,
    id: '',
  })

  const show = (e: MouseEvent, id: string, val?: T) => {
    batch(() => {
      state.id = id
      state.visible = true
      state.data = val
    })
    const Wrapper = document.getElementById(id)!
    Wrapper.focus()
    const childX = Wrapper.offsetWidth
    const childY = Wrapper.offsetHeight
    const { clientX, clientY } = e
    const x = window.innerWidth - (clientX + childX) > 10 ? clientX : clientX - childX
    const y = window.innerHeight - (clientY + childY) > 10 ? clientY : clientY - childY
    state.position = { x, y }
  }

  const hide = () => (state.visible = false)

  const Menu = (props: MenuProps) => (
    <Show when={state.visible && state.id === props.menuId}>
      <div
        id={props.menuId}
        class='fixed z-50 py-1 rounded-md border-component-separator bg-component min-w-48'
        style={{
          top: `${state.position.y}px`,
          left: `${state.position.x}px`,
        }}
        tabIndex={-1}
        onBlur={hide}
      >
        {props.children}
      </div>
    </Show>
  )

  const Item = (props: ItemProps<T>) => (
    <div
      id={props.id}
      class={`flex h-10 cursor-pointer flex-row hover:bg-component-hover items-center gap-3 pl-3 ${
        props.disabled ? 'cursor-default opacity-50' : ''
      } ${props.class}`}
      onClick={(e) => {
        if (props.onClick && !props.disabled) {
          e.preventDefault()
          e.stopPropagation()
          hide()
          props.onClick(props.id, state.data)
        }
      }}
    >
      {props.children}
    </div>
  )

  return { show, hide, Menu, Item }
}

export default useContextMenu
