type StartUpConfiguration = {
  UICulture: string
  MetadataCountryCode: string
  PreferredMetadataLanguage: string
}

type SystemInfoPublic = {
  LocalAddress: string
  Version: string
  StartupWizardCompleted: boolean
}

type User = {
  Name: string
  ServerId: string
  Id: string
}

type AuthByUserName = {
  AccessToken: string
  ServerId: string
  User: User
}

interface SystemInfo extends SystemInfoPublic {
  OperatingSystemDisplayName: string
  HasPendingRestart: boolean
  IsShuttingDown: boolean
  SupportsLibraryMonitor: boolean
  WebSocketPortNumber: number
  // CompletedInstallations: []
  CanSelfRestart: boolean
  CanLaunchWebBrowser: boolean
  ProgramDataPath: string
  WebPath: string
  ItemsByNamePath: string
  CachePath: string
  LogPath: string
  InternalMetadataPath: string
  TranscodingTempPath: string
  // CastReceiverApplications: [{ Id: 'F007D354'; Name: 'Stable' }, { Id: '6F511C87'; Name: 'Unstable' }]
  HasUpdateAvailable: boolean
  EncoderLocation: string
  SystemArchitecture: string
  ServerName: string
  OperatingSystem: string
  Id: string
}

type StartupUser = {
  Name: string
  Password: string
}

type EnvironmentDrivers = {
  Name: string
  Path: string
  Type: string
}

type PathInfo = {
  Path: string
}

type SelectorDataType<T> = {
  Name: string
  Value: T
}

type ToggleDataType = {
  Name: string
  DefaultEnabled: boolean
}

type HardwareDecodeType =
  | 'EnableDecodingColorDepth10Hevc'
  | 'EnableDecodingColorDepth10Vp9'
  | 'EnableDecodingColorDepth10HevcRext'
  | 'EnableDecodingColorDepth12HevcRext'

type HardwareEncodeType = 'AllowHevcEncoding' | 'AllowAv1Encoding'

type MediaType = 'Movie' | 'Series'
type SeriesOption = 'Season' | 'Episode'
type Pages =
  | 'Home'
  | 'Detail'
  | 'Episode'
  | 'Title'
  | 'Video'
  | 'Genres'
  | 'Years'
  | 'Actors'
  | 'CodecProfile'
  | 'Logout'
  | 'MediaLibrary'
  | 'Search'
  | 'MarkPlayed'
  | 'MarkUnplayed'
  | 'Filter'

type TypeOption = {
  Type: MediaType | SeriesOption
  MetadataFetcherOrder: string[]
  MetadataFetchers: string[]
  ImageFetcherOrder: string[]
  ImageFetchers: string[]
}

type LibraryOptions = {
  EnableArchiveMediaFiles: boolean
  EnablePhotos: boolean
  EnableRealtimeMonitor: boolean
  ExtractChapterImagesDuringLibraryScan: boolean
  EnableChapterImageExtraction: boolean
  EnableInternetProviders: boolean
  SaveLocalMetadata: boolean
  EnableAutomaticSeriesGrouping: boolean
  PreferredMetadataLanguage: string
  MetadataCountryCode: string
  SeasonZeroDisplayName: string
  AutomaticRefreshIntervalDays: number
  EnableEmbeddedTitles: boolean
  EnableEmbeddedEpisodeInfos: boolean
  AllowEmbeddedSubtitles: string
  SkipSubtitlesIfEmbeddedSubtitlesPresent: boolean
  SkipSubtitlesIfAudioTrackMatches: boolean
  SaveSubtitlesWithMedia: boolean
  RequirePerfectSubtitleMatch: boolean
  AutomaticallyAddToCollection: boolean
  MetadataSavers: string[]
  TypeOptions: TypeOption[]
  LocalMetadataReaderOrder: string[]
  SubtitleDownloadLanguages: []
  DisabledSubtitleFetchers: []
  SubtitleFetcherOrder: []
  PathInfos: PathInfo[]
}

type VirtualFolder = {
  Name: string
  Locations: string[]
  CollectionType: CollectionType
  LibraryOptions: LibraryOptions
  ItemId: string
  PrimaryImageItemId: string
  RefreshStatus: string
}

