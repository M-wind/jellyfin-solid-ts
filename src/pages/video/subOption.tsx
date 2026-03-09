import { FaRegularCircle, FaSolidCircleCheck } from 'solid-icons/fa'
import { SiJellyfin } from 'solid-icons/si'
import { For, Show } from 'solid-js'
import { useAppContext } from '../../context/AppContext'
import { LanguageCode } from '../../helper/option'

type SubOptonProps = {
  data?: SubtitleStream[]
  onCiick: (index: number, url?: string) => void
  index?: number
}

const SubOption = (props: SubOptonProps) => {
  const { t } = useAppContext()

  return (
    <>
      <div class='absolute angle-down bottom-video-osd left-angle-center' />
      <div class='absolute right-0 z-50 flex-col mb-4 rounded-xl shadow-l bg-component bottom-video-osd -mr-[4.5rem] w-[28rem] animate-fadeIn text-normal/80'>
        <div class='flex flex-row justify-between items-center px-6 h-14 select-none'>
          <div class='text-2xl font-medium'>{t('Subtitles')}</div>
          <SiJellyfin class='text-2xl text-primary' />
        </div>
        <div class='overflow-y-auto pb-3 max-h-96 scrollbar-0'>
          <For each={props.data}>
            {(item) => (
              <div
                class='flex flex-row gap-6 items-center pr-4 pl-6 w-full h-14 text-xl font-medium cursor-pointer select-none hover:bg-from-to hover:text-normal'
                onClick={() => props.onCiick(item.Index, item.DeliveryUrl)}
              >
                <div class='flex items-center w-52 h-full'>
                  <p class='w-full truncate'>{item.Title || item.Language.toUpperCase()}</p>
                </div>
                <div class='flex justify-end items-center h-full w-18'>
                  <p>{item.IsDefault ? t('Default') : ''}</p>
                </div>
                <div class='flex justify-center items-center w-5 h-5 rounded-full'>
                  <Show when={item.Index === props.index} fallback={<FaRegularCircle class='text-xl' />}>
                    <FaSolidCircleCheck class='text-xl text-indicator' />
                  </Show>
                </div>
                <div class='flex justify-center items-center w-9 full'>
                  <img
                    src={LanguageCode[item.Language.toLowerCase()] || './img/und.png'}
                    class='-ml-1 w-9 h-9 mt-[3px]'
                  />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  )
}

export default SubOption
