import { Match, Show, Switch, batch } from 'solid-js'
import { createStore } from 'solid-js/store'
import useAlert from '../../components/alert'
import Button from '../../components/button'
import Selector from '../../components/selector'
import { useAppContext } from '../../context/AppContext'
import { setMediaLibrary, updateMediaLibrary } from '../../helper/api'
import { ContentOptions, initLibraryOptions } from '../../helper/option'
import OpreateMovie from './opreateMovie'
import OpreateSeries from './opreateSeries'

export type Options = {
  name: string
  libraryContentType: CollectionType
  libraryOptions: LibraryOptions
}

type OpreateMediaLibrayProps = {
  onConfirm: () => void
  onBack: () => void
  options: {
    id: string | undefined
    name: string | undefined
    type: CollectionType
    libraryOptions: LibraryOptions | undefined
  }
}

const OpreateMediaLibray = (props: OpreateMediaLibrayProps) => {
  const { t } = useAppContext()

  const [options, setOptions] = createStore<Options>({
    name: props.options.name || '',
    libraryOptions: props.options.libraryOptions || initLibraryOptions(),
    libraryContentType: props.options.type || '',
  })

  const onLibraryContentTypeChange = (val: SelectorDataType<CollectionType>) => {
    batch(() => {
      setOptions('name', () => val.Name)
      setOptions('libraryOptions', initLibraryOptions())
      setOptions('libraryContentType', () => val.Value)
    })
  }

  const onConfirm = () => {
    if (options.libraryOptions.PathInfos.length === 0) {
      useAlert(t('PleaseAddAtLeastOneFolder'))
      return
    }
    if (!!props.options.id) {
      updateMediaLibrary(props.options.id, options.libraryOptions).then((v) => {
        if (v.ok) props.onConfirm()
      })
    } else {
      setMediaLibrary(options.name, options.libraryContentType, options.libraryOptions).then((v) => {
        if (v.ok) props.onConfirm()
      })
    }
    props.onBack()
  }

  return (
    <>
      <div class='flex overflow-y-auto absolute top-6 right-6 left-6 bottom-20 flex-col gap-6 p-0.5 animate-slideInRight scrollbar-0'>
        <div class='flex flex-row gap-6 max-sm:flex-col'>
          <div class='w-full min-w-72'>
            <div class='text-minor'>{t('LabelContentType')}</div>
            <Selector
              id='ContentType'
              disabled={!!props.options.id}
              readonly={true}
              default={options.libraryContentType}
              data={ContentOptions(t)}
              onSelect={onLibraryContentTypeChange}
            />
          </div>
          <div class='w-full min-w-72'>
            <div class='text-minor'>{t('LabelDisplayName')}</div>
            <input
              class='py-3 pr-10 pl-6 mt-1 w-full text-left rounded-md shadow-lg focus:ring-1 disable-default bg-component focus:ring-primary disabled:brightness-75'
              disabled={!!props.options.id}
              value={options.name}
              onChange={(e) => setOptions('name', () => e.target.value)}
            />
          </div>
        </div>
        <Switch>
          <Match when={options.libraryContentType === 'movies'}>
            <OpreateMovie
              options={options.libraryOptions}
              update={setOptions}
              id={props.options.id}
              name={props.options.name}
            />
          </Match>
          <Match when={options.libraryContentType === 'tvshows'}>
            <OpreateSeries
              options={options.libraryOptions}
              update={setOptions}
              id={props.options.id}
              name={props.options.name}
            />
          </Match>
        </Switch>
      </div>
      <div class='absolute bottom-6 left-6'>
        <Button
          onClick={props.onBack}
          lable={t('ButtonBack')}
          class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
      <Show when={options.libraryContentType !== ''}>
        <div class='absolute right-6 bottom-6'>
          <Button
            onClick={onConfirm}
            lable={t('ButtonOk')}
            class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
          />
        </div>
      </Show>
    </>
  )
}

export default OpreateMediaLibray
