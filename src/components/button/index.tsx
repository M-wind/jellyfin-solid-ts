import { BiRegularLoaderAlt } from 'solid-icons/bi'
import { type JSX, Show } from 'solid-js'

type ButtonProps = {
  class?: string
  lable?: string
  icon?: JSX.Element
  onClick?: (e: MouseEvent) => void
  disabled?: boolean
  loading?: boolean
  id?: string
  title?: string
}

const Button = (props: ButtonProps) => {
  return (
    <button
      id={props.id}
      class={`flex flex-row cursor-pointer hover:bg-component-hover base-component items-center justify-center gap-4 truncate disabled:pointer-events-none disabled:bg-component-separator ${props.class || 'h-12 w-64 font-bold text-primary text-xl'}`}
      onClick={(e) => {
        if (props.onClick) {
          e.preventDefault()
          e.stopPropagation()
          props.onClick(e)
        }
      }}
      type='button'
      title={props.title}
      disabled={props.disabled || props.loading}
    >
      <Show when={props.loading} fallback={props.icon}>
        <BiRegularLoaderAlt class='animate-spin' />
      </Show>
      <Show when={props.lable}>{props.lable}</Show>
    </button>
  )
}

export default Button
