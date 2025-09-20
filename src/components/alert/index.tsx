import { Show, createSignal, onCleanup } from 'solid-js'
import { render } from 'solid-js/web'

type AlertProps = {
  type: 'error' | 'success' | 'info'
  msg: string
}

const Alert = (props: AlertProps) => {
  const [show, setShow] = createSignal(true)
  const types = {
    error: 'bg-component border-error text-error',
    success: 'bg-component border-success text-success',
    info: 'bg-component border-primary text-primary',
  }
  const timer = setTimeout(() => setShow(false), 3500)

  onCleanup(() => clearTimeout(timer))

  return (
    <Show when={show()}>
      <div
        class={`animate-slideInRight min-h-16 absolute right-0 top-32 z-50 flex w-72 items-center ${
          types[props.type]
        } border-l-4 p-3`}
      >
        {props.msg}
      </div>
    </Show>
  )
}

const useAlert = (msg: string, type?: 'error' | 'success' | 'info') => {
  render(() => <Alert msg={msg} type={type || 'info'} />, document.getElementById('YXBw')!)
}

export default useAlert
