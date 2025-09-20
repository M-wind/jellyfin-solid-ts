import { createStore } from 'solid-js/store'
import Button from '../../components/button'
import { useAppContext } from '../../context/AppContext'
import Selector from '../../components/selector'
import { RefreshTypes } from '../../helper/option'
import { batch, createSignal, Show } from 'solid-js'
import { ToggleLabel } from '../../components/toggle'
import { itemRefresh } from '../../helper/api'
import useAlert from '../../components/alert'

type RefreshProps = {
  id: string | undefined
  onBack: () => void
}

const Refresh = (props: RefreshProps) => {
  const { t } = useAppContext()

  const [option, setOption] = createStore<RefreshOptions>({
    metadataRefreshMode: 'Default',
    imageRefreshMode: 'Default',
    replaceAllMetadata: false,
    replaceAllImages: false,
    regenerateTrickplay: false,
  })

  const [type, setType] = createSignal('ScanForNewAndUpdatedFiles')

  const onConfirm = () => {
    itemRefresh(props.id!, option).then((v) => {
      if (v.ok) {
        props.onBack()
        useAlert(t('RefreshQueued'))
      }
    })
  }

  const onSelect = (v: SelectorDataType<string>) => {
    batch(() => {
      if (v.Value === 'ScanForNewAndUpdatedFiles') {
        setOption('metadataRefreshMode', 'Default')
        setOption('imageRefreshMode', 'Default')
        setOption('replaceAllMetadata', false)
        setOption('replaceAllImages', false)
        setOption('regenerateTrickplay', false)
      }
      if (v.Value === 'SearchForMissingMetadata') {
        setOption('metadataRefreshMode', 'FullRefresh')
        setOption('imageRefreshMode', 'FullRefresh')
        setOption('replaceAllMetadata', false)
      }
      if (v.Value === 'ReplaceAllMetadata') {
        setOption('metadataRefreshMode', 'FullRefresh')
        setOption('imageRefreshMode', 'FullRefresh')
        setOption('replaceAllMetadata', true)
      }
    })
    setType(v.Value)
  }

  const onChecked = (val: boolean, id: string) => {
    setOption(id === 'replaceAllImages' ? 'replaceAllImages' : 'regenerateTrickplay', val)
  }

  return (
    <>
      <div class='absolute top-6 right-6 left-6 bottom-20'>
        <div class='grid grid-cols-2 auto-rows-auto gap-6 animate-fadeIn max-md:grid-cols-1'>
          <div class='flex flex-col gap-6 w-full min-w-72'>
            <div>
              <div class='text-minor'>{t('LabelRefreshMode')}</div>
              <Selector data={RefreshTypes(t)} default='ScanForNewAndUpdatedFiles' onSelect={onSelect} />
            </div>
            <Show when={type() !== 'ScanForNewAndUpdatedFiles'}>
              <div>
                <ToggleLabel
                  id='replaceAllImages'
                  title={t('ReplaceExistingImages')}
                  checked={false}
                  onChecked={onChecked}
                />
              </div>
              <div>
                <ToggleLabel
                  id='replaceAllImages'
                  title={t('ReplaceTrickplayImages')}
                  checked={false}
                  onChecked={onChecked}
                />
              </div>
            </Show>
          </div>
          <div class='flex mt-7 w-full text-minor'>{t('RefreshDialogHelp')}</div>
        </div>
      </div>
      <div class='absolute bottom-6 left-6'>
        <Button
          onClick={props.onBack}
          lable={t('ButtonBack')}
          class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
      <div class='absolute right-6 bottom-6'>
        <Button
          onClick={onConfirm}
          lable={t('ButtonOk')}
          class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
    </>
  )
}

export default Refresh
