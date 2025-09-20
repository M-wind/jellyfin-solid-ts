import { getBaseUrl } from '../api'
import { ContainerCodec } from '../option'

export const initAuth = (deviceId: string, version: string) => {
  const device = uaMatch(navigator.userAgent).browser
  return `MediaBrowser Client="Jellyfin Solid", Device="${device}", DeviceId="${deviceId}", Version="${version}" `
}

export const convertAvilableOptions = (val: AvailableOptions): AvailableOptionsConvert => {
  const t1 = val.TypeOptions.reduce<TypeOptionsConvert>((pre, cur) => {
    pre[cur.Type] = cur
    return pre
  }, {})
  const t2 = val.MetadataSavers.map((v) => {
    return { Name: v.Name, DefaultEnabled: false }
  })
  return { ...val, MetadataSavers: t2, TypeOptions: t1 }
}

// export const convertArrToObject = <T,>(arr: T[], key: string) => {
//   return arr.reduce<{ [index: string]: T }>((pre, cur) => {
//     return { ...pre, [cur[key]]: cur }
//   }, {})
// }

export const getValuesFromKey = <T, K extends keyof T>(arr: T[], key: K) => {
  return arr.reduce<T[K][]>((pre, cur) => {
    pre.push(cur[key])
    return pre
  }, [])
}

export const getPeopleByType = (arr: People[], type: string) => {
  return arr.filter((v) => v.Type === type)
}

export const getPeopleNamesByType = (arr: People[], type: string) => {
  return getPeopleByType(arr, type)
    .reduce<string[]>((pre, cur) => {
      pre.push(cur.Name)
      return pre
    }, [])
    .join('/')
}

export const getStudio = (data: { Name: string; Id: string }[]) => {
  return data
    .reduce<string[]>((pre, cur) => {
      pre.push(cur.Name)
      return pre
    }, [])
    .join('/')
}

export const getMediaLibraryImage = (id: string) => {
  return getBaseUrl() + `/Items/${id}/Images/Primary?maxWidth=512&quality=90`
}

//  3600s * 1000ms * 1000us * 1000ns / 100
export const formatTime = (ticks: number) => {
  const ticksHour = 36000000000
  const ticksMinute = 600000000
  // const ticksSecond = 10000000
  const hour = Math.floor(ticks / ticksHour)
  ticks = ticks - hour * ticksHour
  const minute = Math.floor(ticks / ticksMinute)
  ticks = ticks - minute * ticksMinute
  // const second = Math.floor(ticks / ticksSecond)

  if (hour > 0) {
    return hour + ' hr ' + minute + ' mins'
  }
  return minute + ' mins'
}

export const getEndTime = (ticks: number) => {
  const ticksMs = Math.floor(ticks / (1000 * (1000 / 100)))
  const time = new Date().getTime() + ticksMs
  const dTime = new Date(time)
  return repaire0(dTime.getHours()) + ':' + repaire0(dTime.getMinutes())
}

export const formatDuration = (ticks: number) => {
    const ticksHour = 36000000000
    const ticksMinute = 600000000
    const ticksSecond = 10000000
    const hour = Math.floor(ticks / ticksHour)
    ticks = ticks - hour * ticksHour
    const minute = Math.floor(ticks / ticksMinute)
    ticks = ticks - minute * ticksMinute
    const second = Math.floor(ticks / ticksSecond)
    if (hour > 0) {
      return repaire0(hour) + ':' + repaire0(minute) + ':' + repaire0(second)
    }
    return repaire0(minute) + ':' + repaire0(second)
  }


export const getImageUrl = (id: string, data: ImageTags, key: ImageType, w?:number, h?:number) => {
  if (data[key] === undefined) return undefined
  const tag = data[key]
  w = w || 456
  h = h || 684
  switch (key) {
    case 'Primary':
      return (
        getBaseUrl() + `/Items/${id}/Images/Primary?fillHeight=${h}&fillWidth=${w}&quality=96&tag=${tag}`
      )
    case 'Logo':
      return getBaseUrl() + `/Items/${id}/Images/Logo?quality=70&tag=${tag}`
    default:
      return getBaseUrl() + `/Items/${id}/Images/${key}?quality=96&tag=${tag}`
  }
}

export const getBackDropImageUrl = (id: string, data: string[]) => {
  if (data.length === 0) return undefined
  return getBaseUrl() + `/Items/${id}/Images/Backdrop?quality=90&maxWidth=2560&tag=${data[0]}`
}

export const getPeopleImageUrl = (name: string, tag?: string) => {
  if (!tag) return undefined
  return getBaseUrl() + `/Persons/${name}/Images/Primary?fillHeight=350&fillWidth=276&tag=${tag}`
}

export const getMediaInfo = (data: PlaybackInfo) => {
  const mediasources = data.MediaSources
  if (mediasources.length === 0) return { audio: [], sub: [] }
  const source = mediasources[0]
  const sources = source.MediaStreams
  return sources.reduce<{ audio: AudioStream[]; sub: SubtitleStream[] }>(
    (pre, cur) => {
      if (cur.Type === 'Subtitle') {
        const sub = cur as SubtitleStream
        pre.sub.push(sub.DeliveryUrl ? { ...sub, DeliveryUrl: getBaseUrl() + sub.DeliveryUrl } : sub)
      }
      if (cur.Type === 'Audio') {
        const aud = cur as AudioStream
        pre.audio.push(aud)
      }
      return pre
    },
    { audio: [], sub: [] },
  )
}

