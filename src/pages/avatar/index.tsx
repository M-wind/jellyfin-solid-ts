import { FaSolidUser } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import MenuItem, { Items } from '../../components/menuItem'
import { useAppContext } from '../../context/AppContext'
import { logout } from '../../helper/api'
import { orginalItems } from '../base/item'

type AvatarProps = {
  onMark?: (v: boolean) => void
  mask?: boolean
  items?: Items[]
}

const Avatar = (props: AvatarProps) => {
  const { state, t, updateState } = useAppContext()

  const [open, setOpen] = createSignal(false)
  const [focus, setFocus] = createSignal(false)

  const optionOpreate = (id: Pages) => {
    switch (id) {
      case 'MarkUnplayed':
        if (props.onMark) props.onMark(false)
        break
      case 'MarkPlayed':
        if (props.onMark) props.onMark(true)
        break
      case 'Resume':
        updatePage('Title', { resume: true })
        break
      case 'MediaLibrary':
        updatePage('MediaLibrary')
        break
      case 'CodecProfile':
        updatePage('CodecProfile')
        break
      case 'Home':
        if (state.pages.length === 1) return
        updateState('pages', [{ id: 'Home', param: '' }])
        break
      case 'Logout':
        sessionStorage.removeItem('Authorization')
        logout().then((v) => {
          if (v.ok) location.reload()
        })
        break
      default:
        break
    }
  }

  const updatePage = (id: Pages, param?: any) => {
    const pages = [...state.pages]
    if (pages[pages.length - 1].id === id) return
    pages.push({ id, param })
    updateState('pages', pages)
  }

  let ref: HTMLDivElement | undefined

  return (
    <div class='flex absolute top-12 right-12 z-50 items-center'>
      <div class='relative'>
        <div
          ref={ref}
          tabIndex={-1}
          onBlur={() => {
            if (!focus()) setOpen(false)
          }}
          onClick={() => setOpen(!open())}
          class='flex relative justify-center items-center w-14 h-14 rounded-full cursor-pointer bg-component hover:bg-from-to'
        >
          <FaSolidUser class='text-2xl' />
          {/* <img src="http://192.168.1.1:8096/web/assets/img/avatar.png" class='h-14 rounded-full' /> */}
        </div>
        <MenuItem
          show={open()}
          title={t('Items')}
          mask={props.mask ?? true}
          onClick={optionOpreate}
          direction='right'
          setFocus={(v: boolean) => {
            setFocus(v)
            if (!v) ref?.focus()
          }}
          items={props.items || orginalItems(t)}
        />
      </div>
    </div>
  )
}

export default Avatar
