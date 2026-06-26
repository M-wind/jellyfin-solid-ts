import { DeviceProfile } from '../option'
// import { getDevicesProfile } from '../utils'
import http from './http'

export const getBaseUrl = () => http.getBaseUrl()

export const getSystemInfoPublic = async (url: string) => {
  const res = await http.get<SystemInfoPublic>(url + '/System/Info/Public')
  return res.data
}

export const authByUserName = async (name: string, pwd: string) => {
  const res = await http.post<AuthByUserName>('/Users/authenticatebyname', {
    params: {
      Username: name,
      Pw: pwd,
    },
  })
  return res.data
}

export const logout = async () => {
  return await http.post('/Sessions/Logout')
}

export const updateAuth = (auth: string) => {
  let authorization = http.getHeader('Authorization')!
  const index = authorization.indexOf('Token')
  if (index === -1) {
    authorization = authorization + `,Token="${auth}"`
  } else {
    const oldOuth = authorization.substring(index + 7, authorization.length - 1)
    authorization = authorization.replace(oldOuth, auth)
  }
  http.setHeader('Authorization', authorization)
  return authorization
}

export const getSystemInfo = async () => {
  const res = await http.get<SystemInfo>('/System/Info')
  return res.data
}

export const initConfig = (baseUrl: string, token: string) => {
  http.setBaseUrl(baseUrl)
  http.setHeader('Authorization', token)
}

export const startupUser = async (user: StartupUser) => {
  const res = await http.post('/Startup/User', { params: user })
  return res.status
}

export const startupConfiguration = async (data: StartUpConfiguration) => {
  http.post('/Startup/Configuration', { params: data })
}

export const startupRemoteAccess = async () => {
  http.post('/Startup/RemoteAccess', {
    params: {
      EnableAutomaticPortMapping: false,
      EnableRemoteAccess: true,
    },
  })
}

export const getUserViews = async (userId: string) => {
  const res = await http.get<UserViews>('/UserViews', {
    params: { UserId: userId },
  })
  return res.data
}

export const startupComplete = async () => {
  http.post('/Startup/Complete')
}

export const getStarupUser = async () => {
  const res = await http.get('/Startup/User')
  return res.status
}

export const getWizardCongiguration = async () => {
  const res = await http.get<StartUpConfiguration>('/Startup/Configuration')
  return res.data
}

export const getLanguage = async () => {
  const res = await http.get<SelectorDataType<string>[]>('/Localization/Options')
  return res.data
}

export const getMediaLibrary = async () => {
  const res = await http.get<VirtualFolder[]>('/Library/VirtualFolders')
  return res.data
}

export const setMediaLibrary = async (name: string, type: CollectionType, opt: LibraryOptions) => {
  const url = `/Library/VirtualFolders?collectionType=${type}&refreshLibrary=true&name=${name}`
  return http.post(url, { params: { LibraryOptions: opt } })
}

export const updateMediaLibrary = async (id: string, opt: LibraryOptions) => {
  return http.post('/Library/VirtualFolders/LibraryOptions', {
    params: {
      Id: id,
      LibraryOptions: opt,
    },
  })
}

export const renameMediaLibrary = async (name: string, newName: string) => {
  const url = `/Library/VirtualFolders/Name?refreshLibrary=true&newName=${newName}&name=${name}`
  const res = http.post(url)
  return res
}

export const deleteMediaLibrary = async (name: string) => {
  return http.delete('/Library/VirtualFolders', {
    params: { refreshLibrary: true, name },
  })
}

export const getCulture = async (): Promise<SelectorDataType<string>[]> => {
  const res = await http.get('/Localization/cultures')
  const data = await res.data
  return data.map((v: any) => {
    return { Name: v.DisplayName, Value: v.TwoLetterISOLanguageName }
  })
}

export const getCountry = async (): Promise<SelectorDataType<string>[]> => {
  const res = await http.get('/Localization/countries')
  const data = await res.data
  return data.map((v: any) => {
    return { Name: v.DisplayName, Value: v.TwoLetterISORegionName }
  })
}

export const getAvailableOptions = async (type: CollectionType) => {
  const res = await http.get<AvailableOptions>('/Libraries/AvailableOptions', {
    params: {
      LibraryContentType: type,
      IsNewLibrary: false,
    },
  })
  return res.data
}

export const getDriver = async () => {
  const res = await http.get<EnvironmentDrivers[]>('/Environment/Drives')
  return res.data
}

export const getDeepPaths = async (path: string) => {
  const res = await http.get<EnvironmentDrivers[]>('/Environment/DirectoryContents', {
    params: {
      includeDirectories: true,
      path,
    },
  })
  return res.data
}

export const getMediaSuggestions = async (userId: string, type: MediaType) => {
  const res = await http.get<MediaItems>(`/Users/${userId}/Suggestions`, {
    params: { type, limit: 10 },
  })
  return res.data
}

export const getCodecProfile = async () => {
  const res = await http.get<CodecProfileOption>('/System/Configuration/encoding')
  return res.data
}

export const setCodecProfile = async (data?: CodecProfileOption) => {
  const res = await http.post('/System/Configuration/encoding', {
    params: data,
  })
  return res.status
}

