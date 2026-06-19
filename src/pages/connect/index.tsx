import { onMount } from 'solid-js'
import useAlert from '../../components/alert'
import { useAppContext } from '../../context/AppContext'
import { getSystemInfoPublic, initConfig } from '../../helper/api'
import { initAuth } from '../../helper/utils'

const Connect = () => {
  const { state, updateState, t } = useAppContext()

  onMount(async () => {
    try {
      // const address = 'http://localhost:8096'
      const address = window.location.origin
      const data = await getSystemInfoPublic(address)
      const token = initAuth(state.uuid, data.Version)
      initConfig(data.LocalAddress, token)
      if (!data.StartupWizardCompleted) {
        updateState('route', 'wizard')
        return
      }
      updateState('route', 'login')
    } catch (error) {
      useAlert(t('HeaderConnectionFailure'), 'error')
    }
  })

  return <></>
}

export default Connect
