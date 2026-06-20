import { AiFillHeart, AiOutlineCheck } from 'solid-icons/ai'
import { BiRegularCameraMovie, BiRegularMoviePlay, BiRegularWorld } from 'solid-icons/bi'
// import CicleProgress from '../../components/cicleProgress'
import { BiRegularFilm } from 'solid-icons/bi'
import { FaSolidAngleLeft, FaSolidAngleRight, FaSolidUser } from 'solid-icons/fa'
// import { decodeBlurHash, getBlurHashAverageColor } from 'fast-blurhash'
import { RiDesignBallPenLine, RiDocumentFoldersFill } from 'solid-icons/ri'
import { VsGroupByRefType } from 'solid-icons/vs'
import { For, type JSX, Show, batch } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Loading } from '../../components/svg'
import { useAppContext } from '../../context/AppContext'
import Avatar from '../avatar'
import Back from '../back'

import { FiPlayCircle } from 'solid-icons/fi'
import { SiImdb, SiThemoviedatabase, SiTrakt } from 'solid-icons/si'
import Button from '../../components/button'
import CarouselWrapper from '../../components/carousel'
import useContextMenu from '../../components/contextMenu'
import HashImage from '../../components/hashImage'
import {
  getLocalTrailer,
  getPersonById,
  markFavorite,
  markPlayed,
  markUnFavorite,
  markUnplayed,
} from '../../helper/api'
import {
  getBackDropImageUrl,
  getHash,
  getImageUrl,
  getPeopleByType,
  getPeopleImageUrl,
  getPeopleNamesByType,
  getStudio,
} from '../../helper/utils'

const MENU_ID = 'PERSON_MENU'

