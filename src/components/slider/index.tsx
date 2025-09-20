import { type JSX, batch, createContext, onCleanup, useContext } from 'solid-js'
import { type SetStoreFunction, createStore } from 'solid-js/store'

type SliderProps = {
  children: JSX.Element
  max?: number
  onChange?: (v: number) => void
  class?: string
  value?: number
}

type State = {
  max: number
  x: number
  drag: boolean
}

const SliderContext = createContext<{
  state: State
  setState: SetStoreFunction<State>
  percent: () => number
  dragPer: (v: number) => number
  onChange?: (v: number) => void
}>()
// 3x20 07:38
const Slider = (props: SliderProps) => {
  const [state, setState] = createStore<State>({
    max: props.max || 0,
    drag: false,
    x: 0,
  })
  let track: HTMLDivElement | undefined

  const percent = () => (props.value && props.max ? props.value / props.max : 0)

  const getPercent = (v: number) => {
    const { width, left } = track!.getBoundingClientRect()
    const position = Math.min(Math.max(v - left, 0), width)
    return position / width
  }

  const context = {
    state,
    setState,
    percent,
    dragPer: getPercent,
    onChange: props.onChange,
  }

  return (
    <SliderContext.Provider value={context}>
      <div
        ref={track}
        onclick={(e) => {
          if (state.drag || !props.onChange) return
          props.onChange(Math.round(getPercent(e.clientX) * state.max))
        }}
        class={`relative flex w-full translate-x-0 cursor-pointer items-center rounded-full bg-white/15 ${
          props.class || 'h-2'
        }`}
      >
        {props.children}
      </div>
    </SliderContext.Provider>
  )
}

const useSliderContext = () => {
  const context = useContext(SliderContext)
  if (context === undefined) throw 'useSliderContext: cannot find a SliderContext'
  return context
}

type SliderTrackProps = {
  class?: string
}
const SliderTrack = (props: SliderTrackProps) => {
  const { state, percent, dragPer } = useSliderContext()
  return (
    <div
      class={`pointer-events-none absolute h-full rounded-full ${props.class || 'bg-white/25'}`}
      style={`width: calc(${(state.drag ? dragPer(state.x) : percent()) * 100}%)`}
    />
  )
}

type SliderTrackIndicatorProps = {
  class?: string
  value?: number
}
const SliderTrackIndicator = (props: SliderTrackIndicatorProps) => {
  const { state } = useSliderContext()

  const value = () => props.value || 0

  return (
    <div
      class={`pointer-events-none absolute h-full rounded-full ${props.class || 'bg-white/25'}`}
      style={`width: calc(${value() / state.max > 1 ? 100 : (value() / state.max) * 100}%)`}
    />
  )
}

type SliderThumbProps = {
  class?: string
  size?: string
}

const SliderThumb = (props: SliderThumbProps) => {
  const { state, percent, dragPer, setState, onChange } = useSliderContext()
  let timer = 0
  onCleanup(() => clearTimeout(timer))
  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)
        batch(() => {
          setState('x', e.clientX)
          setState('drag', true)
        })
      }}
      onPointerMove={(e) => {
        e.stopPropagation()
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          setState('x', e.clientX)
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId)
          if (onChange) onChange(Math.round(dragPer(state.x) * state.max))
          timer = setTimeout(() => setState('drag', false), 100)
        }
      }}
      class={`absolute rounded-full bg-white ${props.class || 'h-4 w-4'}`}
      style={`left: calc(${(state.drag ? dragPer(state.x) : percent()) * 100}% - ${
        props.size || '8px'
      })`}
    />
  )
}

export { Slider, SliderThumb, SliderTrack, SliderTrackIndicator }
