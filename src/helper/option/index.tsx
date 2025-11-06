export const initLibraryOptions = (): LibraryOptions => {
  return {
    EnableArchiveMediaFiles: false,
    EnablePhotos: true,
    EnableRealtimeMonitor: true,
    ExtractChapterImagesDuringLibraryScan: false,
    EnableChapterImageExtraction: false,
    EnableInternetProviders: true,
    SaveLocalMetadata: false,
    EnableAutomaticSeriesGrouping: false,
    PreferredMetadataLanguage: '',
    MetadataCountryCode: '',
    SeasonZeroDisplayName: 'Specials',
    AutomaticRefreshIntervalDays: 0,
    EnableEmbeddedTitles: false,
    EnableEmbeddedEpisodeInfos: false,
    AllowEmbeddedSubtitles: 'AllowAll',
    SkipSubtitlesIfEmbeddedSubtitlesPresent: false,
    SkipSubtitlesIfAudioTrackMatches: false,
    SaveSubtitlesWithMedia: true,
    RequirePerfectSubtitleMatch: true,
    AutomaticallyAddToCollection: false,
    MetadataSavers: [],
    TypeOptions: [],
    LocalMetadataReaderOrder: ['Nfo'],
    SubtitleDownloadLanguages: [],
    DisabledSubtitleFetchers: [],
    SubtitleFetcherOrder: [],
    PathInfos: [],
  }
}

export const ContainerCodec = [
  { container: 'mp4', type: 'Video', name: 'h264', codec: 'video/mp4; codecs="avc1.4d002a"' },
  { container: 'mp4', type: 'Video', name: 'av1', codec: 'video/mp4; codecs="av1"' },
  { container: 'mp4', type: 'Video', name: 'vp8', codec: 'video/mp4; codecs="vp8"' },
  { container: 'mp4', type: 'Video', name: 'vp9', codec: 'video/mp4; codecs="vp9"' },
  { container: 'mp4', type: 'Video', name: 'hevc', codec: 'video/mp4; codecs="hev1.2.4.L120.B0"' },
  { container: 'mp4', type: 'Audio', name: 'eac3', codec: 'audio/mp4; codecs="ec-3"' },
  { container: 'mp4', type: 'Audio', name: 'ac3', codec: 'audio/mp4; codecs="ac-3"' },
  { container: 'mp4', type: 'Audio', name: 'mp3', codec: 'audio/mp4; codecs="mp3"' },
  { container: 'mp4', type: 'Audio', name: 'opus', codec: 'video/mp4; codecs="Opus"' },
  { container: 'mp4', type: 'Audio', name: 'aac', codec: 'video/mp4; codecs="avc1.640029, mp4a.40.2"' },

  { container: 'webm', type: 'Video', name: 'av1', codec: 'video/webm; codecs="av1"' },
  { container: 'webm', type: 'Video', name: 'vp8', codec: 'video/webm; codecs="vp8"' },
  { container: 'webm', type: 'Video', name: 'vp9', codec: 'video/webm; codecs="vp9"' },
  { container: 'webm', type: 'Audio', name: 'opus', codec: 'video/mp4; codecs="Opus"' },

  { container: 'mkv', type: 'Video', name: 'h264', codec: 'video/x-matroska; codecs="avc1.4d002a"' },
  { container: 'mkv', type: 'Video', name: 'av1', codec: 'video/x-matroska; codecs="av1"' },
  { container: 'mkv', type: 'Video', name: 'vp8', codec: 'video/x-matroska; codecs="vp8"' },
  { container: 'mkv', type: 'Video', name: 'vp9', codec: 'video/x-matroska; codecs="vp9"' },
  {
    container: 'mkv',
    type: 'Video',
    name: 'hevc',
    codec: 'video/x-matroska; codecs="hev1.2.4.L120.B0"',
  },
  { container: 'mkv', type: 'Audio', name: 'eac3', codec: 'audio/x-matroska; codecs="ec-3"' },
  { container: 'mkv', type: 'Audio', name: 'ac3', codec: 'audio/x-matroska; codecs="ac-3"' },
  { container: 'mkv', type: 'Audio', name: 'mp3', codec: 'audio/x-matroska; codecs="mp3"' },
  { container: 'mkv', type: 'Audio', name: 'opus', codec: 'videox-matroska; codecs="Opus"' },
  {
    container: 'mkv',
    type: 'Audio',
    name: 'aac',
    codec: 'video/x-matroska; codecs="avc1.640029, mp4a.40.2"',
  },
]

export const EveryNDays = (t: NT): SelectorDataType<number>[] => {
  return [
    { Name: t('Never'), Value: 0 },
    { Name: t('EveryNDays', ['30']), Value: 30 },
    { Name: t('EveryNDays', ['60']), Value: 60 },
    { Name: t('EveryNDays', ['90']), Value: 90 },
  ]
}