type ImageType = 'Primary' | 'Backdrop' | 'Logo' | 'Banner' | 'Thumb' | 'Art'

type ImageOption = {
  Type: ImageType
  Limit: number
  MinWidth: number
}

type TypeOptions = {
  Type: MediaType | SeriesOption
  MetadataFetchers: ToggleDataType[]
  ImageFetchers: ToggleDataType[]
  SupportedImageTypes?: ImageType[]
  DefaultImageOptions?: ImageOption[]
}

type TypeOptionsConvert = {
  [key: string]: TypeOptions
}

type CollectionType =
  | 'movies'
  | 'tvshows'
  | 'music'
  | 'homevideos'
  | 'books'
  | 'musiccvideos'
  | 'mixed'
  | ''

type AvailableOptions = {
  MetadataSavers: ToggleDataType[]
  MetadataReaders?: ToggleDataType[]
  SubtitleFetchers?: ToggleDataType[]
  LyricFetchers?: ToggleDataType[]
  TypeOptions: TypeOptions[]
}

type AvailableOptionsConvert = {
  MetadataSavers: ToggleDataType[]
  MetadataReaders?: ToggleDataType[]
  SubtitleFetchers?: ToggleDataType[]
  LyricFetchers?: ToggleDataType[]
  TypeOptions: TypeOptionsConvert
}

type MediaItems = {
  Items: MediaInfoDetail[]
  StartIndex: number
  TotalRecordCount: number
}

type MediaItemOption = {
  IncludeItemTypes?: string | undefined
  SortBy?: string
  SortOrder?: string
  Fields?: string
  StartIndex?: number
  Limit?: number
  ParentId?: string
  EnableTotalRecordCount?: boolean
  GenreIds?: string
  Years?: string
  PersonIds?: string
}

type IndexString = {
  [index: string]: string
}

type ImageBlurHashes = {
  [key in ImageType]?: IndexString
}

type ImageTags = {
  [key in ImageType]?: string
}

type Genres = {
  Name: string
  Id: string
}

type UserData = {
  PlayedPercentage?: number
  UnplayedItemCount?: number
  PlaybackPositionTicks: number
  PlayCount: number
  IsFavorite: boolean
  Played: boolean
  Key: string
  ItemId?: string
}

interface MediaInfo {
  Name: string
  Id: string
  OfficialRating?: string
  CommunityRating?: number
  RunTimeTicks: number
  ProductionYear?: number
  IsFolder: boolean
  Type: MediaType | SeriesOption
  Overview?: string
  Genres: Genres[]
  ImageBlurHashes?: ImageBlurHashes
  ImageTags: ImageTags
  BackdropImageTags: string[]
  ParentBackdropItemId?: string
  ParentBackdropImageTags?: string[]
  Width?: number
  Height?: number
  ChildCount?: number
  UserData: UserData
}

type People = {
  Name: string
  Id: string
  Role?: string
  Type: string
  PrimaryImageTag?: string
}

interface EpisodeInfo extends MediaInfo {
  ParentBackdropImageTags?: string[]
  ParentBackdropItemId?: string
  ParentLogoImageTag?: string
  ParentLogoItemId?: string
  PremiereDate?: string
  SeasonId: string
  SeasonName: string
  SeriesId: string
  SeriesName: string
  SeriesPrimaryImageTag?: string
  SortName: string
  IndexNumber: number
  ParentIndexNumber: number
}

interface MediaInfoDetail extends MediaInfo, EpisodeInfo {
  ParentId: string
  Container?: string
  OriginalTitle?: string
  SortName: string
  ExternalUrls: {
    Name: string
    Url: string
  }[]
  ProductionLocations?: string[]
  PrimaryImageAspectRatio?: number
  Path: string
  Taglines: string[]
  Tags: string[]
  MediaType?: string
  IsHD?: boolean
  People: People[]
  Studios: {
    Name: string
    Id: string
  }[]
  GenreItems: {
    Name: string
    Id: string
  }[]
  LocalTrailerCount: number
  MediaStreams?: MediaStreamType[]
  Chapters?: Chapters[]
}

type Chapters = {
  StartPositionTicks: number
  Name: string
  ImageDateModified: string
  ImagePath?: string
  ImageTag?: string
}

