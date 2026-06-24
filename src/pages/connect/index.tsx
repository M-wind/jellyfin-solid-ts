import { createSignal, onMount, Show } from 'solid-js'
import useAlert from '../../components/alert'
import { useAppContext } from '../../context/AppContext'
import { getSystemInfoPublic, initConfig } from '../../helper/api'
import { initAuth } from '../../helper/utils'
import Button from '../../components/button'

const Connect = () => {
  const { state, updateState, t } = useAppContext()

  const [skip, setSkip] = createSignal(true)
  const [url, setUrl] = createSignal('')

  onMount(() => {
    const address = sessionStorage.getItem('BaseUrl')
    if (address) {
      load(address)
    } else {
      setSkip(false)
    }
  })

  const load = async (url: string) => {
    try {
      const data = await getSystemInfoPublic(url)
      const token = initAuth(state.uuid, data.Version)
      initConfig(data.LocalAddress, token)
      if (!data.StartupWizardCompleted) {
        updateState('route', 'wizard')
        return
      }
      updateState('route', 'login')
    } catch (error) {
      setSkip(false)
      useAlert(t('HeaderConnectionFailure'), 'error')
    }
  }

  return (
    <Show when={!skip()}>
      <div class='flex flex-col w-full h-full'>
        <img src={state.bgUrl} class='absolute z-0 w-full h-full brightness-50 bg-center bg-cover' alt='' />
        <div class='flex z-20 flex-col gap-6 justify-center items-center w-full h-full'>
          <input
            autofocus
            placeholder={t('TabServer')}
            class='px-2 w-80 h-12 rounded-xl border border-primary disable-default focus:border-primary'
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            class='w-72 h-12 text-lg font-bold text-primary'
            lable={t('Connect')}
            onClick={() => load(url())}
          />
        </div>
      </div>
    </Show>
  )
}

export default Connect
