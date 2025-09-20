import { IoReturnUpBack } from 'solid-icons/io'
import { useAppContext } from '../../context/AppContext'

type BackProps = {
  onBack?: () => void
}

const Back = (props: BackProps) => {
  const { state, updateState } = useAppContext()
  const onBack = () => {
    if (props.onBack) {
      props.onBack()
      return
    }
    const pages = [...state.pages]
    pages.pop()
    updateState('pages', pages)
  }

  return (
    <div class='absolute left-[5%] top-12 z-50 flex items-center'>
      <button
        onClick={onBack}
        title=''
        type='button'
        class='flex justify-center items-center w-28 h-14 text-5xl appearance-none cursor-pointer outline-none rounded-[2rem] bg-white/10 hover:bg-from-to focus:bg-from-to'
      >
        <IoReturnUpBack />
      </button>
    </div>
  )
}

export default Back