export const getAllPersons = async (userId: string, params?: PersonSearchParam) => {
  const res = await http.get<MediaItems>('/Persons', {
    params: {
      userId,
      personTypes: 'Actor',
      fields: 'Overview,ExternalUrls,ProductionLocations',
      enableUserData: false,
      ...params,
    },
  })
  return res.data
}

export const getPersonByName = async (name: string) => {
  const res = await http.get<MediaInfoDetail>(`/Persons/${name}`)
  return res.data
}

export const getPersonById = async (userId: string, personId: string, personType: string) => {
  const res = await http.get<MediaInfoDetail>(`/Users/${userId}/Items/${personId}`, {
    params: {
      PersonType: personType,
      Fields: 'Overview,ExternalUrls,ProductionLocations',
      enableUserData: false,
    },
  })
  return res.data
}

export const getYears = async (userId: string, type: MediaType) => {
  const res = await http.get<MediaItems>('/Years', {
    params: {
      userId,
      includeItemTypes: type,
      sortBy: 'SortName',
      sortOrder: 'Ascending',
      enableUserData: false,
    },
  })
  return res.data
}

export const markPlayed = async (userId: string, itemId: string) => {
  const date = new Date().toISOString()
  // return http.post<UserData>(`/Users/${userId}/PlayedItems/${itemId}?DatePlayed=${date}`)
  return http.post<UserData>(`/Users/${userId}/PlayedItems/${itemId}`, {
    params: { DatePlayed: date },
  })
}

export const markUnplayed = async (userId: string, itemId: string) => {
  return http.delete<UserData>(`/Users/${userId}/PlayedItems/${itemId}`)
}

export const markFavorite = async (userId: string, itemId: string) => {
  return http.post<UserData>(`/Users/${userId}/FavoriteItems/${itemId}`)
}

export const markUnFavorite = async (userId: string, itemId: string) => {
  return http.delete<UserData>(`/Users/${userId}/FavoriteItems/${itemId}`)
}

export const itemRefresh = async (itemId: string, o: RefreshOptions) => {
  const url = `/Items/${itemId}/Refresh?metadataRefreshMode=${o.metadataRefreshMode}&imageRefreshMode=${o.imageRefreshMode}&replaceAllMetadata=${o.replaceAllMetadata}&replaceAllImages=${o.replaceAllImages}&regenerateTrickplay=${o.regenerateTrickplay}`
  const res = http.post(url)
  return res
}

export const getLocalTrailer = async (userId: string, itemId: string) => {
  const res = await http.get<MediaInfoDetail[]>(`/Users/${userId}/Items/${itemId}/LocalTrailers`)
  const data = await res.data
  if (data.length > 0) return data[0]
}

export const getMediaItemsByType = async (
  userId: string,
  type: string | undefined,
  option?: MediaItemOption,
) => {
  const res = await http.get<MediaItems>(`/Users/${userId}/Items`, {
    params: {
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      Fields: 'Overview,Width',
      Recursive: true,
      IncludeItemTypes: type,
      ...option,
    },
  })
  return res.data
}

export const getMediaItemById = async (id: string) => {
  const res = await http.get<MediaInfoDetail>(`/Items/${id}`)
  return res.data
}

export const getPalybackInfo = async (itemId: string, option: PlaybackInfoOption) => {
  const res = await http.post<PlaybackInfo>(`/Items/${itemId}/PlaybackInfo`, {
    params: {
      ...option,
      // DeviceProfile: getDevicesProfile(),
      DeviceProfile,
    },
  })
  return res.data
}

export const playingStopped = async (option: Sessions) => {
  http.post('/Sessions/Playing/Stopped', { params: option })
}

export const playingProgress = async (option: Sessions) => {
  http.post('/Sessions/Playing/Progress', { params: option })
}

export const getAllItemByGenres = async (userId: string, type: MediaType, option?: MediaItemOption) => {
  const res = await http.get<MediaItems>('/Genres', {
    params: {
      UserId: userId,
      IncludeItemTypes: type,
      Recursive: true,
      EnableTotalRecordCount: false,
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      ...option,
    },
  })
  return res.data
}
// , includeItemTypes:"Movie,Series,Episode,Person"
export const getSearch = async (userId: string, name: string, types: string) => {
  const res = await http.get<SearchResult>('/Search/Hints', {
    params: { userId, searchTerm: name, includeItemTypes: types },
  })
  return res.data
}

export const addFolderPath = async (name: string, pathInfo: PathInfo) => {
  const res = await http.post('/Library/VirtualFolders/Paths?refreshLibrary=true', {
    params: {
      Name: name,
      PathInfo: pathInfo,
    },
  })
  return res
}

export const deleteFolderPath = async (name: string, path: string) => {
  const res = await http.delete('/Library/VirtualFolders/Paths', {
    params: {
      name,
      path,
      refreshLibrary: true,
    },
  })
  return res
}

export const getDevicesByUserId = async (userId: string) => {
  const res = await http.get('/Devices', {
    params: { userId },
  })
  return res.data
}

export const getDevicesInfoById = async (id: string) => {
  const res = await http.get('/Devices/Info', {
    params: { id },
  })
  return res.data
}