export const EmbeddedSubtitles = (t: NT): SelectorDataType<string>[] => {
  return [
    { Name: t('AllowEmbeddedSubtitlesAllowAllOption'), Value: 'AllowAll' },
    { Name: t('AllowEmbeddedSubtitlesAllowTextOption'), Value: 'AllowText' },
    { Name: t('AllowEmbeddedSubtitlesAllowImageOption'), Value: 'AllowImage' },
    { Name: t('AllowEmbeddedSubtitlesAllowNoneOption'), Value: 'AllowNone' },
  ]
}

export const RefreshTypes = (t: NT): SelectorDataType<string>[] => {
  return [
    { Name: t('ScanForNewAndUpdatedFiles'), Value: 'ScanForNewAndUpdatedFiles' },
    { Name: t('SearchForMissingMetadata'), Value: 'SearchForMissingMetadata' },
    { Name: t('ReplaceAllMetadata'), Value: 'ReplaceAllMetadata' },
  ]
}

export const SearchTypeOptions: ToggleDataType[] = [
  { Name: 'Movie', DefaultEnabled: true },
  { Name: 'Series', DefaultEnabled: true },
  { Name: 'Episode', DefaultEnabled: true },
  { Name: 'Person', DefaultEnabled: true },
]

export const HardwareDecodeOptions = (t: NT): SelectorDataType<string>[] => {
  return [
    { Name: t('None'), Value: 'none' },
    { Name: 'AMD AMF', Value: 'amf' },
    { Name: 'Nvidia NVENC', Value: 'nvenc' },
    { Name: 'Intel QuickSync(QSV)', Value: 'qsv' },
    { Name: 'Video Accelertion API(VAAPI)', Value: 'vaapi' },
    { Name: 'Rockchip MPP(RKMPP)', Value: 'rkmpp' },
    { Name: 'Apple VideoToolBox', Value: 'videotoolbox' },
    { Name: 'Video4Linux2(V4L2)', Value: 'v4l2m2m' },
  ]
}

export const HardwareDecodeTypeOptions: { [index: string]: ToggleDataType[] } = {
  amf: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: false },
    { Name: 'mpeg2video', DefaultEnabled: false },
    { Name: 'vc1', DefaultEnabled: true },
    { Name: 'vp9', DefaultEnabled: true },
    { Name: 'av1', DefaultEnabled: true },
  ],
  nvenc: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: false },
    { Name: 'mpeg2video', DefaultEnabled: false },
    { Name: 'mpeg4', DefaultEnabled: false },
    { Name: 'vc1', DefaultEnabled: false },
    { Name: 'vp8', DefaultEnabled: false },
    { Name: 'vp9', DefaultEnabled: false },
    { Name: 'av1', DefaultEnabled: false },
  ],
  qsv: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: false },
    { Name: 'mpeg2video', DefaultEnabled: false },
    { Name: 'vc1', DefaultEnabled: false },
    { Name: 'vp8', DefaultEnabled: false },
    { Name: 'vp9', DefaultEnabled: false },
    { Name: 'av1', DefaultEnabled: false },
  ],
  vaapi: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: false },
    { Name: 'mpeg2video', DefaultEnabled: false },
    { Name: 'vc1', DefaultEnabled: false },
    { Name: 'vp8', DefaultEnabled: false },
    { Name: 'vp9', DefaultEnabled: false },
    { Name: 'av1', DefaultEnabled: false },
  ],
  rkmpp: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: false },
    { Name: 'mpeg1video', DefaultEnabled: false },
    { Name: 'mpeg2video', DefaultEnabled: false },
    { Name: 'mpeg4', DefaultEnabled: false },
    { Name: 'vp8', DefaultEnabled: false },
    { Name: 'vp9', DefaultEnabled: false },
    { Name: 'av1', DefaultEnabled: false },
  ],
  videotoolbox: [
    { Name: 'h264', DefaultEnabled: false },
    { Name: 'hevc', DefaultEnabled: true },
    { Name: 'vp8', DefaultEnabled: true },
    { Name: 'vp9', DefaultEnabled: true },
  ],
  v4l2m2m: [{ Name: 'h264', DefaultEnabled: true }],
}

export const HardwareEncodeTypeOptions = (t: NT): SelectorDataType<HardwareEncodeType>[] => {
  return [
    { Name: t('AllowHevcEncoding'), Value: 'AllowHevcEncoding' },
    { Name: t('AllowAv1Encoding'), Value: 'AllowAv1Encoding' },
  ]
}

