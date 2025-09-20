import { BiSolidFolderMinus } from 'solid-icons/bi'
import { For, Show, createResource } from 'solid-js'
import type { SetStoreFunction } from 'solid-js/store'
import { CheckBoxWithLabelOrder } from '../../components/checkbox'
import Selector from '../../components/selector'
import PathSelector from '../../components/selector/pathSelector'
import { ToggleLabel, ToggleLabelArr } from '../../components/toggle'
import { useAppContext } from '../../context/AppContext'
import {
  addFolderPath,
  deleteFolderPath,
  getAvailableOptions,
  getCountry,
  getCulture,
} from '../../helper/api'
import { EveryNDays } from '../../helper/option'
import { convertAvilableOptions, getValuesFromKey } from '../../helper/utils'
import type { Options } from './opreate'

type OpreateSeriesProps = {
  options: LibraryOptions
  update: SetStoreFunction<Options>
  id?: string
  name?: string
}

const OpreateSeries = (props: OpreateSeriesProps) => {
  const { t } = useAppContext()

  const fetcherCul = async () => {
    return [{ Name: '', Value: '' }, ...(await getCulture())]
  }

  const fetcherCou = async () => {
    return [{ Name: '', Value: '' }, ...(await getCountry())]
  }

  const fetcherAvilableOptions = async () => {
    let data: AvailableOptionsConvert
    if (!!props.id) {
      data = reInitOption(props.options)
    } else {
      data = convertAvilableOptions(await getAvailableOptions('tvshows'))
      initTypeOptions(data.TypeOptions)
    }
    return data
  }

  const reInitOption = (data: LibraryOptions): AvailableOptionsConvert => {
    const s = data.TypeOptions.find((v) => v.Type === 'Series')
    const m = data.TypeOptions.find((v) => v.Type === 'Season')
    const e = data.TypeOptions.find((v) => v.Type === 'Episode')
    const SeriesMetadata = reInit(s?.MetadataFetcherOrder || [], s?.MetadataFetchers || [])
    const SeriesImage = reInit(s?.ImageFetcherOrder || [], s?.ImageFetchers || [])
    const SeasonMetadata = reInit(m?.MetadataFetcherOrder || [], m?.MetadataFetchers || [])
    const SeasonImage = reInit(m?.ImageFetcherOrder || [], m?.ImageFetchers || [])
    const EpisodeMetadata = reInit(e?.MetadataFetcherOrder || [], e?.MetadataFetchers || [])
    const EpisodeImage = reInit(e?.ImageFetcherOrder || [], e?.ImageFetchers || [])
    const savers = reInit(data.LocalMetadataReaderOrder, data.MetadataSavers)
    return {
      MetadataSavers: savers,
      TypeOptions: {
        Series: {
          ImageFetchers: SeriesImage,
          MetadataFetchers: SeriesMetadata,
          Type: 'Series',
        },
        Season: {
          ImageFetchers: SeasonImage,
          MetadataFetchers: SeasonMetadata,
          Type: 'Season',
        },
        Episode: {
          ImageFetchers: EpisodeImage,
          MetadataFetchers: EpisodeMetadata,
          Type: 'Episode',
        },
      },
    }
  }

  const reInit = (arrOrder: string[], arr: string[]): ToggleDataType[] => {
    return arrOrder.map((v) => {
      return arr.indexOf(v) === -1
        ? { Name: v, DefaultEnabled: false }
        : { Name: v, DefaultEnabled: true }
    })
  }

  const initTypeOptions = (data: TypeOptionsConvert) => {
    const a = getValuesFromKey(data['Series'].ImageFetchers, 'Name')
    const b = getValuesFromKey(data['Series'].MetadataFetchers, 'Name')

    const c = getValuesFromKey(data['Season'].ImageFetchers, 'Name')
    const d = getValuesFromKey(data['Season'].MetadataFetchers, 'Name')

    const e = getValuesFromKey(data['Episode'].ImageFetchers, 'Name')
    const f = getValuesFromKey(data['Episode'].MetadataFetchers, 'Name')
    const z: TypeOption[] = [
      {
        Type: 'Series',
        ImageFetchers: a,
        ImageFetcherOrder: a,
        MetadataFetchers: b,
        MetadataFetcherOrder: b,
      },
      {
        Type: 'Season',
        ImageFetchers: c,
        ImageFetcherOrder: c,
        MetadataFetchers: d,
        MetadataFetcherOrder: d,
      },
      {
        Type: 'Episode',
        ImageFetchers: e,
        ImageFetcherOrder: e,
        MetadataFetchers: f,
        MetadataFetcherOrder: f,
      },
    ]
    props.update('libraryOptions', 'TypeOptions', z)
  }

  const [culture] = createResource(fetcherCul)
  const [country] = createResource(fetcherCou)
  const [avilableOptions] = createResource(fetcherAvilableOptions)

  const updateByType = (type: MediaType | SeriesOption, key: keyof TypeOption, v: string[]) => {
    props.update('libraryOptions', 'TypeOptions', (v) => v.Type === type, key, v)
  }

  const onPathChoose = (path: string) => {
    if (!!props.id) {
      addFolderPath(props.name!, { Path: path }).then((v) => {
        if (v.ok) pathAdd(path)
      })
      return
    }
    pathAdd(path)
  }

  const onPathDelete = (path: string, index: number) => {
    if (!!props.id) {
      deleteFolderPath(props.name!, path).then((v) => {
        if (v.ok) pathDelete(index)
      })
      return
    }
    pathDelete(index)
  }

  const pathAdd = (path: string) => {
    const data = [...props.options.PathInfos]
    if (data.some((v) => v.Path === path)) return
    data.push({ Path: path })
    props.update('libraryOptions', 'PathInfos', data)
  }

  const pathDelete = (index: number) => {
    const data = [...props.options.PathInfos]
    data.splice(index, 1)
    props.update('libraryOptions', 'PathInfos', data)
  }

  return (
    <div class='grid grid-cols-4 auto-rows-auto gap-5 animate-fadeIn max-sm:grid-cols-1 max-lgg:grid-cols-2'>
      <div class='flex flex-col gap-2 w-full min-w-60'>
        <Show when={culture.state === 'ready'}>
          <div>
            <div class='text-minor'>{t('LabelMetadataDownloadLanguage')}</div>
            <Selector
              id='PreferredMetadataLanguage'
              default={props.options.PreferredMetadataLanguage}
              data={culture()}
              onSelect={(v) => props.update('libraryOptions', 'PreferredMetadataLanguage', v.Value)}
            />
          </div>
        </Show>
        <Show when={country.state === 'ready'}>
          <div>
            <div class='text-minor'>{t('LabelCountry')}</div>
            <Selector
              id='MetadataCountryCode'
              default={props.options.MetadataCountryCode}
              data={country()}
              onSelect={(v) => props.update('libraryOptions', 'MetadataCountryCode', v.Value)}
            />
          </div>
        </Show>
        <div>
          <div class='text-minor'>{t('LabelSpecialSeasonsDisplayName')}</div>
          <input
            class='py-3 pr-10 pl-6 mt-1 w-full text-left rounded-md shadow-lg focus:ring-1 disable-default bg-component focus:ring-primary disabled:brightness-75'
            type='text'
            value={props.options.SeasonZeroDisplayName}
            onChange={(e) => props.update('libraryOptions', 'SeasonZeroDisplayName', e.target.value)}
          />
        </div>
        {/* <div>
          <div class='text-minor'>{t('AllowEmbeddedSubtitles')}</div>
          <Selector
            id='AllowEmbeddedSubtitles'
            default={props.options.AllowEmbeddedSubtitles}
            data={EmbeddedSubtitles(t)}
            onSelect={(v) => props.update('libraryOptions', 'AllowEmbeddedSubtitles', v.Value)}
            readonly
          />
        </div> */}
        <div>
          <div class='text-primary'>{t('Folders')}</div>
          <PathSelector id='PathInfos' onSelect={onPathChoose} />
          <div class='flex overflow-y-auto overflow-x-hidden flex-col items-center max-h-40 scrollbar-none'>
            <For each={props.options.PathInfos}>
              {(v, i) => (
                <div class='relative py-3 pr-10 pl-6 mt-1 w-full h-12 text-left rounded-md shadow-lg appearance-none outline-none focus:ring-1 bg-component focus:ring-primary'>
                  <span class='flex items-center'>
                    <span class='block truncate'>{v.Path}</span>
                  </span>
                  <span
                    onClick={() => onPathDelete(v.Path, i())}
                    class='flex absolute inset-y-1 right-2 justify-center items-center w-10 h-10 rounded-md cursor-pointer hover:text-error'
                  >
                    <BiSolidFolderMinus />
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class='flex flex-col gap-2 w-full min-w-60'>
        <Show when={avilableOptions.state === 'ready'}>
          <div>
            <div class='text-minor'>{t('LabelTypeMetadataDownloaders', [t('Series')])}</div>
            <CheckBoxWithLabelOrder
              key='SeriesMetadatFetcher'
              arr={avilableOptions()!.TypeOptions['Series'].MetadataFetchers}
              ordered={(v) => updateByType('Series', 'MetadataFetcherOrder', v)}
              checked={(v) => updateByType('Series', 'MetadataFetchers', v)}
            />
          </div>
          <div>
            <div class='text-minor'>{t('LabelTypeMetadataDownloaders', [t('Season')])}</div>
            <CheckBoxWithLabelOrder
              key='SeasonMetadatFetcher'
              arr={avilableOptions()!.TypeOptions['Season'].MetadataFetchers}
              ordered={(v) => updateByType('Season', 'MetadataFetcherOrder', v)}
              checked={(v) => updateByType('Season', 'MetadataFetchers', v)}
            />
          </div>
          <div>
            <div class='text-minor'>{t('LabelTypeMetadataDownloaders', [t('Episode')])}</div>
            <CheckBoxWithLabelOrder
              key='EpisodeMetadatFetcher'
              arr={avilableOptions()!.TypeOptions['Episode'].MetadataFetchers}
              ordered={(v) => updateByType('Episode', 'MetadataFetcherOrder', v)}
              checked={(v) => updateByType('Episode', 'MetadataFetchers', v)}
            />
          </div>
        </Show>
        <div>
          <ToggleLabel
            title={t('PreferEmbeddedTitlesOverFileNames')}
            id='EnableEmbeddedTitles'
            checked={props.options.EnableEmbeddedTitles}
            onChecked={(v) => props.update('libraryOptions', 'EnableEmbeddedTitles', v)}
          />
          <ToggleLabel
            title={t('LabelSaveLocalMetadata')}
            id='SaveLocalMetadata'
            checked={props.options.SaveLocalMetadata}
            onChecked={(v) => props.update('libraryOptions', 'SaveLocalMetadata', v)}
          />
        </div>
      </div>
      <div class='flex flex-col gap-2 w-full min-w-60'>
        <Show when={avilableOptions.state === 'ready'}>
          <div>
            <div class='text-minor'>{t('HeaderTypeImageFetchers', [t('Series')])}</div>
            <CheckBoxWithLabelOrder
              key='SeriesImagetFetcher'
              arr={avilableOptions()!.TypeOptions['Series'].ImageFetchers}
              ordered={(v) => updateByType('Series', 'ImageFetcherOrder', v)}
              checked={(v) => updateByType('Series', 'ImageFetchers', v)}
            />
          </div>
          <div>
            <div class='text-minor'>{t('HeaderTypeImageFetchers', [t('Season')])}</div>
            <CheckBoxWithLabelOrder
              key='SeasonImagetFetcher'
              arr={avilableOptions()!.TypeOptions['Season'].ImageFetchers}
              ordered={(v) => updateByType('Season', 'ImageFetcherOrder', v)}
              checked={(v) => updateByType('Season', 'ImageFetchers', v)}
            />
          </div>
          <div>
            <div class='text-minor'>{t('HeaderTypeImageFetchers', [t('Episode')])}</div>
            <CheckBoxWithLabelOrder
              key='EpisodeImagetFetcher'
              arr={avilableOptions()!.TypeOptions['Episode'].ImageFetchers}
              ordered={(v) => updateByType('Episode', 'ImageFetcherOrder', v)}
              checked={(v) => updateByType('Episode', 'ImageFetchers', v)}
            />
          </div>
        </Show>
        <ToggleLabel
          title={t('PreferEmbeddedEpisodeInfosOverFileNames')}
          id='EnableEmbeddedEpisodeInfos'
          checked={props.options.EnableEmbeddedEpisodeInfos}
          onChecked={(v) => props.update('libraryOptions', 'EnableEmbeddedEpisodeInfos', v)}
        />
      </div>
      <div class='flex flex-col gap-2 w-full min-w-60'>
        <div>
          <div class='text-minor'>{t('LabelAutomaticallyRefreshInternetMetadataEvery')}</div>
          <Selector
            id='AutomaticRefreshIntervalDays'
            default={props.options.AutomaticRefreshIntervalDays}
            data={EveryNDays(t)}
            onSelect={(v) => props.update('libraryOptions', 'AutomaticRefreshIntervalDays', v.Value)}
            readonly={true}
          />
        </div>
        <div>
          <Show when={avilableOptions.state === 'ready'}>
            <div>
              <div class='w-72 text-minor'>{t('LabelMetadataSavers')}</div>
              <ToggleLabelArr
                key='MetadataSavers'
                arr={avilableOptions()!.MetadataSavers}
                onChecked={(v) => props.update('libraryOptions', 'MetadataSavers', v)}
              />
            </div>
          </Show>
          <ToggleLabel
            title={t('LabelEnableRealtimeMonitor')}
            id='EnableRealtimeMonitor'
            checked={props.options.EnableRealtimeMonitor}
            onChecked={(v) => props.update('libraryOptions', 'EnableRealtimeMonitor', v)}
          />
          <ToggleLabel
            title={t('LabelAutomaticallyAddToCollection')}
            id='AutomaticallyAddToCollection'
            checked={props.options.AutomaticallyAddToCollection}
            onChecked={(v) => props.update('libraryOptions', 'AutomaticallyAddToCollection', v)}
          />
        </div>
        <div>
          <div class='text-minor'>{t('HeaderChapterImages')}</div>
          <ToggleLabel
            title={t('OptionExtractChapterImage')}
            id='EnableChapterImageExtraction'
            checked={props.options.EnableChapterImageExtraction}
            onChecked={(v) => props.update('libraryOptions', 'EnableChapterImageExtraction', v)}
          />
          <ToggleLabel
            title={t('LabelExtractChaptersDuringLibraryScan')}
            id='ExtractChapterImagesDuringLibraryScan'
            checked={props.options.ExtractChapterImagesDuringLibraryScan}
            onChecked={(v) => props.update('libraryOptions', 'ExtractChapterImagesDuringLibraryScan', v)}
          />
          <ToggleLabel
            title={t('OptionAutomaticallyGroupSeries')}
            id='EnableAutomaticSeriesGrouping'
            checked={props.options.EnableAutomaticSeriesGrouping}
            onChecked={(v) => props.update('libraryOptions', 'EnableAutomaticSeriesGrouping', v)}
          />
        </div>
      </div>
    </div>
  )
}

export default OpreateSeries
