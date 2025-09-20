import type { JSX } from 'solid-js'

type OsdButtonProps = {
  onClick: () => void
  icon: JSX.Element
  title: string
}

const OsdButton = (props: OsdButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      title={props.title}
      class='disable-default cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-white/10 duration-300 ease-in hover:bg-primary'
      type='button'
    >
      {props.icon}
    </button>
  )
}

export default OsdButton

//libassjs-canvas-parent  libassjs-canvas
// display: block; position: absolute; width: 1258px; height: 708px; top: 0px; left: 299px; pointer-events: none;
