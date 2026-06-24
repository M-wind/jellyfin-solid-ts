import { batch, createSignal } from 'solid-js'
import useAlert from '../../components/alert'
import Button from '../../components/button'
import { useAppContext } from '../../context/AppContext'
import { authByUserName, getBaseUrl, getUserViews, updateAuth } from '../../helper/api'

const Login = () => {
  const { state, updateState, t } = useAppContext()

  const [uname, setUname] = createSignal('')
  const [pwd, setPwd] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const login = async () => {
    try {
      setLoading(true)
      const data = await authByUserName(uname(), pwd())
      const authorization = updateAuth(data.AccessToken)
      const userId = data.User.Id
      const views = await getUserViews(userId)
      if (views.TotalRecordCount === 0) {
        batch(() => {
          const pages = [...state.pages]
          pages.push({ id: 'MediaLibrary' })
          updateState('pages', pages)
          updateState('route', 'home')
          updateState('userId', userId)
        })
        return
      }
      batch(() => {
        updateState('route', 'home')
        updateState('userId', userId)
      })
      sessionStorage.setItem('UserId', userId)
      sessionStorage.setItem('Authorization', authorization)
      sessionStorage.setItem('BaseUrl', getBaseUrl())
      setLoading(false)
    } catch (error) {
      useAlert(t('MessageInvalidUser'), 'error')
      setLoading(false)
    }
  }

  return (
    <div class='flex flex-col justify-center items-center w-full h-full'>
      <img src={state.bgUrl} class='absolute z-0 w-full h-full brightness-50' alt='' />
      {/* <div class='absolute top-0 left-0 w-full h-full shadow-play' /> */}
      <div class='flex flex-col'>
        <div class='flex justify-center'>
          <img src='./img/logo.png' class='z-20' alt='' />
        </div>
        <div class='flex z-20 flex-col gap-6 items-center mt-16'>
          <input
            type='text'
            placeholder={t('LabelUsername')}
            class='px-2 w-72 h-12 border-b disable-default border-holder focus:border-primary'
            onChange={(e) => setUname(e.target.value)}
          />
          <input
            type='password'
            placeholder={t('LabelPassword')}
            class='px-2 w-72 h-12 border-b disable-default border-holder focus:border-primary'
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button
            class='w-72 h-12 text-lg font-bold text-primary'
            lable={t('Connect')}
            onClick={login}
            loading={loading()}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
