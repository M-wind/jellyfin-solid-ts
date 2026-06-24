import { type JSX, batch, createEffect, createMemo, on, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'

type Options = {
  scroll: boolean
  cur: number
  nodeInfo: {
    left: number
    width: number
    index: number
  }[]
  prev: boolean
  next: boolean
}

enum Direction {
  LEFT = 0,
  RIGHT = 1,
}

type CarouselWrapperArgs = {
  padding?: number
  mode?: 'mutex' | 'both'
}

const CarouselWrapper = (props?: CarouselWrapperArgs) => {
  const padding = props?.padding || 8
  const mode = props?.mode || 'both'

  const [carouselOption, setOption] = createStore<Options>({
    scroll: false,
    cur: 0,
    nodeInfo: [],
    prev: true,
    next: false,
  })
  let imgs: HTMLDivElement | undefined

  const disable = () => {
    if (carouselOption.cur === 0) {
      batch(() => {
        setOption('prev', true)
        setOption('next', false)
      })
      return
    }
    const last = carouselOption.nodeInfo[carouselOption.nodeInfo.length - 1]
    const cur = carouselOption.nodeInfo[carouselOption.cur]
    const width = imgs!.clientWidth
    if (cur.left - padding + width >= last.left + last.width) {
      batch(() => {
        setOption('next', true)
        setOption('prev', false)
      })
      return
    }
    if (mode === 'both')
      batch(() => {
        setOption('next', false)
        setOption('prev', false)
      })
  }

  const needScroll = () => {
    batch(() => {
      getNodeInfo()
      disable()
      setOption('scroll', imgs?.clientWidth !== imgs?.scrollWidth)
    })
  }

  const getNodeInfo = () => {
    const childNodes = imgs?.childNodes
    const nodeInfo: {
      left: number
      width: number
      index: number
    }[] = []
    childNodes?.forEach((v, i) => {
      const h = v as HTMLStyleElement
      nodeInfo.push({
        left: h.offsetLeft,
        width: h.offsetWidth,
        index: i,
      })
    })
    setOption('nodeInfo', nodeInfo)
  }

  const rightScroll = () => {
    let to = carouselOption.nodeInfo[carouselOption.cur]
    const distance = to.left - padding + imgs!.clientWidth
    for (let i = carouselOption.cur + 1; i < carouselOption.nodeInfo.length; i++) {
      const c = carouselOption.nodeInfo[i]
      if (c.left + c.width > distance) {
        to = c
        break
      }
    }
    return to
  }

  const leftScroll = () => {
    let to = carouselOption.nodeInfo[carouselOption.cur]
    const distance = to.left - padding - imgs!.clientWidth
    if (distance <= 0) return carouselOption.nodeInfo[0]
    for (let i = carouselOption.cur - 1; i >= 0; i--) {
      const c = carouselOption.nodeInfo[i]
      if (c.left - c.width - padding * 2 < distance) {
        to = c
        break
      }
    }
    return to
  }

  const scrollT = (direction: Direction) => {
    const to = direction === Direction.LEFT ? leftScroll() : rightScroll()
    imgs?.scrollTo({
      top: 0,
      left: to.left - padding,
      behavior: 'smooth',
    })
    setOption('cur', to.index)
    disable()
  }

  const scrollToPosition = (index: number, behavior?: ScrollBehavior) => {
    const node = carouselOption.nodeInfo[index]
    imgs?.scrollTo({
      top: 0,
      left: node.left - padding,
      behavior: behavior || 'smooth',
    })
    setOption('cur', index)
    disable()
  }

  const Carousel = (props: { children: JSX.Element; class: string; length?: number }) => {
    onCleanup(() => {
      // clearTimeout(timer)
      resizeObserver.disconnect()
    })

    const resizeObserver = new ResizeObserver(() => {
      // clearTimeout(timer)
      // timer = setTimeout(needScroll, 100)
      needScroll()
      if (carouselOption.nodeInfo.length !== 0) {
        // setTimeout(() => scrollToPosition(carouselOption.cur), 500)
        scrollToPosition(carouselOption.cur)
      }
    })

    // onMount(() => {
    //   if (imgs) resizeObserver.observe(imgs)
    // })

    createEffect(
      on(
        createMemo(() => props.length),
        () => {
          resizeObserver.disconnect()
          setOption('cur', 0)
          if (imgs) resizeObserver.observe(imgs)
        },
      ),
    )

    return (
      <div class={props.class} ref={imgs}>
        {props.children}
      </div>
    )
  }

  return { Carousel, scrollT, carouselOption, scrollToPosition, needScroll, setOption }
}

export default CarouselWrapper