export const getResolution = (width: number): MediaResolution => {
  switch (width) {
    case 7680:
      return '8K'
    case 3840:
      return '4K'
    case 1920:
      return 'HD'
    case 1280:
      return 'HD'
    default:
      return 'SD'
  }
}

export const repaire0 = (index: number) => {
  if (index === 0) return '00'
  let number = index + ''
  if (index < 10) {
    number = '0' + number
  }
  return number
}

export const getTime = (timezone: string) => {
  const time = new Date(timezone)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  return year + '-' + repaire0(month) + '-' + repaire0(day)
}

// export const RgbToHex = (num: [number, number, number]) => {
//   return '#' + ((1 << 24) + (num[0] << 16) + (num[1] << 8) + num[2]).toString(16).slice(1)
// }

export const getHash = (key: ImageType, data?: ImageBlurHashes) => {
  if (!!data && data[key]) {
    const tag = Object.keys(data[key])[0]
    return data[key][tag]
  }
  if (key === 'Primary') return 'WDEL?iVaI8s%ov^-}lWSOGN|x^9X-ot6Rk%NxvIoyFtTROZ}M^x^'
  return 'W555X[Os9WsnRs$kx^W=akk9W8$+RiRjohxbbXSbNzoLs*a$WGNG'
}

export const uaMatch = (ua: string) => {
  ua = ua.toLowerCase()
  const match =
    /(edg)[ /]([\w.]+)/.exec(ua) ||
    /(edga)[ /]([\w.]+)/.exec(ua) ||
    /(edgios)[ /]([\w.]+)/.exec(ua) ||
    /(edge)[ /]([\w.]+)/.exec(ua) ||
    /(opera)[ /]([\w.]+)/.exec(ua) ||
    /(opr)[ /]([\w.]+)/.exec(ua) ||
    /(chrome)[ /]([\w.]+)/.exec(ua) ||
    /(safari)[ /]([\w.]+)/.exec(ua) ||
    /(firefox)[ /]([\w.]+)/.exec(ua) ||
    (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
    []

  const versionMatch = /(version)[ /]([\w.]+)/.exec(ua)

  let platform_match = /(ipad)/.exec(ua) ||
    /(iphone)/.exec(ua) ||
    /(windows)/.exec(ua) ||
    /(android)/.exec(ua) || ['']

  let browser = match[1] || ''

  if (browser === 'edge') {
    platform_match = ['']
  }

  if (browser === 'opr') {
    browser = 'opera'
  }

  let version: string = match[2] || '0'
  if (versionMatch && versionMatch.length > 2) {
    version = versionMatch[2]
  }

  let versionMajor = Number.parseInt(version.split('.')[0])

  if (isNaN(versionMajor)) {
    versionMajor = 0
  }

  return {
    browser: browser,
    version: version,
    platform: platform_match[0] || '',
    versionMajor: versionMajor,
  }
}

export const getDevicesProfile = () => {
  const DevicesProfile: DevicesProfile = {
    MaxStreamingBitrate: 120000000,
    MaxStaticBitrate: 100000000,
    MusicStreamingTranscodingBitrate: 384000,
    SubtitleProfiles: [
      {
        Format: 'vtt',
        Method: 'External',
      },
      {
        Format: 'ass',
        Method: 'External',
      },
      {
        Format: 'ssa',
        Method: 'External',
      },
    ],
    ResponseProfiles: [
      {
        Type: 'Video',
        Container: 'mp4',
        MimeType: 'video/mp4',
      },
    ],
  }

  const directProfile = ContainerCodec.reduce<{ [index: string]: DirectPlayProfile }>((pre, cur) => {
    if (MediaSource.isTypeSupported(cur.codec)) {
      pre[cur.container] = {
        Container: cur.container,
        Type: 'Video',
        VideoCodec: pre[cur.container]?.VideoCodec ?? '',
        AudioCodec: pre[cur.container]?.AudioCodec ?? '',
      }
      if (cur.type === 'Video') {
        pre[cur.container].VideoCodec =
          pre[cur.container].VideoCodec === ''
            ? cur.name
            : pre[cur.container].VideoCodec + ',' + cur.name
      } else {
        pre[cur.container].AudioCodec =
          pre[cur.container].AudioCodec === ''
            ? cur.name
            : pre[cur.container].AudioCodec + ',' + cur.name
      }
    }
    return pre
  }, {})

  DevicesProfile.DirectPlayProfiles = Object.values(directProfile)
  if (window.MediaSource) {
    DevicesProfile.TranscodingProfiles = [
      {
        Container: 'ts',
        Type: 'Video',
        AudioCodec: 'aac',
        VideoCodec: 'h264',
        Context: 'Streaming',
        Protocol: 'hls',
        MaxAudioChannels: '2',
        MinSegments: '1',
        BreakOnNonKeyFrames: true,
      },
    ]
  }
  return DevicesProfile
}
