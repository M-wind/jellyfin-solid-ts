import Hls from 'hls.js'
import {
  BiRegularExitFullscreen,
  BiRegularFullscreen,
  BiRegularVolumeFull,
  BiRegularVolumeLow,
  BiRegularVolumeMute,
} from 'solid-icons/bi'
// import SubtitlesOctopus from 'libass-wasm'
// <TbBadgeAd /> <TbBadgeCc /> BsBadgeCc
import { BsBadgeCc, BsPauseFill, BsPip, BsPlayFill } from 'solid-icons/bs'
//import { TbBadgeAd, TbBadgeCc } from 'solid-icons/tb'
import { Show, batch, createEffect, createResource, on, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import ScreenLoading from '../../components/screenLoading'
import { Slider, SliderThumb, SliderTrack, SliderTrackIndicator } from '../../components/slider'
import { AudioDes, Forward10, Replay10 } from '../../components/svg'
import { useAppContext } from '../../context/AppContext'
import { getBaseUrl, getPalybackInfo, playingProgress, playingStopped } from '../../helper/api'
import JASSUB from '../../helper/jassub'
import { getBackDropImageUrl, getMediaInfo } from '../../helper/utils'
import Back from '../back'
import AudioOption from './audOption'
import MediaInfo from './mediaInfo'
import OsdButton from './osdButton'
import SubOption from './subOption'
import VideoOption from './videoOption'
import { TbSettingsAutomation } from 'solid-icons/tb'

type VideoState = {
  playState: boolean
  mask: boolean
  time: number
  loaded: number
  loading: boolean
  volume: number
  muted: boolean
  fullScreen: boolean
  playBackRate: number
}

type PlayedOption = {
  subTitle?: SubtitleStream[]
  curSub?: number
  audioTrack?: AudioStream[]
  curAud?: number
  bitrate?: number
  maxStreamingBitrate: number
  subOpen: boolean
  audOpen: boolean
  vidOpen: boolean
  volumeOpen: boolean
  keepOpen: boolean
}

const Video = () => {
  let video: HTMLVideoElement | undefined
  let container: HTMLDivElement | undefined
  let hls: Hls | undefined
  let instance: JASSUB | undefined
  let timer = 0

  const { state, updateState, t } = useAppContext()
  const param = state.pages[state.pages.length - 1].param
  const item: MediaInfoDetail = param?.data

  const fetcher = async (
    itemId: string,
    { refetching }: { refetching: PlaybackInfoOption | boolean },
  ) => {
    // All transcoding
    let a: PlaybackInfoOption = {
      EnableDirectPlay: false,
      EnableDirectStream: false,
      AllowVideoStreamCopy: false,
      AllowAudioStreamCopy: false,
    }
    if (typeof refetching !== 'boolean') a = { ...a, ...refetching }
    return await getPalybackInfo(itemId, {
      UserId: state.userId,
      StartTimeTicks: item?.UserData.PlaybackPositionTicks || 0,
      ...a,
    })
  }

  const [playbackInfo, { refetch }] = createResource(item?.Id, fetcher)

  const [videoState, setVideoState] = createStore<VideoState>({
    playState: true,
    mask: false,
    time: 0,
    loaded: 0,
    loading: true,
    volume: 100,
    muted: false,
    fullScreen: false,
    playBackRate: 1,
  })

  const [playedOption, setPlayedOption] = createStore<PlayedOption>({
    subTitle: undefined,
    audioTrack: undefined,
    curSub: undefined,
    curAud: undefined,
    bitrate: undefined,
    maxStreamingBitrate: 0,
    subOpen: false,
    audOpen: false,
    vidOpen: false,
    volumeOpen: false,
    keepOpen: false,
  })

  createEffect(
    on(
      () => playbackInfo.state,
      () => {
        if (playbackInfo.state === 'ready' && video) {
          const sources = playbackInfo().MediaSources[0]
          if (sources.TranscodingSubProtocol === 'hls') {
            hlsClean()
            hls = new Hls()
            hls.loadSource(getBaseUrl() + sources.TranscodingUrl!)
            hls.attachMedia(video)
            // hls.on(Hls.Events.ERROR, (_, data) => {
            //   switch (data.details) {
            //     case Hls.ErrorDetails.FRAG_PARSING_ERROR:
            //       hlsClean()
            //       refetching({
            //         EnableDirectPlay: false,
            //         EnableDirectStream: false,
            //         AllowAudioStreamCopy: false,
            //       })
            //       break
            //     default:
            //       hlsClean()
            //       refetching({
            //         EnableDirectPlay: false,
            //         EnableDirectStream: false,
            //         AllowVideoStreamCopy: false,
            //         AllowAudioStreamCopy: false,
            //       })
            //       break
            //   }
            // })
          } else {
            const param = `Static=true&MediaSourceId=${sources.Id}&Tag=${sources.ETag}`
            video!.src = getBaseUrl() + `/Videos/${sources.Id}/stream.${sources.Container}?` + param
          }
          video!.currentTime =
            (videoState.time || item!.UserData.PlaybackPositionTicks) / 1000 / 1000 / 10
          video!.volume = videoState.volume / 100
          const { audio, sub } = getMediaInfo(playbackInfo())
          batch(() => {
            setPlayedOption('curSub', sources.DefaultSubtitleStreamIndex)
            setPlayedOption('curAud', sources.DefaultAudioStreamIndex)
            setPlayedOption('bitrate', sources.Bitrate)
            setPlayedOption('audioTrack', audio)
            setPlayedOption('subTitle', sub)
          })
          const subUrl = sub.find((v) => v.Index === sources.DefaultSubtitleStreamIndex)
          if (subUrl?.DeliveryUrl && sources.DefaultSubtitleStreamIndex !== -1)
            initLibAss(subUrl.DeliveryUrl)
        }
      },
    ),
  )

  const refetching = (opt?: PlaybackInfoOption) => {
    const info: PlaybackInfoOption = {
      StartTimeTicks: videoState.time,
      AutoOpenLiveStream: true,
      MediaSourceId: item?.Id,
      AudioStreamIndex: playedOption.curAud,
      SubtitleStreamIndex: playedOption.curSub,
      ...opt,
    }
    if (playedOption.maxStreamingBitrate !== 0)
      info.MaxStreamingBitrate = playedOption.maxStreamingBitrate
    refetch(info)
  }

  const changeSub = (index: number, subUrl?: string) => {
    if (index === playedOption.curSub) {
      closeSub(subUrl)
      return
    }
    changeSubByUrl(index, subUrl)
  }

  const changeRate = (type: string, rate: number) => {
    if (type === 'playBackRate') {
      video!.playbackRate = rate
      return
    }
    if (rate === playedOption.maxStreamingBitrate) return
    setPlayedOption('maxStreamingBitrate', rate)
    refetching()
  }

  const closeSub = (subUrl?: string) => {
    setPlayedOption('curSub', -1)
    if (subUrl) {
      instance?.freeTrack()
      return
    }
    refetching()
  }

  const changeSubByUrl = (index: number, subUrl?: string) => {
    setPlayedOption('curSub', index)
    if (!subUrl) {
      refetching()
      return
    }
    if (instance) {
      instance.setTrackByUrl(subUrl!)
      return
    }
    initLibAss(subUrl)
  }

  const initLibAss = (subUrl?: string) => {
    instance = new JASSUB({
      video,
      subUrl,
      workerUrl: new URL('../../helper/jassub/jassub-worker.js', import.meta.url).toString(),
      wasmUrl: new URL('../../helper/jassub/jassub-worker.wasm', import.meta.url).toString(),
      availableFonts: {
        'noto sans mono cjk sc regular': new URL(
          '../../helper/jassub/default.woff2',
          import.meta.url,
        ).toString(),
      },
      fallbackFont: 'noto sans mono cjk sc regular',
    })
  }

  const hlsClean = () => {
    if (hls) {
      hls.destroy()
      hls = undefined
    }
  }

  const insClean = () => {
    if (instance) {
      instance.destroy()
      instance = undefined
    }
  }

  const fullScreenChange = () => {
    setVideoState('fullScreen', document.fullscreenElement ? true : false)
  }

  const keyDown = ({ code }: { code: string }) => {
    switch (code) {
      case 'Space':
        togglePlay()
        break
      case 'NumpadEnter':
      case 'Enter':
        toggleFullscreen()
        break
      case 'ArrowUp':
        volumeChange(10)
        break
      case 'ArrowDown':
        volumeChange(-10)
        break
      case 'ArrowRight':
        forword10()
        break
      case 'ArrowLeft':
        replay10()
        break
      default:
        break
    }
  }

  onMount(() => {
    container?.addEventListener('mousemove', hidden)
    container?.addEventListener('fullscreenchange', fullScreenChange)
    document.addEventListener('keydown', keyDown)
  })

  const hidden = () => {
    clearTimeout(timer)
    if (!videoState.mask)
      timer = setTimeout(() => {
        setVideoState('mask', true)
      }, 100)
    if (!playedOption.keepOpen)
      timer = setTimeout(() => {
        setVideoState('mask', false)
      }, 2000)
  }

  const seek = (time: number) => {
    // setVideoState('loading', true)
    // video?.pause()
    video!.currentTime = time
  }

  type Open = 'audOpen' | 'subOpen' | 'vidOpen'

  const open: Open[] = ['audOpen', 'subOpen', 'vidOpen']

  const changeOpen = (primary: Open) => {
    batch(() => {
      open.forEach((v) => {
        setPlayedOption(v, v === primary ? !playedOption[v] : false)
      })
    })
  }

  const togglePlay = () => {
    if (videoState.playState) {
      video?.play()
      return
    }
    video?.pause()
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      return
    }
    if (container?.isConnected) container?.requestFullscreen()
  }

  const forword10 = () => {
    seek(video!.currentTime + 10)
  }

  const replay10 = () => {
    seek(video!.currentTime - 10)
  }

  const volumeChange = (v: number) => {
    setPlayedOption('volumeOpen', true)
    const volume = videoState.volume + v
    video!.volume = Math.min(Math.max(volume, 0), 100) / 100
  }

  let timer1 = 0

  createEffect(
    on(
      () => playedOption.volumeOpen,
      () => {
        clearTimeout(timer1)
        timer1 = setTimeout(() => setPlayedOption('volumeOpen', false), 3000)
      },
    ),
  )

  onCleanup(() => {
    clearTimeout(timer)
    clearTimeout(timer1)
    hlsClean()
    insClean()
    container?.removeEventListener('mousemove', hidden)
    container?.removeEventListener('fullscreenchange', fullScreenChange)
    document.removeEventListener('keydown', keyDown)
  })

  const buffered = () => {
    const range = video?.buffered.length
    if (!range) return
    for (let i = range - 1; i >= 0; i--) {
      if (video!.buffered.start(i) < video!.currentTime && video!.currentTime < video!.buffered.end(i)) {
        setVideoState('loaded', video!.buffered.end(i) * 1000 * 1000 * 10)
        return
      }
    }
  }

  const toggleMuted = () => {
    video!.muted = !video?.muted
    setVideoState('muted', !videoState.muted)
  }

  const VolumeIcon = (props: { class: string }) => (
    <Show
      when={videoState.muted}
      fallback={
        videoState.volume > 50 ? (
          <BiRegularVolumeFull class={props.class} />
        ) : (
          <BiRegularVolumeLow class={props.class} />
        )
      }
    >
      <BiRegularVolumeMute class={props.class} />
    </Show>
  )

  const togglePip = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
      return
    }
    video?.requestPictureInPicture()
  }

  const handleOnBack = () => {
    const options = {
      ItemId: item!.Id,
      MediaSourceId: item!.Id,
      PositionTicks: videoState.time,
      AudioStreamIndex: playedOption.curAud,
      SubtitleStreamIndex: playedOption.curSub,
      PlaySessionId: playbackInfo()!.PlaySessionId,
    }
    playingProgress(options)
    playingStopped(options)
    const pages = [...state.pages]
    pages.pop()
    updateState('pages', pages)
  }

  return (
    <div ref={container} class={videoState.mask ? 'cursor-default' : 'cursor-none'}>
      <video
        ref={video}
        class='absolute top-0 left-0 w-full h-full bg-black'
        preload='metadata'
        playsinline
        autoplay
        poster={getBackDropImageUrl(
          item.ParentBackdropImageTags ? item.ParentBackdropItemId! : item!.Id,
          item.ParentBackdropImageTags || item.BackdropImageTags,
        )}
        onTimeUpdate={() => setVideoState('time', Math.floor(video!.currentTime * 1000 * 1000 * 10))}
        onPlay={() => setVideoState('playState', false)}
        onPause={() => setVideoState('playState', true)}
        onSeeking={() => setVideoState('loading', true)}
        onCanPlayThrough={() => setVideoState('loading', false)}
        onVolumeChange={() => setVideoState('volume', Math.floor(video!.volume * 100))}
        onProgress={buffered}
        onRateChange={() => setVideoState('playBackRate', video!.playbackRate)}
      />
      <Show when={playedOption.volumeOpen}>
        <div class='flex absolute top-16 right-16 z-20 flex-row gap-3 items-center animate-fadeIn'>
          <VolumeIcon class='text-5xl' />
          <span class='text-4xl'>{videoState.volume}</span>
        </div>
      </Show>
      <Show when={videoState.loading}>
        <ScreenLoading />
      </Show>
      <div
        class={`absolute left-0 top-0 flex h-full w-full ${
          videoState.mask ? 'block' : 'hidden'
        } animate-fadeIn flex-col justify-end gap-6 px-16 pb-16 shadow-play disable-select`}
      >
        <Back onBack={handleOnBack} />
        <MediaInfo data={item} time={videoState.time} />
        <div class='[@media(max-height:20rem)]:hidden'>
          <Slider
            max={item?.RunTimeTicks}
            value={videoState.time}
            onChange={(v: number) => seek(v / 1000 / 1000 / 10)}
          >
            <SliderTrackIndicator value={videoState.loaded} />
            <SliderTrack class='bg-from-to' />
            <SliderThumb />
          </Slider>
        </div>
        <div
          class='flex flex-row items-center w-full [@media(max-height:20rem)]:hidden'
          onMouseEnter={() => setPlayedOption('keepOpen', true)}
          onMouseLeave={() => setPlayedOption('keepOpen', false)}
        >
          <div class='flex gap-6 w-3/5 max-[52rem]:w-full'>
            <OsdButton
              onClick={togglePlay}
              icon={
                videoState.playState ? <BsPlayFill class='text-3xl' /> : <BsPauseFill class='text-3xl' />
              }
              title={videoState.playState ? t('Play') : t('ButtonPause')}
            />
            <OsdButton onClick={replay10} icon={<Replay10 />} title={t('Rewind')} />
            <OsdButton onClick={forword10} icon={<Forward10 />} title={t('FastForward')} />
            <OsdButton
              onClick={toggleMuted}
              icon={<VolumeIcon class='text-2xl' />}
              title={videoState.muted ? t('Unmute') : t('Mute')}
            />
            <div class='flex items-center h-12 w-[120px] max-[32rem]:hidden'>
              <Slider
                max={100}
                class='h-1.5'
                value={videoState.volume}
                onChange={(v: number) => (video!.volume = v / 100)}
              >
                <SliderTrack class='bg-from-to' />
                <SliderThumb class='w-3 h-3' size='6px' />
              </Slider>
            </div>
          </div>
          <div class='flex gap-6 justify-end w-2/5 max-[52rem]:hidden'>
            <Show when={playedOption.audioTrack && playedOption.audioTrack!.length > 0}>
              <div class='relative'>
                <OsdButton
                  onClick={() => changeOpen('audOpen')}
                  icon={<AudioDes class='w-8 h-8' />}
                  //icon={<TbBadgeAd class="text-2xl" />}
                  title={t('ButtonAudioTracks')}
                />
                <Show when={playedOption.audOpen}>
                  <AudioOption data={playedOption.audioTrack} index={playedOption.curAud} />
                </Show>
              </div>
            </Show>
            <Show when={playedOption.subTitle && playedOption.subTitle!.length > 0}>
              <div class='relative'>
                <OsdButton
                  onClick={() => changeOpen('subOpen')}
                  icon={<BsBadgeCc class='text-2xl' />}
                  title={t('Subtitles')}
                />
                <Show when={playedOption.subOpen}>
                  <SubOption
                    data={playedOption.subTitle}
                    onCiick={changeSub}
                    index={playedOption.curSub}
                  />
                </Show>
              </div>
            </Show>
            <div class='relative'>
              <OsdButton
                onClick={() => changeOpen('vidOpen')}
                icon={<TbSettingsAutomation class='text-2xl' />}
                title={t('Video') + t('Settings')}
              />
              <Show when={playedOption.vidOpen}>
                <VideoOption
                  playBackRate={videoState.playBackRate}
                  changeRate={changeRate}
                  bitrate={playedOption.bitrate}
                  maxBitrate={playedOption.maxStreamingBitrate}
                />
              </Show>
            </div>

            <Show when={document.pictureInPictureEnabled}>
              <OsdButton
                onClick={togglePip}
                icon={<BsPip class='text-2xl' />}
                title={t('PictureInPicture')}
              />
            </Show>
            <OsdButton
              onClick={toggleFullscreen}
              icon={
                videoState.fullScreen ? (
                  <BiRegularExitFullscreen class='text-2xl' />
                ) : (
                  <BiRegularFullscreen class='text-2xl' />
                )
              }
              title={videoState.fullScreen ? t('ExitFullscreen') : t('Fullscreen')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Video
