const Loading = (props: { class: string }) => {
  return (
    <svg width='38' height='38' viewBox='0 0 38 38' class={props.class}>
      <defs>
        <linearGradient x1='8.042%' y1='0%' x2='65.682%' y2='23.865%' id='a'>
          <stop stop-color='#fff' stop-opacity='0' offset='0%' />
          <stop stop-color='#fff' stop-opacity='.631' offset='63.146%' />
          <stop stop-color='#fff' offset='100%' />
        </linearGradient>
      </defs>
      <g fill='none' fill-rule='evenodd'>
        <g transform='translate(1 1)'>
          <path d='M36 18c0-9.94-8.06-18-18-18' id='Oval-2' stroke='url(#a)' stroke-width='2'></path>
          <circle fill='#fff' cx='36' cy='18' r='1'></circle>
        </g>
      </g>
    </svg>
  )
}

const Checked = (props: { class: string }) => (
  <svg height='24' width='24' viewBox='0 0 24 24' fill='none' class={props.class}>
    <path
      d='M17.0001 9L10 16L7 13'
      stroke='var(--indicator)'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
  </svg>
)

type CicleProgressProps = {
  val?: string
  class?: string
}

const CicleProgress = (props: CicleProgressProps) => {
  const mr = 24
  const val = props.val || '5.0'
  const widht = 3
  const or = mr + 2 * widht
  const C = 2 * Math.PI * mr
  const deg = ((Number(val) * 360) / 10 / 360) * C

  return (
    <svg viewBox={`0 0 ${2 * or} ${2 * or}`} width={or * 2} height={or * 2} class={props.class}>
      <circle cx={or} cy={or} r={or} fill='#1c1c1e' />
      <circle
        cx={or}
        cy={or}
        r={mr}
        fill='#202124'
        stroke-width={widht}
        stroke='var(--indicator)'
        stroke-dasharray={`${deg} ${C}`}
        transform={`rotate(90 ${or} ${or})`}
      />
      <text x={or} y={or} dy={2} fill='#eee' text-anchor='middle' dominant-baseline='middle'>
        {val}
      </text>
    </svg>
  )
}

const Forward10 = (props: { class?: string }) => {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' class={props.class}>
      <path
        fill='currentColor'
        d='M10 12v10H8v-8H6v-2zm8 2v6c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-4 0v6h2v-6zM11.5 3c2.65 0 5.05 1 6.9 2.6L21 3v7h-7l2.62-2.62C15.23 6.22 13.46 5.5 11.5 5.5c-3.54 0-6.55 2.31-7.6 5.5l-2.37-.78C2.92 6.03 6.85 3 11.5 3'
      />
    </svg>
  )
}

const Replay10 = (props: { class?: string }) => {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' class={props.class}>
      <path
        fill='currentColor'
        d='M12.5 3c4.65 0 8.58 3.03 9.97 7.22L20.1 11c-1.05-3.19-4.06-5.5-7.6-5.5c-1.96 0-3.73.72-5.12 1.88L10 10H3V3l2.6 2.6C7.45 4 9.85 3 12.5 3M10 12v10H8v-8H6v-2zm8 2v6c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-4 0v6h2v-6z'
      />
    </svg>
  )
}

const AudioDes = (props: { class?: string }) => {
  return (
    <svg viewBox='0 0 32 32' class={props.class}>
      <path
        fill='currentColor'
        d='M 5.59375 7 L 5.28125 7.28125 C 5.28125 7.28125 2 10.601563 2 16 C 2 21.398438 5.28125 24.71875 5.28125 24.71875 L 5.59375 25 L 26.40625 25 L 26.71875 24.71875 C 26.71875 24.71875 30 21.398438 30 16 C 30 10.601563 26.71875 7.28125 26.71875 7.28125 L 26.40625 7 Z M 6.53125 9 L 25.46875 9 C 25.804688 9.355469 28 11.730469 28 16 C 28 20.269531 25.804688 22.644531 25.46875 23 L 6.53125 23 C 6.195313 22.644531 4 20.269531 4 16 C 4 11.730469 6.195313 9.355469 6.53125 9 Z M 10.375 12 L 6.375 20 L 8.625 20 L 9.125 19 L 11 19 L 11 20 L 13 20 C 15.199219 20 17 18.199219 17 16 C 17 13.800781 15.199219 12 13 12 Z M 15.96875 12 C 17.195313 12.910156 18 14.359375 18 16 C 18 17.640625 17.195313 19.089844 15.96875 20 L 18.75 20 C 19.542969 18.863281 20 17.488281 20 16 C 20 14.511719 19.542969 13.136719 18.75 12 Z M 19.90625 12 C 20.589844 13.179688 21 14.542969 21 16 C 21 17.457031 20.589844 18.820313 19.90625 20 L 22.15625 20 C 22.691406 18.773438 23 17.421875 23 16 C 23 14.578125 22.695313 13.226563 22.15625 12 Z M 23.25 12 C 23.738281 13.242188 24 14.589844 24 16 C 24 17.410156 23.738281 18.757813 23.25 20 L 25.375 20 C 25.785156 18.738281 26 17.394531 26 16 C 26 14.605469 25.785156 13.261719 25.375 12 Z M 13 14 C 14.117188 14 15 14.882813 15 16 C 15 17.117188 14.117188 18 13 18 Z M 11 15.25 L 11 17 L 10.125 17 Z'
      />
    </svg>
  )
}

export { Loading, Checked, CicleProgress, Forward10, Replay10, AudioDes }