const Detail = () => {
  const { t, state, updateState } = useAppContext()

  const param = state.pages[state.pages.length - 1]
  const item: MediaInfoDetail = param.param?.data
  const mediaType: MediaType = param.param?.type

  const [personInfo, setPersonInfo] = createStore<{
    id: string
    detail: MediaInfoDetail | undefined
    status: 'pending' | 'ready' | 'unloaded'
  }>({
    id: '',
    detail: undefined,
    status: 'unloaded',
  })

  const { Menu, Item, show } = useContextMenu()

  const displayMenu = async (e: MouseEvent, id: string) => {
    if (id === personInfo.id) {
      if (personInfo.detail!.ExternalUrls.length > 0) {
        show(e, MENU_ID)
      }
      return
    }
    batch(() => {
      setPersonInfo('id', id)
      setPersonInfo('status', 'pending')
    })
    const data = await getPersonById(state.userId, id, 'Actor')
    batch(() => {
      setPersonInfo('detail', data)
      setPersonInfo('status', 'ready')
    })
    if (data.ExternalUrls.length > 0) {
      show(e, MENU_ID)
    }
  }

  const urlIcon: {
    [index: string]: JSX.Element
  } = {
    TMDB: <SiThemoviedatabase class='text-2xl' />,
    IMDb: <SiImdb class='text-2xl' />,
    Trakt: <SiTrakt class='text-2xl' />,
  }

  const [mediaStatus, setMedisStatus] = createStore({
    played: item.UserData.Played || false,
    favorite: item.UserData.IsFavorite || false,
  })

  const updateOriginData = () => {
    const pages = [...state.pages]
    const homeparam = pages.shift()
    const mediaItems: MediaItems =
      mediaType === 'Movie' ? homeparam?.param?.movies : homeparam?.param?.series
    const data: MediaInfoDetail[] = mediaItems.Items.map((v) => {
      if (v.Id === item.Id) {
        return {
          ...v,
          UserData: {
            ...v.UserData,
            Played: mediaStatus.played,
            IsFavorite: mediaStatus.favorite,
          },
        }
      }
      return v
    })
    if (mediaType === 'Movie') {
      pages.unshift({
        id: 'Home',
        param: { ...homeparam?.param, movies: { ...mediaItems, Items: data } },
      })
    } else {
      pages.unshift({
        id: 'Home',
        param: { ...homeparam?.param, series: { ...mediaItems, Items: data } },
      })
    }
    updateState('pages', pages)
  }

  const handlePlayed = () => {
    markPlayed(state.userId, item.Id).then((v) => {
      if (v.ok) {
        setMedisStatus('played', true)
        updateOriginData()
      }
    })
  }

  const handleUnPlayed = () => {
    markUnplayed(state.userId, item.Id).then((v) => {
      if (v.ok) {
        setMedisStatus('played', false)
        updateOriginData()
      }
    })
  }

  const handleFavorite = () => {
    markFavorite(state.userId, item.Id).then((v) => {
      if (v.ok) {
        setMedisStatus('favorite', true)
        updateOriginData()
      }
    })
  }

  const handleUnFavorite = () => {
    markUnFavorite(state.userId, item.Id).then((v) => {
      if (v.ok) {
        setMedisStatus('favorite', false)
        updateOriginData()
      }
    })
  }

  const goPlayOrBrowse = (v?: MediaInfoDetail) => {
    const pages = [...state.pages]
    pages.push({
      id: mediaType === 'Movie' ? 'Video' : 'Episode',
      param: { data: v || item },
    })
    updateState('pages', pages)
  }

  const { Carousel, scrollT, carouselOption } = CarouselWrapper({
    mode: 'mutex',
  })

  return (
    <div class='w-full h-full animate-fadeIn'>
      <img
        class='object-cover absolute top-0 left-0 w-full h-full brightness-30'
        src={getBackDropImageUrl(item.Id, item.BackdropImageTags)}
        alt=''
      />
      <div class='absolute left-0 top-0 flex h-[20%] w-full items-center justify-center'>
        <img class='h-[50%] disable-select' src={getImageUrl(item.Id, item.ImageTags, 'Logo')} />
      </div>
      <div class='absolute left-0 top-[30%] h-[70%] w-full bg-screen' />
      <Back />
      <Avatar />
      <div class='absolute left-[4%] top-[20%] flex h-[78%] [@media(max-height:40rem)]:h-full [@media(max-height:36rem)]:top-32 w-[92%] flex-col gap-[2%]'>
        <div class='h-[75%] w-full flex flex-row gap-[3%]'>
          <HashImage
            hash={getHash('Primary', item.ImageBlurHashes)}
            url={getImageUrl(item.Id, item.ImageTags, 'Primary')}
            class='rounded-xl shadow-xl disable-select aspect-primary'
          />
          <div class='flex flex-col gap-4 h-full'>
            <div class='flex items-center w-9/12 h-1/6 text-screen-title'>
              <p class='truncate'>{item.Name}</p>
            </div>
            <div class='flex flex-col gap-4 w-full h-5/6'>
              <p class='min-2xl:text-lg max-3xl:line-clamp-2 shrink-0 text-secondary'>
                &emsp;&emsp;{item.Overview?.trim() ?? ''}
              </p>
              <div class='flex gap-4 w-full h-6 text-primary'>
                <For each={item.ExternalUrls}>
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
              <div class='flex flex-col gap-2 w-full'>
                <OtherDetail item={item} t={t} />
              </div>
              <div class='flex flex-row justify-between items-end w-full h-full icon-screen'>
                <Button
                  onClick={() => goPlayOrBrowse()}
                  lable={mediaType === 'Movie' ? t('Play') : t('Browse')}
                  icon={mediaType === 'Movie' ? <FiPlayCircle /> : <RiDocumentFoldersFill />}
                  class='px-8 h-16 text-2xl font-semibold rounded-full bg-white/10 hover:bg-from-to'
                />

                <div class='flex gap-4'>
                  <Show when={item.LocalTrailerCount}>
                    <button
                      title={t('Trailer')}
                      class='p-1 rounded-md cursor-pointer hover:bg-from-to'
                      onClick={() => {
                        getLocalTrailer(state.userId, item.Id).then((v) => {
                          goPlayOrBrowse(v)
                        })
                      }}
                    >
                      <BiRegularFilm />
                    </button>
                  </Show>
                  <Show
                    when={mediaStatus.played}
                    fallback={
                      <button
                        onClick={handlePlayed}
                        title={t('MarkPlayed')}
                        class='p-1 rounded-md cursor-pointer hover:bg-from-to'
                      >
                        <AiOutlineCheck />
                      </button>
                    }
                  >
                    <button
                      onClick={handleUnPlayed}
                      title={t('MarkUnplayed')}
                      class='p-1 rounded-md cursor-pointer hover:bg-from-to'
                    >
                      <AiOutlineCheck class='text-indicator' />
                    </button>
                  </Show>
                  <Show
                    when={mediaStatus.favorite}
                    fallback={
                      <button
                        onClick={handleFavorite}
                        title={t('AddToFavorites')}
                        class='p-1 rounded-md cursor-pointer hover:bg-from-to'
                      >
                        <AiFillHeart />
                      </button>
                    }
                  >
                    <button
                      onClick={handleUnFavorite}
                      title={t('Favorites')}
                      class='p-1 rounded-md cursor-pointer hover:bg-from-to'
                    >
                      <AiFillHeart class='text-error' />
                    </button>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Carousel class='h-[23%] w-full flex flex-row gap-4 overflow-hidden px-2 py-2 disable-select [@media(max-height:40rem)]:hidden'>
          <For each={getPeopleByType(item.People, 'Actor')}>
            {(v) => (
              <div class='relative h-full rounded-xl duration-300 ease-linear hover:ring-8 shrink-0 hover:ring-primary'>
                <PeopleImg
                  url={getPeopleImageUrl(v.Name, v.PrimaryImageTag)}
                  name={v.Name}
                  role={v.Role}
                  onContextMenu={(e) => displayMenu(e, v.Id)}
                />
                <Show when={personInfo.status === 'pending' && v.Id === personInfo.id}>
                  <div class='flex absolute top-0 left-0 justify-center items-center w-full h-full rounded-xl bg-black/50'>
                    <Loading class='w-1/5 h-1/5 animate-spin' />
                  </div>
                </Show>
              </div>
            )}
          </For>
        </Carousel>
      </div>
      <Show when={carouselOption.scroll}>
        <div class='absolute bottom-[2%] right-0 -mb-2 flex h-[20%] w-[4%] items-center justify-center'>
          <Show
            when={carouselOption.next}
            fallback={
              <button onClick={() => scrollT(1)} title='' class='prev-next'>
                <FaSolidAngleRight class='text-screen-main' />
              </button>
            }
          >
            <button onClick={() => scrollT(0)} title='' class='prev-next'>
              <FaSolidAngleLeft class='text-screen-main' />
            </button>
          </Show>
        </div>
      </Show>
      <Show when={personInfo.status === 'ready' && personInfo.detail!.ExternalUrls.length > 0}>
        <Menu menuId={MENU_ID}>
          <For each={personInfo.detail?.ExternalUrls}>
            {(item, i) => (
              <Item
                class={
                  i() !== personInfo.detail!.ExternalUrls.length - 1
                    ? 'border-b border-component-separator'
                    : ''
                }
                onClick={() => window.open(item.Url, '_blank')}
              >
                {urlIcon[item.Name]}
                <p>{item.Name}</p>
              </Item>
            )}
          </For>
        </Menu>
      </Show>
    </div>
  )
}

