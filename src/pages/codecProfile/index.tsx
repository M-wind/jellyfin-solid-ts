import { FaSolidCheck } from 'solid-icons/fa'
import { IoClose } from 'solid-icons/io'
import { For, Match, Show, Switch, createResource, createSignal } from 'solid-js'
import Button from '../../components/button'
import Selector from '../../components/selector'
import { ToggleLabel, ToggleLabelArr } from '../../components/toggle'
import { useAppContext } from '../../context/AppContext'
import { getCodecProfile, getSystemInfo, setCodecProfile } from '../../helper/api'
import {
  HardwareDecodeOptions,
  HardwareDecodeTypeExtraOptions,
  HardwareDecodeTypeOptions,
  HardwareEncodeTypeOptions,
} from '../../helper/option'
import Avatar from '../avatar'
import Back from '../back'

type Status = 'pending' | 'ready' | 'unloaded' | 'error'

const CodecProfile = () => {
  const { t } = useAppContext()

  const [status, setStatus] = createSignal<Status>('unloaded')

  const [codecProfileOptions, { mutate }] = createResource(async () => {
    const data = await getCodecProfile()
    const systemInfo = await getSystemInfo()
    data.TranscodingTempPath = systemInfo.TranscodingTempPath
    return data
  })

  const onSelect = (val: SelectorDataType<string>) => {
    mutate((v) => {
      if (v) return { ...v, HardwareAccelerationType: val.Value }
    })
  }

  const onCheck = (val: string[]) => {
    mutate((v) => {
      if (v) return { ...v, HardwareDecodingCodecs: val }
    })
  }

  const onChecked = (val: boolean, id: string) => {
    mutate((v) => {
      if (v) return { ...v, [id]: val }
    })
  }

  const contains = (name: string) => {
    return HardwareDecodeTypeOptions[name].map((v) => {
      return {
        ...v,
        DefaultEnabled: codecProfileOptions()?.HardwareDecodingCodecs.indexOf(v.Name) !== -1,
      }
    })
  }

  const updateDevice = (val: string, id: string) => {
    mutate((v) => {
      if (v) return { ...v, [id]: val }
    })
  }
  const onSave = async () => {
    try {
      setStatus('pending')
      await setCodecProfile(codecProfileOptions())
      setStatus('ready')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <>
      <Back />
      <Avatar />
      <div class='absolute left-[5%] top-40 bottom-32 w-9/10 grid grid-cols-2 max-md:grid-cols-1 maxWidth: auto-rows-min animate-fadeIn overflow-y-auto scrollbar-0 gap-8'>
        <Show when={codecProfileOptions.state === 'ready'}>
          <div class='flex flex-col gap-5 w-full min-w-80'>
            <div>
              <div class='text-minor'>{t('TitleHardwareAcceleration')}</div>
              <Selector
                data={HardwareDecodeOptions(t)}
                default={codecProfileOptions()?.HardwareAccelerationType}
                onSelect={onSelect}
                w='w-full'
              />
            </div>
            <Show when={codecProfileOptions()?.HardwareAccelerationType === 'vaapi'}>
              <div>
                <div class='text-minor'>{t('LabelVaapiDevice')}</div>
                <input
                  type='text'
                  autofocus
                  value={codecProfileOptions()?.VaapiDevice}
                  class='w-full border-b disable-default border-component-separator min-h-12'
                  onChange={(e) => updateDevice(e.target.value, 'VaapiDevice')}
                />
              </div>
            </Show>
            <Show when={codecProfileOptions()?.HardwareAccelerationType === 'qsv'}>
              <div>
                <div class='text-minor'>{t('LabelQsvDevice')}</div>
                <input
                  type='text'
                  autofocus
                  value={codecProfileOptions()?.QsvDevice}
                  class='w-full border-b disable-default border-component-separator min-h-12'
                  onChange={(e) => updateDevice(e.target.value, 'QsvDevice')}
                />
              </div>
            </Show>
            <Show when={codecProfileOptions()?.HardwareAccelerationType !== 'none'}>
              <div>
                <div class='text-minor'>{t('LabelEnableHardwareDecodingFor')}</div>
                {/* {ToggleArr(codecProfileOptions()?.HardwareAccelerationType)} */}
                <Switch>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'amf'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('amf')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'nvenc'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('nvenc')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'qsv'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('qsv')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'vaapi'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('vaapi')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'rkmpp'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('rkmpp')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'videotoolbox'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('videotoolbox')} />
                  </Match>
                  <Match when={codecProfileOptions()?.HardwareAccelerationType === 'v4l2m2m'}>
                    <ToggleLabelArr onChecked={onCheck} arr={contains('v4l2m2m')} />
                  </Match>
                </Switch>
                <For
                  each={HardwareDecodeTypeExtraOptions[codecProfileOptions()!.HardwareAccelerationType]}
                >
                  {(v) => (
                    <ToggleLabel
                      title={v.Name}
                      id={v.Value}
                      w='w-full'
                      checked={codecProfileOptions()![v.Value]}
                      onChecked={onChecked}
                    />
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div class='flex flex-col gap-5 w-full min-w-80'>
            <Show when={codecProfileOptions()?.HardwareAccelerationType !== 'none'}>
              <div>
                <div class='text-minor'>{t('LabelHardwareEncodingOptions')}</div>
                <ToggleLabel
                  title={t('EnableHardwareEncoding')}
                  id='EnableHardwareEncoding'
                  w='w-full'
                  checked={codecProfileOptions()?.EnableHardwareEncoding}
                  onChecked={onChecked}
                />
                <Show
                  when={
                    codecProfileOptions()?.HardwareAccelerationType === 'qsv' ||
                    codecProfileOptions()?.HardwareAccelerationType === 'vaapi'
                  }
                >
                  <ToggleLabel
                    title={t('EnableIntelLowPowerH264HwEncoder')}
                    id='EnableIntelLowPowerH264HwEncoder'
                    w='w-full'
                    checked={codecProfileOptions()?.EnableIntelLowPowerH264HwEncoder}
                    onChecked={onChecked}
                  />
                  <ToggleLabel
                    title={t('EnableIntelLowPowerHevcHwEncoder')}
                    id='EnableIntelLowPowerHevcHwEncoder'
                    w='w-full'
                    checked={codecProfileOptions()?.EnableIntelLowPowerHevcHwEncoder}
                    onChecked={onChecked}
                  />
                </Show>
              </div>
            </Show>
            <div>
              <div class='text-minor'>{t('LabelEncodingFormatOptions')}</div>
              <For each={HardwareEncodeTypeOptions(t)}>
                {(v) => (
                  <ToggleLabel
                    title={v.Name}
                    id={v.Value}
                    w='w-full'
                    checked={codecProfileOptions()![v.Value]}
                    onChecked={onChecked}
                  />
                )}
              </For>
            </div>
            <div>
              <Show when={codecProfileOptions()?.HardwareAccelerationType === 'nvenc'}>
                <ToggleLabel
                  title={t('EnableEnhancedNvdecDecoder')}
                  id='EnableEnhancedNvdecDecoder'
                  w='w-full'
                  checked={codecProfileOptions()?.EnableEnhancedNvdecDecoder}
                  onChecked={onChecked}
                />
              </Show>
              <Show when={codecProfileOptions()?.HardwareAccelerationType === 'videotoolbox'}>
                <ToggleLabel
                  title={t('EnableVideoToolboxTonemapping')}
                  id='EnableVideoToolboxTonemapping'
                  w='w-full'
                  checked={codecProfileOptions()?.EnableVideoToolboxTonemapping}
                  onChecked={onChecked}
                />
              </Show>
              <Show
                when={
                  codecProfileOptions()?.HardwareAccelerationType === 'qsv' ||
                  codecProfileOptions()?.HardwareAccelerationType === 'vaapi'
                }
              >
                <Show when={codecProfileOptions()?.HardwareAccelerationType === 'qsv'}>
                  <ToggleLabel
                    title={t('PreferSystemNativeHwDecoder')}
                    id='PreferSystemNativeHwDecoder'
                    w='w-full'
                    checked={codecProfileOptions()?.PreferSystemNativeHwDecoder}
                    onChecked={onChecked}
                  />
                </Show>
                <ToggleLabel
                  title={t('EnableVppTonemapping')}
                  id='EnableVppTonemapping'
                  w='w-full'
                  checked={codecProfileOptions()?.EnableVppTonemapping}
                  onChecked={onChecked}
                />
              </Show>
              <Show
                when={
                  codecProfileOptions()?.HardwareAccelerationType !== 'none' &&
                  codecProfileOptions()?.HardwareAccelerationType !== 'v4l2m2m'
                }
              >
                <ToggleLabel
                  title={t('EnableTonemapping')}
                  id='EnableTonemapping'
                  w='w-full'
                  checked={codecProfileOptions()?.EnableTonemapping}
                  onChecked={onChecked}
                />
              </Show>
            </div>
            <div>
              <div class='text-minor'>{t('LabelffmpegPath')}</div>
              <input
                type='text'
                disabled
                value={codecProfileOptions()?.EncoderAppPathDisplay}
                class='w-full border-b disable-default border-component-separator min-h-12'
              />
            </div>
            <div>
              <div class='text-minor'>{t('LabelTranscodePath')}</div>
              <input
                type='text'
                autofocus
                value={codecProfileOptions()?.TranscodingTempPath}
                class='w-full border-b disable-default border-component-separator min-h-12'
                onChange={(e) => updateDevice(e.target.value, 'TranscodingTempPath')}
              />
            </div>
          </div>
        </Show>
      </div>
      <div class='absolute left-[5%] bottom-12 w-9/10'>
        <Button
          onClick={onSave}
          lable={t('Save')}
          loading={status() === 'pending'}
          icon={
            status() === 'unloaded' ? (
              <div class='hidden' />
            ) : status() === 'ready' ? (
              <FaSolidCheck class='text-indicator' />
            ) : (
              <IoClose class='text-error' />
            )
          }
          class='w-24 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
    </>
  )
}

export default CodecProfile