type StreamType = 'Video' | 'Audio' | 'Subtitle'

type SourceMedia = {
  Protocol: string
  Id: string
  Path: string
  Type: string
  Container: string
  Size: number
  Name: string
  IsRemote: boolean
  ETag: string
  RunTimeTicks: number
  ReadAtNativeFramerate: boolean
  IgnoreDts: boolean
  IgnoreIndex: boolean
  GenPtsInput: boolean
  SupportsTranscoding: boolean
  SupportsDirectStream: boolean
  SupportsDirectPlay: boolean
  IsInfiniteStream: boolean
  RequiresOpening: boolean
  RequiresClosing: boolean
  RequiresLooping: boolean
  SupportsProbing: boolean
  VideoType: string
  MediaStreams: MediaStreamType[]
  Bitrate: number
  TranscodingUrl?: string
  TranscodingSubProtocol?: string
  TranscodingContainer?: string
  DefaultAudioStreamIndex: number
  DefaultSubtitleStreamIndex: number
}

type PlaybackInfo = {
  MediaSources: SourceMedia[]
  PlaySessionId: string
  ErrorCode?: string
}

type PlaybackInfoOption = {
  UserId?: string
  MaxStreamingBitrate?: number
  StartTimeTicks?: number
  AudioStreamIndex?: number
  SubtitleStreamIndex?: number
  MediaSourceId?: string
  EnableTranscoding?: boolean
  EnableDirectPlay?: boolean
  EnableDirectStream?: boolean
  LiveStreamId?: string
  AutoOpenLiveStream?: boolean
  AllowVideoStreamCopy?: boolean
  AllowAudioStreamCopy?: boolean
}

type MediaResolution = '8K' | '4K' | 'HD' | 'SD'

type MediaStreamType = VideoStream | AudioStream | SubtitleStream

type SubtitleStream = {
  Codec: string
  Language: string
  TimeBase: string
  Title: string
  LocalizedUndefined: string
  LocalizedDefault: string
  LocalizedForced: string
  LocalizedExternal: string
  DisplayTitle: string
  IsInterlaced: boolean
  IsDefault: boolean
  IsForced: boolean
  Type: StreamType
  Index: number
  Score?: number
  IsExternal: boolean
  IsTextSubtitleStream: boolean
  SupportsExternalStream: boolean
  Level: number
  DeliveryMethod?: string
  DeliveryUrl?: string
}

type AudioStream = {
  Codec: string
  Language: string
  TimeBase: string
  Title: string
  DisplayTitle: string
  IsInterlaced: boolean
  ChannelLayout: string
  BitRate: number
  BitDepth?: number
  Channels: number
  SampleRate: number
  IsDefault: boolean
  IsForced: boolean
  Type: StreamType
  Index: number
  IsExternal: boolean
  IsTextSubtitleStream: boolean
  SupportsExternalStream: boolean
  Level: number
}

type VideoStream = {
  Codec: string
  ColorSpace?: string
  ColorTransfer?: string
  ColorPrimaries?: string
  TimeBase: string
  VideoRange: string
  VideoRangeType: string
  DisplayTitle: string
  IsInterlaced: false
  BitRate: number
  BitDepth: number
  RefFrames: number
  IsDefault: boolean
  IsForced: boolean
  Height: number
  Width: number
  AverageFrameRate: number
  RealFrameRate: number
  Profile: string
  Type: StreamType
  AspectRatio: string
  Index: number
  IsExternal: boolean
  IsTextSubtitleStream: boolean
  SupportsExternalStream: boolean
  PixelFormat: string
  Level: number
}

type Sessions = {
  ItemId: string
  PlaySessionId?: string
  MediaSourceId?: string
  PositionTicks: number
  AudioStreamIndex?: number
  SubtitleStreamIndex?: number
}

