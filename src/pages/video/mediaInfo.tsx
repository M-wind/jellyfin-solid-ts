import { Show } from 'solid-js'
import { useAppContext } from '../../context/AppContext'
import { formatDuration, getEndTime, getResolution, getTime, repaire0 } from '../../helper/utils'
import { MediaResolutionIcon } from '../base/info'

type MediaInfoProps = {
  data?: MediaInfoDetail
  time: number
}

const MediaInfo = (props: MediaInfoProps) => {
  const { t } = useAppContext()

  return (
    <>
      <h1 class='text-screen-title w-[80%] truncate [@media(max-height:24rem)]:hidden'>
        {props.data?.SeriesName || props.data?.Name}
      </h1>
      <div class='flex overflow-hidden [@media(max-height:20rem)]:hidden flex-row gap-6 justify-between items-center w-full opacity-95 text-screen-main'>
        <div class='flex w-[70%] flex-row items-center gap-3'>
          {MediaResolutionIcon(getResolution(props.data?.Width!))}
          <Show when={props.data?.ProductionYear && !props.data?.SeriesName}>
            <div class='w-3 h-3 rounded-full bg-from-to' />
            <div>{props.data?.ProductionYear}</div>
          </Show>
          <Show when={props.data?.SeriesName}>
            <div class='w-3 h-3 rounded-full bg-from-to' />
            <div>{props.data?.ParentIndexNumber + 'x' + repaire0(props.data?.IndexNumber!)}</div>
            <div class='flex flex-row gap-3 items-center max-sm:hidden'>
              <Show when={props.data?.Name}>
                <div class='w-3 h-3 rounded-full bg-from-to' />
                <div class='truncate'>{props.data?.Name}</div>
              </Show>
              <div class='flex flex-row gap-3 items-center max-md:hidden'>
                <Show when={props.data?.PremiereDate}>
                  <div class='w-3 h-3 rounded-full bg-from-to' />
                  <div class='truncate'>{getTime(props.data?.PremiereDate!)}</div>
                </Show>
              </div>
            </div>
          </Show>
          <div class='flex flex-row gap-3 items-center max-[52rem]:hidden'>
            <div class='w-3 h-3 rounded-full bg-from-to' />
            <div class='truncate'>
              {t('EndsAtValue', [getEndTime(props.data?.RunTimeTicks! - props.time)])}
            </div>
          </div>
        </div>
        <div class='flex w-[30%] flex-row items-center justify-end truncate max-sm:w-[60%]'>
          {formatDuration(props.time) + ' | ' + formatDuration(props.data!.RunTimeTicks)}
        </div>
      </div>
    </>
  )
}

export default MediaInfo
