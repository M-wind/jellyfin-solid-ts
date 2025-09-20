import { SiJellyfin } from 'solid-icons/si'
import { For, Index, Show, createSelector } from 'solid-js'
import { useAppContext } from '../../context/AppContext'
import { StreamingBitrate } from '../../helper/option'

type VideoOptionProps = {
  playBackRate: number
  changeRate: (type: string, v: number) => void
  bitrate?: number
  maxBitrate: number
}

const VideoOption = (props: VideoOptionProps) => {
  const { t } = useAppContext()

  // const rate = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4]
  const rate = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

  const isSelectPlayRate = createSelector(() => props.playBackRate)
  const isSelectMaxBitRate = createSelector(() => props.maxBitrate)

  const getBitrate = () => {
    const b = StreamingBitrate.filter((v) => v.value < props.bitrate!)
    b.unshift({ name: t('Auto'), value: 0 })
    return b
  }

  return (
    <>
      <div class='absolute angle-down bottom-video-osd left-angle-center' />
      <div class='absolute right-0 z-50 flex-col mb-4 rounded-xl shadow-l bg-component bottom-video-osd -mr-[4.5rem] w-[28rem] animate-fadeIn text-nomal/80'>
        <div class='flex flex-row justify-between items-center px-6 h-14 select-none'>
          <div class='text-2xl font-medium'>{t('Video')}</div>
          <SiJellyfin class='text-2xl text-primary' />
        </div>
        <div class='flex flex-col gap-3 py-3 px-6'>
          <div class='flex flex-row'>
            <div class='w-[5rem]'>{t('PlaybackRate')}</div>
            <div class='grid grid-cols-5 gap-3 w-[20rem]'>
              <Index each={rate}>
                {(item) => (
                  <p
                    class={`${isSelectPlayRate(item()) ? 'bg-from-to text-white' : 'bg-component-hover'} py-1 flex justify-center hover:bg-from-to hover:text-white cursor-pointer rounded-md`}
                    onClick={() => props.changeRate('playBackRate', item())}
                  >
                    {item()}
                  </p>
                )}
              </Index>
            </div>
          </div>
          <Show when={props.bitrate}>
            <div class='flex flex-row'>
              <div class='w-[5rem]'>{t('LabelVideoBitrate')}</div>
              <div class='grid grid-cols-5 gap-3 w-[20rem]'>
                <For each={getBitrate()}>
                  {(item) => (
                    <p
                      class={`${isSelectMaxBitRate(item.value) ? 'bg-from-to text-white' : 'bg-component-hover'} py-1 flex justify-center rounded-md cursor-pointer bg-component-hover hover:bg-from-to hover:text-white`}
                      onClick={() => props.changeRate('maxBitrate', item.value)}
                    >
                      {item.name}
                    </p>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </>
  )
}

export default VideoOption