type CodecProfileOption = {
  TrancodingTempPath: string
  EncodingThreadCount: number
  EnableFallbackFont: boolean
  EnableAudioVbr: boolean
  DownMixAudioBoost: number
  DownMixStereoAlgorithm: string
  MaxMuxingQueueSize: number
  EnableThrottling: boolean
  ThrottleDelaySeconds: number
  EnableSegmentDeletion: boolean
  SegmentKeepSeconds: number
  HardwareAccelerationType: string
  EncoderAppPathDisplay: string
  VaapiDevice: string
  QsvDevice: string
  EnableTonemapping: boolean
  EnableVppTonemapping: boolean
  EnableVideoToolboxTonemapping: boolean
  TonemappingAlgorithm: string
  TonemappingMode: string
  TonemappingRange: string
  TonemappingDesat: number
  TonemappingPeak: number
  TonemappingParam: number
  VppTonemappingBrightness: number
  VppTonemappingContrast: number
  H264Crf: number
  H265Crf: number
  DeinterlaceDoubleRate: boolean
  DeinterlaceMethod: string
  EnableDecodingColorDepth10Hevc: boolean
  EnableDecodingColorDepth10Vp9: boolean
  EnableDecodingColorDepth10HevcRext: boolean
  EnableDecodingColorDepth12HevcRext: boolean
  EnableEnhancedNvdecDecoder: boolean
  PreferSystemNativeHwDecoder: boolean
  EnableIntelLowPowerH264HwEncoder: boolean
  EnableIntelLowPowerHevcHwEncoder: boolean
  EnableHardwareEncoding: boolean
  AllowHevcEncoding: boolean
  AllowAv1Encoding: boolean
  EnableSubtitleExtraction: boolean
  HardwareDecodingCodecs: string[]
  AllowOnDemandMetadataBasedKeyframeExtractionForExtensions: string[]
  TranscodingTempPath: string
  FallbackFontPath: string
  EncoderPreset: string
}

type UserViewItem = {
  Name: string
  ServerId: string
  Id: string
  Etag: string
  DateCreated: string
  CanDelete: boolean
  CanDownload: boolean
  SortName: string
  ExternalUrls: []
  Path: string
  EnableMediaSourceDisplay: boolean
  PlayAccess: string
  IsFolder: boolean
  ParentId: string
  Type: string
  LocalTrailerCount: number
  UserData: UserData
  ChildCount: number
  SpecialFeatureCount: number
  DisplayPreferencesId: string
  CollectionType: CollectionType
  LocationType: string
  MediaType: string
  LockData: boolean
}

type UserViews = {
  Items: UserViewItem[]
  TotalRecordCount: number
  StartIndex: number
}

type SearchResult = {
  SearchHints: SearchItems[]
  TotalRecordCount: number
}

type SearchItems = {
  Id: string
  ItemId: string
  Name: string
  MediaType: string
  PrimaryImageAspectRatio: number
  BackdropImageItemId: string
  PrimaryImageTag: string
  BackdropImageTag: string
  ProductionYear: number
  RunTimeTicks: number
  Type: string
  Series: string
  ParentIndexNumber: number
  IndexNumber: number
}

type PersonSearchParam = {
  limit?: number
  fiedls?: string
  enableUserData?: boolean
  appearsInItemId?: string
  personTypes?: string
}

type DirectPlayProfile = {
  Container: string
  Type: string
  VideoCodec: string
  AudioCodec: string
}

type TranscodingProfile = {
  Container: string
  Type: string
  AudioCodec: string
  VideoCodec?: string
  Context: string
  Protocol: string
  MaxAudioChannels: string
  MinSegments?: string
  BreakOnNonKeyFrames?: boolean
}

type DevicesProfile = {
  MaxStreamingBitrate: number
  MaxStaticBitrate: number
  MusicStreamingTranscodingBitrate: number
  SubtitleProfiles: {
    Format: string
    Method: string
  }[]
  ResponseProfiles: {
    Type: string
    Container: string
    MimeType: string
  }[]
  DirectPlayProfiles?: DirectPlayProfile[]
  TranscodingProfiles?: TranscodingProfile[]
}

type RefreshMode = 'None' | 'ValidationOnly' | 'Default' | 'FullRefresh'

type RefreshOptions = {
  metadataRefreshMode: RefreshMode
  imageRefreshMode: RefreshMode
  replaceAllMetadata: boolean
  replaceAllImages: boolean
  regenerateTrickplay: boolean
}

type FilterOPtion = {
  unPlayed: boolean
}