export const HardwareDecodeTypeExtraOptions: {
  [index: string]: SelectorDataType<HardwareDecodeType>[]
} = {
  amf: [
    { Name: 'HEVC 10bit', Value: 'EnableDecodingColorDepth10Hevc' },
    { Name: 'VP9 10bit', Value: 'EnableDecodingColorDepth10Vp9' },
  ],
  nvenc: [
    { Name: 'HEVC 10bit', Value: 'EnableDecodingColorDepth10Hevc' },
    { Name: 'VP9 10bit', Value: 'EnableDecodingColorDepth10Vp9' },
    { Name: 'HEVC RExt 8/10bit', Value: 'EnableDecodingColorDepth10HevcRext' },
    { Name: 'HEVC RExt 12bit', Value: 'EnableDecodingColorDepth12HevcRext' },
  ],
  qsv: [
    { Name: 'HEVC 10bit', Value: 'EnableDecodingColorDepth10Hevc' },
    { Name: 'VP9 10bit', Value: 'EnableDecodingColorDepth10Vp9' },
    { Name: 'HEVC RExt 8/10bit', Value: 'EnableDecodingColorDepth10HevcRext' },
    { Name: 'HEVC RExt 12bit', Value: 'EnableDecodingColorDepth12HevcRext' },
  ],
  vaapi: [
    { Name: 'HEVC 10bit', Value: 'EnableDecodingColorDepth10Hevc' },
    { Name: 'VP9 10bit', Value: 'EnableDecodingColorDepth10Vp9' },
    { Name: 'HEVC RExt 8/10bit', Value: 'EnableDecodingColorDepth10HevcRext' },
    { Name: 'HEVC RExt 12bit', Value: 'EnableDecodingColorDepth12HevcRext' },
  ],
  rkmpp: [
    { Name: 'HEVC 10bit', Value: 'EnableDecodingColorDepth10Hevc' },
    { Name: 'VP9 10bit', Value: 'EnableDecodingColorDepth10Vp9' },
  ],
}

export const ContentOptions = (t: NT): SelectorDataType<CollectionType>[] => {
  return [
    { Name: '', Value: '' },
    { Name: t('Movies'), Value: 'movies' },
    { Name: t('Shows'), Value: 'tvshows' },
    // { Name: t('TabMusic'), Value: 'music' },
    // { Name: t('Books'), Value: 'books' },
    // { Name: t('Photos'), Value: 'homevideos' },
    // { Name: t('MusicVideos'), Value: 'musicvideos' },
    // { Name: t('MixedMoviesShows'), Value: 'mixed' }
  ]
}

export const LanguageCode: { [index: string]: string } = {
  zh: './img/zh.png',
  zho: './img/zh.png',
  chi: './img/zh.png',

  en: './img/en.png',
  eng: './img/en.png',

  es: './img/es.png',
  spa: './img/es.png',

  fr: './img/fr.png',
  fra: './img/fr.png',
  fre: './img/fr.png',

  ar: './img/ar.png',
  ara: './img/ar.png',

  ru: './img/ru.png',
  rus: './img/ru.png',

  pt: './img/pt.png',
  por: './img/pt.png',

  hi: './img/hi.png',
  hin: './img/hi.png',

  de: './img/de.png',
  ger: './img/de.png',
  deu: './img/de.png',

  ja: './img/ja.png',
  jpn: './img/ja.png',
  jap: './img/ja.png',

  uk: './img/uk.png',
  ukr: './img/uk.png',

  ko: './img/ko.png',
  kor: './img/ko.png',

  it: './img/it.png',
  ita: './img/it.png',

  vi: './img/vi.png',
  vie: './img/vi.png',

  th: './img/th.png',
  tha: './img/th.png',
  thai: './img/th.png',

  alb: './img/sq.png',
  sq: './img/sq.png',
  sqi: './img/sq.png',

  tr: './img/tr.png',
  tur: './img/tr.png',
}

export const letters = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

export const DeviceProfile = {
  // chatgpt
  DirectPlayProfiles: [
    {
      AudioCodec: 'vorbis,opus',
      Container: 'webm',
      Type: 'Video',
      VideoCodec: 'vp8,vp9,av1',
    },
    {
      AudioCodec: 'aac,mp3',
      Container: 'mp4, m4v',
      Type: 'Video',
      VideoCodec: 'h264',
    },
  ],
  MaxStaticBitrate: 100000000,
  MaxStreamingBitrate: 120000000,
  MusicStreamingTranscodingBitrate: 384000,
  ResponseProfiles: [
    {
      Container: 'mp4',
      MimeType: 'video/mp4',
      Type: 'Video',
    },
  ],
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
  TranscodingProfiles: [
    {
      AudioCodec: 'aac',
      BreakOnNonKeyFrames: true,
      Container: 'ts',
      // Container: 'mp4',
      Context: 'Streaming',
      MaxAudioChannels: '2',
      MinSegments: '1',
      Protocol: 'hls',
      Type: 'Video',
      VideoCodec: 'h264',
    },
  ],
}

export const StreamingBitrate = [
  { name: '40M', value: 40000000 },
  { name: '20M', value: 20000000 },
  { name: '15M', value: 15000000 },
  { name: '10M', value: 10000000 },
  { name: '8M', value: 8000000 },
  { name: '6M', value: 6000000 },
  { name: '4M', value: 4000000 },
  { name: '3M', value: 3000000 },
  { name: '1.5M', value: 1500000 },
  { name: '720K', value: 720000 },
  // { name: '420K', value: 420000 },
]
