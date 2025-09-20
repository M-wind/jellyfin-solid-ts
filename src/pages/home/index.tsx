import type { IconProps, IconTypes } from 'solid-icons'
import {
  FaSolidAngleLeft,
  FaSolidAngleRight,
  FaSolidBolt,
  FaSolidFolderTree,
  FaSolidUser,
} from 'solid-icons/fa'
import { TbDeviceTvOld, TbMovie, TbTextCaption } from 'solid-icons/tb'
import { For, Show, createEffect, createResource, createSignal, on, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import MenuItem from '../../components/menuItem'
import { useAppContext } from '../../context/AppContext'
import Avatar from '../avatar'

import { BsInfoCircle } from 'solid-icons/bs'
import { FiPlayCircle } from 'solid-icons/fi'
import { IoSearch } from 'solid-icons/io'
import { RiDocumentFoldersFill } from 'solid-icons/ri'
import Button from '../../components/button'
import HashImage from '../../components/hashImage'
import { getMediaSuggestions } from '../../helper/api'
import { getBackDropImageUrl, getHash } from '../../helper/utils'
import { BaseInfo } from '../base/info'

enum Direction {
  LEFT = 0,
  RIGHT = 1,
}

const initialValue: MediaItems = { Items: [], StartIndex: 0, TotalRecordCount: 0 }

const Home = () => {
  const { state, updateState, t } = useAppContext()

  const param = state.pages[0].param
  const mediaType: MediaType = param?.mediaType
  const cur: { [key in MediaType]: number } = param?.cur
  const movieData: MediaItems = param?.movies
  const seriesData: MediaItems = param?.series

  const [media, setMedia] = createStore<{
    type: MediaType
    cur: { [key in MediaType]: number }
  }>({
    // type: 'Movie',
    // cur: { Movie: 0, Series: 0, Episode: 0 },
    type: mediaType || 'Movie',
    cur: cur || { Movie: 0, Series: 0 },
  })

  const fetch = async (type: MediaType) => {
    if (type === 'Movie' && movieData) return movieData
    if (type === 'Series' && seriesData) return seriesData
    return await getMediaSuggestions(state.userId, type)
  }

  let imgs: HTMLDivElement | undefined

  const [movies, { mutate: mutateMovie }] = createResource('Movie', fetch, { initialValue })
  const [series, { mutate: mutateSeries }] = createResource('Series', fetch, { initialValue })

  type TabItemProps = {
    open: boolean
    show: boolean
    label: string
    onClick: () => void
    icon: IconTypes
  }

  createEffect(
    on(
      () => movies.state === 'ready' && series.state === 'ready',
      () => {
        const flag = movies().TotalRecordCount === 0 && series().TotalRecordCount > 0
        if (!mediaType) setMedia('type', flag ? 'Series' : 'Movie')
      },
    ),
  )

  const optionOpreate = (page: Pages) => {
    const pages = [...state.pages]
    pages.push({ id: page, param: { type: media.type } })
    updateState('pages', pages)
  }

  const TabItem = (props: TabItemProps) => {
    const [flag, setFlag] = createSignal(false)
    return (
      <Show when={props.open}>
        <Show
          when={props.show}
          fallback={
            <div class='flex items-center cursor-pointer h-17'>
              <props.icon
                class='text-2xl duration-200 ease-in hover:text-primary'
                onclick={props.onClick}
              />
            </div>
          }
        >
          <div>
            <button
              type='button'
              onBlur={() => setFlag(false)}
              onClick={() => setFlag(!flag())}
              class={`h-17 rounded-full cursor-pointer flex animate-zoomIn items-center text-nomal px-8 gap-4 ${
                flag() ? 'bg-component' : 'bg-from-to'
              } `}
            >
              <props.icon class='text-3xl' />
              <p class='text-2xl font-semibold'>{props.label}</p>
            </button>
            <MenuItem
              show={flag()}
              title={t('Items')}
              onClick={optionOpreate}
              mask
              items={[
                {
                  id: 'Title',
                  lable: t('MediaInfoTitle'),
                  icon: <TbTextCaption class='text-2xl' />,
                },
                {
                  id: 'Years',
                  lable: t('HeaderYears'),
                  icon: <FaSolidBolt class='text-2xl' />,
                },
                {
                  id: 'Actors',
                  lable: t('Actor'),
                  icon: <FaSolidUser class='text-xl' />,
                },
                {
                  id: 'Genres',
                  lable: t('Genres'),
                  icon: <FaSolidFolderTree class='text-xl' />,
                },
              ]}
            />
          </div>
        </Show>
      </Show>
    )
  }

  const scroll = (index: number, behavior: ScrollBehavior) => {
    const imgArr = imgs?.childNodes
    const a = imgArr?.[index] as HTMLElement
    // if (a === undefined) return
    imgs?.scrollTo({
      top: 0,
      left: a.offsetLeft,
      behavior: behavior,
    })
  }

  const mutate = (v: MediaItems) => {
    return media.type === 'Movie' ? mutateMovie(v) : mutateSeries(v)
  }

  const scrollT = (dire: Direction) => {
    let c = media.cur[media.type]
    c = dire !== Direction.LEFT ? c + 1 : c - 1
    const x = media.type === 'Movie' ? movies()! : series()!
    const data = [...x.Items]
    if (c < 0) {
      data.push(data.shift()!)
      mutate({ ...x, Items: data })
      scroll(x.TotalRecordCount - 1, 'instant')
      c = x.TotalRecordCount - 2
    }
    if (c > x.TotalRecordCount - 1) {
      data.unshift(data.pop()!)
      mutate({ ...x, Items: data })
      scroll(0, 'instant')
      c = 1
    }
    setMedia('cur', media.type, c)
    scroll(c, 'smooth')
  }

  const changeTab = (type: MediaType) => {
    setMedia('type', type)
    scroll(media.cur[type], 'instant')
  }

  const goDetail = async () => {
    const item =
      media.type === 'Movie'
        ? movies()?.Items[media.cur[media.type]]
        : series()?.Items[media.cur[media.type]]
    const pages = [...state.pages]
    pages.push({ id: 'Detail', param: { type: media.type, data: item } })
    updateState('pages', pages)
  }

  const goPlayOrBrowse = () => {
    const item =
      media.type === 'Movie'
        ? movies()?.Items[media.cur[media.type]]
        : series()?.Items[media.cur[media.type]]
    const pages = [...state.pages]
    pages.push({
      id: media.type === 'Movie' ? 'Video' : 'Episode',
      param: { data: item },
    })
    updateState('pages', pages)
  }

  const goSearch = () => {
    const pages = [...state.pages]
    pages.push({ id: 'Search' })
    updateState('pages', pages)
  }

  const updateParam = () => {
    updateState('pages', [0], {
      id: 'Home',
      param: {
        cur: media.cur,
        movies: movies(),
        series: series(),
        mediaType: media.type,
      },
    })
  }

  let timer = 0

  onCleanup(() => {
    updateParam()
    clearInterval(timer)
    resizeObserver.disconnect()
  })

  const resizeObserver = new ResizeObserver(() => {
    scroll(media.cur[media.type], 'instant')
  })

  onMount(() => {
    if (imgs && imgs?.childNodes.length > 0) {
      resizeObserver.observe(imgs)
    }
    timer = setInterval(() => scrollT(1), 15000)
  })

  return (
    <>
      <Avatar />
      <div class='absolute left-[5%] top-12 z-50 flex flex-row gap-8'>
        <TabItem
          open={movies().TotalRecordCount > 0}
          show={media.type === 'Movie'}
          label={t('Movies')}
          icon={(props: IconProps) => <TbMovie {...props} />}
          onClick={() => changeTab('Movie')}
        />
        <TabItem
          open={series().TotalRecordCount > 0}
          show={media.type === 'Series'}
          label={t('Series')}
          icon={(props: IconProps) => <TbDeviceTvOld {...props} />}
          onClick={() => changeTab('Series')}
        />
        <div class='flex items-center cursor-pointer h-17'>
          <IoSearch class='text-2xl duration-200 ease-in hover:text-primary' onClick={goSearch} />
        </div>
      </div>
      <div class='flex absolute top-0 left-0 z-20 justify-center items-center h-full opacity-0 duration-500 ease-linear hover:opacity-100 w-1/20'>
        <FaSolidAngleLeft
          class='cursor-pointer text-screen-title text-primary'
          onClick={() => scrollT(Direction.LEFT)}
        />
      </div>
      <div class='flex absolute top-0 right-0 z-20 justify-center items-center h-full opacity-0 duration-500 ease-linear hover:opacity-100 w-1/20'>
        <FaSolidAngleRight
          class='cursor-pointer text-screen-title text-primary'
          onClick={() => scrollT(Direction.RIGHT)}
        />
      </div>
      <div class='absolute left-[5%] top-[38%] h-[62%] w-9/10 flex flex-col gap-6 z-10 [@media(max-height:20rem)]:hidden'>
        <BaseInfo
          val={
            media.type === 'Movie'
              ? movies().Items[media.cur[media.type]]
              : series().Items[media.cur[media.type]]
          }
        />
        <div class='flex gap-8 flew-row'>
          <Button
            onClick={goPlayOrBrowse}
            lable={media.type === 'Movie' ? t('Play') : t('Browse')}
            icon={media.type === 'Movie' ? <FiPlayCircle /> : <RiDocumentFoldersFill />}
            class='px-8 h-16 text-2xl font-semibold rounded-full bg-white/10 hover:bg-from-to'
          />
          <Button
            onClick={goDetail}
            icon={<BsInfoCircle />}
            lable={t('MoreMediaInfo')}
            class='px-8 h-16 text-2xl font-semibold rounded-full bg-white/10 hover:bg-from-to'
          />
        </div>
      </div>
      <div class={`h-full w-full flex flex-row overflow-hidden will-change-scroll`} ref={imgs}>
        <For each={media.type === 'Movie' ? movies().Items : series().Items}>
          {(item) => (
            <HashImage
              hash={getHash('Backdrop', item.ImageBlurHashes)}
              url={getBackDropImageUrl(item.Id, item.BackdropImageTags)}
              class='w-full h-full brightness-80'
            />
          )}
        </For>
      </div>
    </>
  )
}

export default Home
