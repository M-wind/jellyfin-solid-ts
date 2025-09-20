import { Loading } from '../svg'

const ScreenLoading = (props: { bg?: string }) => {
  return (
    <div class={`absolute left-0 top-0 flex h-full w-full items-center justify-center ${props.bg}`}>
      <Loading class='w-48 h-48 animate-spin' />
    </div>
  )
}

export default ScreenLoading
