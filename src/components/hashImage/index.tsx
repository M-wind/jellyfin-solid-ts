import { decodeBlurHash } from 'fast-blurhash'
import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

type HashImageProps = {
  hash: string
  class?: string
  url?: string
  onClick?: () => void
}

const HashImage = (props: HashImageProps) => {
  const getHashImage = () => {
    const width = 5
    const height = 5
    const pixels = decodeBlurHash(props.hash, width, height)
    const ctx = canvas?.getContext('2d')!
    canvas!.width = 5
    canvas!.height = 5
    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
  }

  const [hide, setHide] = createSignal('')
  const [open, setOpen] = createStore({
    img: false,
    // canvas: true,
  })

  let canvas: HTMLCanvasElement | undefined
  let div: HTMLDivElement | undefined

  const o = new IntersectionObserver(
    (eles) => {
      const c = eles[0]
      if (c.isIntersecting) {
        getHashImage()
        if (props.url) {
          setOpen('img', true)
        }
        o.disconnect()
      }
    },
    { rootMargin: '0px 100% 0px 0px' },
  )

  onMount(() => {
    if (canvas) o.observe(canvas)
  })

  onCleanup(() => o.disconnect())

  return (
    <div
      class={`${props.class} relative shrink-0`}
      ref={div}
      onClick={() => {
        if (props.onClick) props.onClick()
      }}
    >
      <Show when={open.img}>
        <img
          class={`${props.class} h-full object-cover`}
          alt=''
          onLoad={() => setHide('opacity-0')}
          src={props.url}
          tabIndex={-1}
        />
      </Show>
      <canvas
        ref={canvas}
        class={`absolute ${props.class} h-full ${hide()} duration-500 ease-linear left-0 top-0`}
        // onTransitionEnd={() => {
        //   if (props.url) setOpen('canvas', false)
        // }}
      ></canvas>
    </div>
  )
}

export default HashImage
