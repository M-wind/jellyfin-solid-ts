import { BsBadge4kFill, BsBadge8kFill, BsBadgeHdFill, BsBadgeSdFill } from 'solid-icons/bs'
import { TbInfoSquareFilled } from 'solid-icons/tb'
import { For, Show } from 'solid-js'
import { formatTime, getResolution, getTime, repaire0 } from '../../helper/utils'

type BaseInfoProps = {
  val?: MediaInfoDetail
  name?: string
}

export const MediaResolutionIcon = (v: MediaResolution) => {
  return {
    '8K': <BsBadge8kFill class='icon-screen' />,
    '4K': <BsBadge4kFill class='icon-screen' />,
    HD: <BsBadgeHdFill class='icon-screen' />,
    SD: <BsBadgeSdFill class='icon-screen' />,
  }[v]
}

const BaseInfo = (props: BaseInfoProps) => {
  return (
    <div class='flex flex-col gap-4 w-[60%] min-w-96'>
      <h1 class='text-screen-title truncate'>{props.name || props.val?.Name}</h1>
      <div class='flex overflow-hidden flex-row gap-3 items-center opacity-95 text-screen-main'>
        <Show when={props.val?.Width} fallback={<TbInfoSquareFilled class='icon-screen' />}>
          {MediaResolutionIcon(getResolution(props.val?.Width!))}
        </Show>
        <Show when={props.val?.ProductionYear}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div>{props.val?.ProductionYear}</div>
        </Show>
        <Show when={props.val?.OfficialRating}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div>{props.val?.OfficialRating}</div>
        </Show>
        <Show when={props.val?.RunTimeTicks}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div class='truncate'>{formatTime(props.val?.RunTimeTicks!)}</div>
        </Show>
      </div>
      <p class='text-screen-clamp text-screen-overview text-secondary'>
        {<p>&emsp;&emsp;{props.val?.Overview?.trim() ?? ''}</p>}
      </p>
    </div>
  )
}

const BaseInfoEpisode = (props: BaseInfoProps) => {
  return (
    <div class='[@media(max-height:34rem)]:hidden flex flex-col gap-4 w-[60%] min-w-96'>
      <h1 class='text-screen-title truncate'>{props.val?.SeriesName || props.val?.Name}</h1>
      <div class='flex overflow-hidden flex-row gap-3 items-center opacity-95 text-screen-main'>
        <Show when={props.val?.Width} fallback={<TbInfoSquareFilled class='icon-screen' />}>
          {MediaResolutionIcon(getResolution(props.val?.Width!))}
        </Show>
        {/* <Show when={props.val?.ProductionYear}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div>{props.val?.ProductionYear}</div>
        </Show> */}
        <div class='w-3 h-3 rounded-full bg-from-to' />
        <div>{props.val?.ParentIndexNumber + 'x' + repaire0(props.val?.IndexNumber!)}</div>
        <Show when={props.val?.PremiereDate}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div class='truncate'>{getTime(props.val?.PremiereDate!)}</div>
        </Show>
        <Show when={props.val?.OfficialRating}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div>{props.val?.OfficialRating}</div>
        </Show>
        <Show when={props.val?.RunTimeTicks}>
          <div class='w-3 h-3 rounded-full bg-from-to' />
          <div class='truncate'>{formatTime(props.val?.RunTimeTicks!)}</div>
        </Show>
      </div>
      <p class='text-screen-clamp text-screen-overview text-secondary'>
        <strong>{props.val?.Name.trim() ?? ''}</strong>
        {` ~ ${props.val?.Overview?.trim() ?? ''}`}
      </p>
    </div>
  )
}

const BaseInfoActor = (props: BaseInfoProps) => {
  return (
    <div class='flex flex-col gap-4 w-[60%] [@media(max-height:34rem)]:hidden min-w-96'>
      <h1 class='text-screen-title truncate'>{props.val?.Name}</h1>
      <div class='flex flex-row gap-4'>
        <Show when={props.val?.PremiereDate}>
          <span class='text-secondary/70'>{getTime(props.val?.PremiereDate!)}</span>
        </Show>
        <Show when={props.val?.ProductionLocations}>
          <span class='text-secondary/70'>{props.val?.ProductionLocations!.join(' / ')}</span>
        </Show>
      </div>
      <Show when={props.val?.ExternalUrls}>
        <div class='flex flex-row gap-4 text-primary'>
          <For each={props.val?.ExternalUrls}>
            {(item) => (
              <a
                href={item.Url}
                class='underline duration-200 ease-linear hover:text-primary/80'
                target='_blank'
                rel='noreferrer'
              >
                {item.Name}
              </a>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.val?.Overview}>
        <p class='text-screen-clamp text-screen-overview text-secondary'>
          &emsp;&emsp;{props.val?.Overview?.trim()}
        </p>
      </Show>
    </div>
  )
}

export { BaseInfo, BaseInfoEpisode, BaseInfoActor }