type PeopleImagProps = {
  url?: string
  name?: string
  role?: string
  onClick?: () => void
  onContextMenu?: (e: MouseEvent) => void
}

const PeopleImg = (props: PeopleImagProps) => {
  return (
    <>
      <Show
        when={props.url}
        fallback={
          <div
            class='flex justify-center items-center h-full text-7xl rounded-xl aspect-people bg-component'
            onContextMenu={(e) => {
              if (props.onContextMenu) props.onContextMenu(e)
            }}
          >
            <FaSolidUser />
          </div>
        }
      >
        <img
          onContextMenu={(e) => {
            if (props.onContextMenu) props.onContextMenu(e)
          }}
          onClick={() => {
            if (props.onClick) props.onClick()
          }}
          src={props.url}
          alt=''
          class='object-cover h-full rounded-xl brightness-[.8] aspect-people'
        />
      </Show>
      <div class='flex absolute [@media(max-height:56rem)]:hidden bottom-0 left-0 flex-col justify-center px-2 w-full h-14 text-center pointer-events-none'>
        <p class='font-semibold truncate'>{props.name}</p>
        <p class='font-medium truncate text-secondary'>{props.role}</p>
      </div>
    </>
  )
}

type OtherDetailProps = {
  item: MediaInfoDetail
  t: NT
}

type OtherDetailType = {
  key: string
  val: string
  icon: JSX.Element
}

const OtherDetail = ({ item, t }: OtherDetailProps) => {
  const director = getPeopleNamesByType(item.People, 'Director')
  const writer = getPeopleNamesByType(item.People, 'Writer')
  const genres = item.Genres.join('/')
  const tagLines = item.Taglines.join('/')
  const studio = getStudio(item.Studios)
  const country = item.ProductionLocations === undefined ? '' : item.ProductionLocations.join('/')
  const data = [
    { key: 'Director', icon: <BiRegularCameraMovie />, val: director },
    { key: 'Writers', icon: <RiDesignBallPenLine />, val: writer },
    { key: 'Genre', icon: <VsGroupByRefType />, val: genres },
    { key: 'LabelTagline', icon: <VsGroupByRefType />, val: tagLines },
    { key: 'Studios', icon: <BiRegularMoviePlay />, val: studio },
    { key: 'LabelCountry', icon: <BiRegularWorld />, val: country },
  ].reduce<OtherDetailType[]>((pre, cur) => {
    if (cur.val !== '') pre.push(cur)
    return pre
  }, [])

  const Entry = ({ icon, key, val }: { icon: JSX.Element; key: string; val: string }) => (
    <div class='flex flex-row gap-4 items-center'>
      <div class='flex justify-center items-center w-10 h-10 text-2xl text-center rounded-full bg-secondary text-component'>
        {icon}
      </div>
      <div class='flex overflow-hidden flex-col w-calc-3'>
        <p class='truncate text-secondary/50'>{key}</p>
        <p class='text-lg font-semibold truncate'>{val}</p>
      </div>
    </div>
  )

  const d: OtherDetailType[][] = []

  if (data.length > 4) {
    const c = data.splice(4, data.length - 4)
    d.push(data)
    d.push(c)
  } else {
    d.push(data)
  }
  return (
    <For each={d}>
      {(v, i) => (
        <div
          class={`grid grid-cols-2 gap-2 w-full ${i() > 0 ? '[@media(max-height:46rem)]:hidden' : ''}`}
        >
          <For each={v}>{(n) => <Entry icon={n.icon} key={t(n.key)} val={n.val} />}</For>
        </div>
      )}
    </For>
  )
}

export default Detail
