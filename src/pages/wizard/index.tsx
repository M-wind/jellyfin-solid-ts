import { FaSolidPlus } from 'solid-icons/fa'
import { Show, createResource, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import useAlert from '../../components/alert'
import Button from '../../components/button'
import Selector from '../../components/selector'
import { useAppContext } from '../../context/AppContext'
import {
  getCountry,
  getCulture,
  getLanguage,
  getStarupUser,
  getWizardCongiguration,
  startupComplete,
  startupConfiguration,
  startupRemoteAccess,
  startupUser,
} from '../../helper/api'
import MediaLibrary from '../mediaLibrary'

type WizardConf = {
  startupConfiguration: StartUpConfiguration
  startupUser: StartupUser
  PasswordConfirm: string
}

const Wizard = () => {
  const { state, updateState, t } = useAppContext()

  const [wizardConf, setWizardConf] = createStore<WizardConf>({
    startupConfiguration: {
      UICulture: '',
      MetadataCountryCode: '',
      PreferredMetadataLanguage: '',
    },
    startupUser: {
      Name: '',
      Password: '',
    },
    PasswordConfirm: '',
  })

  const [langs] = createResource(getLanguage)
  const [culture] = createResource(getCulture)
  const [country] = createResource(getCountry)
  const [configuration] = createResource<StartUpConfiguration>(async () => {
    const data = await getWizardCongiguration()
    setWizardConf('startupConfiguration', data)
    return data
  })

  const onSelect = (val: SelectorDataType<string>, id?: string) => {
    switch (id) {
      case 'lang':
        updateState('lang', val.Value)
        localStorage.setItem('lang', val.Value)
        setWizardConf('startupConfiguration', 'UICulture', val.Value)
        break
      case 'culture':
        setWizardConf('startupConfiguration', 'PreferredMetadataLanguage', val.Value)
        break
      case 'country':
        setWizardConf('startupConfiguration', 'MetadataCountryCode', val.Value)
        break
      default:
        break
    }
  }

  const onInputChange = (v: string, id?: string) => {
    switch (id) {
      case 'name':
        setWizardConf('startupUser', 'Name', v)
        break
      case 'password':
        setWizardConf('startupUser', 'Password', v)
        break
      case 'passwordConfirm':
        setWizardConf('PasswordConfirm', v)
        break
      default:
        break
    }
  }

  const [open, setOpen] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  const wizardComplete = async () => {
    if (wizardConf.startupUser.Name === '' || wizardConf.startupUser.Password === '') {
      useAlert(t('MessageInvalidUser'), 'error')
      return
    }
    if (wizardConf.startupUser.Password !== wizardConf.PasswordConfirm) {
      useAlert(t('PasswordMatchError'), 'error')
      return
    }
    setLoading(true)
    let status = await getStarupUser()
    if (status !== 200) {
      useAlert(t('ErrorDefault'), 'error')
      return
    }
    status = await startupUser(wizardConf.startupUser)
    if (status !== 204) {
      useAlert(t('ErrorDefault'), 'error')
      return
    }
    const completing = []
    completing.push(startupConfiguration(wizardConf.startupConfiguration))
    completing.push(startupRemoteAccess())
    completing.push(startupComplete())
    await Promise.all(completing)
    // await startupComplete()
    setLoading(false)
    updateState('route', 'login')
  }

  return (
    <Show when={!open()} fallback={<MediaLibrary onBack={() => setOpen(false)} />}>
      <div class='flex absolute top-16 right-16 bottom-16 left-16 flex-col gap-16 animate-fadeIn'>
        <div class='flex justify-center text-5xl text-highlight font-ty'>{t('WelcomeToProject')}</div>
        <div class='grid grid-cols-3 auto-rows-auto gap-16 max-md:grid-cols-1'>
          <div class='flex flex-col gap-4 w-full min-w-72'>
            <div class='flex justify-center text-2xl font-bold'>{t('MediaInfoLanguage')}</div>
            <Show when={langs.state === 'ready'}>
              <div>
                <div class='text-minor'>{t('LabelPreferredDisplayLanguage')}</div>
                <Selector id='lang' default={state.lang} data={langs()} onSelect={onSelect} />
              </div>
            </Show>
            <Show when={culture.state === 'ready' && configuration.state === 'ready'}>
              <div>
                <div class='text-minor'>{t('HeaderPreferredMetadataLanguage')}</div>
                <Selector
                  id='culture'
                  default={configuration()?.PreferredMetadataLanguage}
                  data={culture()}
                  onSelect={onSelect}
                />
              </div>
            </Show>
            <Show when={country.state === 'ready' && configuration.state === 'ready'}>
              <div>
                <div class='text-minor'>{t('LabelCountry')}</div>
                <Selector
                  id='country'
                  default={configuration()?.MetadataCountryCode}
                  data={country()}
                  onSelect={onSelect}
                />
              </div>
            </Show>
          </div>
          <div class='flex flex-col gap-4 w-full min-w-72'>
            <div class='flex justify-center text-2xl font-bold'>{t('HeaderUser')}</div>
            <div>
              <div class='text-minor'>{t('LabelUsername')}</div>
              <input
                class='py-3 pr-10 pl-6 mt-1 w-full base-component'
                onChange={(e) => onInputChange(e.target.value, 'name')}
              />
            </div>
            <div>
              <div class='text-minor'>{t('LabelPassword')}</div>
              <input
                type='password'
                class='py-3 pr-10 pl-6 mt-1 w-full base-component'
                onChange={(e) => onInputChange(e.target.value, 'password')}
              />
            </div>
            <div>
              <div class='text-minor'>{t('LabelPasswordConfirm')}</div>
              <input
                type='password'
                class='py-3 pr-10 pl-6 mt-1 w-full base-component'
                onChange={(e) => onInputChange(e.target.value, 'passwordConfirm')}
              />
            </div>
            <Button
              class='mt-4 text-primary h-12 w-full font-bold text-xl'
              lable={t('ButtonOk')}
              loading={loading()}
              onClick={wizardComplete}
            />
          </div>
          <div class='flex flex-col gap-4 w-full min-w-72'>
            <div class='flex justify-center text-2xl font-bold'>{t('HeaderLibraries')}</div>
            <div>
              <div class='text-minor'>{t('ButtonAddMediaLibrary')}</div>
              <Button
                class='mt-1 text-primary h-12 w-full font-bold text-2xl'
                icon={<FaSolidPlus />}
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Wizard
