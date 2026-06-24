import { FaSolidAngleLeft, FaSolidAngleRight, FaSolidCheck } from 'solid-icons/fa'
import {
  For,
  Index,
  Show,
  batch,
  createEffect,
  createMemo,
  createResource,
  createSelector,
  createSignal,
  on,
  onCleanup,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import CarouselWrapper from '../../components/carousel'
import { Checked, CicleProgress } from '../../components/svg'
import { useAppContext } from '../../context/AppContext'
import { getMediaItemsByType, markPlayed, markUnplayed } from '../../helper/api'
import { getBackDropImageUrl, getHash, getImageUrl, repaire0 } from '../../helper/utils'
import Avatar from '../avatar'
import { BaseInfoEpisode } from '../base/info'
import HashImage from '../../components/hashImage'
import { Items } from '../../components/menuItem'
import { Toggle } from '../../components/toggle'
import { orginalItems } from '../base/item'
import Back from '../back'
import { createAutoAnimate } from '@formkit/auto-animate/solid'

type SeasonInfo = { [index: number]: MediaInfoDetail[] }

type Index = {
  s: number
  e: number
}[]

type Option = {
  s: number
  e: number
  t: Index
}

type EpisodeData = {
  Keys: number[]
  Items: SeasonInfo
}

const initialValue: EpisodeData = {
  Keys: [],
  Items: {},
}

const Episode = () => {
  const { state, updateState, t } = useAppContext()
  const param = state.pages[state.pages.length - 1].param
  const item: MediaInfoDetail = param?.data
  const index: Option = param?.index

  const [option, setOption] = createStore<Option>({
    s: 1,
    e: 0,
    t: [],
  })

  const fetcher = async () => {
    const data = await getMediaItemsByType(state.userId, 'Episode', {
      ParentId: item.Id,
    })
    const v = groupBySeasonNum(data.Items)
    const keys = Object.keys(v)
    const x = keys.map(Number)
    setOption(index ?? initIndex(x))
    return {
      Keys: x,
      Items: v,
    }
  }

  const initIndex = (v: number[]) => {
    const c = v.reduce<Index>((pre, cur) => {
      pre.push({ s: cur, e: 0 })
      return pre
    }, [])
    return { s: 1, e: 0, t: c }
  }

  const groupBySeasonNum = (v: MediaInfoDetail[]) => {
    return v.reduce<SeasonInfo>((pre, cur) => {
      const index = cur.ParentIndexNumber
      if (!pre[index]) pre[index] = []
      pre[index].push(cur)
      return pre
    }, {})
  }

  const [episode, { mutate }] = createResource(fetcher, { initialValue })

  const [data, setData] = createStore(initialValue)

  const goPlay = (item: MediaInfoDetail) => {
    const pages = [...state.pages]
    pages.push({ id: 'Video', param: { data: item } })
    updateState('pages', pages)
  }

  onCleanup(() => {
    updateState('pages', (k) => k.id === 'Episode', 'param', {
      ...param,
      index: option,
      filterOption,
    })
  })

  const {
    Carousel,
    scrollT,
    scrollToPosition,
    carouselOption,
    needScroll,
    setOption: setCarOption,
  } = CarouselWrapper({
    padding: 16,
  })

  createEffect(
    on(
      () => carouselOption.scroll,
      () => {
        if (carouselOption.scroll && option.e !== 0) {
          scrollToPosition(option.e, 'instant')
        }
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => episode.state === 'ready',
      () => {
        if (episode().Keys.length > 0) {
          // setEpisode(filterByOpt(reEpisode(data().Keys, data().Items), true))
          setData(episode())
          if (param?.filterOption) {
            mutate(filterByOpt(reEpisode(data.Keys, data.Items), true))
          }
        }
      },
    ),
  )

  const [filterOption, setFilterOption] = createStore<FilterOPtion>(
    param?.filterOption ?? {
      unPlayed: false,
    },
  )

  const played = createMemo(() => {
    if (episode().Keys.length === 0) return false
    return episode().Items[option.s][option.e].UserData.Played
  })

  const filterByOpt = (items: MediaInfoDetail[], need: boolean) => {
    const v = groupBySeasonNum(
      filterOption.unPlayed && need ? items.filter((v) => !v.UserData.Played) : items,
    )
    const keys = Object.keys(v)
    const x = keys.map(Number)
    return {
      Keys: x,
      Items: v,
    }
  }

  const reEpisode = (keys: number[], vals: SeasonInfo) => {
    return keys.reduce<MediaInfoDetail[]>((pre, cur) => {
      pre = pre.concat(vals[cur])
      return pre
    }, [])
  }

  const onMark = (v: boolean) => {
    const itemId = episode().Items[option.s][option.e].Id
    const res = v ? markPlayed(state.userId, itemId) : markUnplayed(state.userId, itemId)
    res.then((k) => {
      if (k.ok) {
        mutate((k) => {
          const a = reEpisode(k.Keys, k.Items).map((n) => {
            return n.Id === itemId ? { ...n, UserData: { ...n.UserData, Played: v } } : n
          })
          return filterByOpt(a, false)
        })
        setData('Items', option.s, option.e, 'UserData', 'Played', v)
      }
    })
  }

  const onFilter = (v: boolean, id: keyof FilterOPtion) => {
    setFilterOption(id, v)
    const a = filterByOpt(reEpisode(data.Keys, data.Items), true)
    const index = initIndex(a.Keys)
    batch(() => {
      setOption('s', a.Keys[0] ?? index.s)
      setOption('e', index.e)
      setOption('t', index.t)
      mutate(a)
    })
    if (a.Keys.length === 0) return
    setCarOption('cur', 0)
    needScroll()
    scrollToPosition(0)
  }

  const matchEpisode = createSelector(() => option.e)

  const getItem = createMemo(() => {
    return orginalItems(t, [
      {
        id: 'Filter',
        lable: t('Unplayed'),
        icon: (
          <Toggle
            id='unPlayed'
            checked={filterOption.unPlayed}
            onChecked={(v, i: keyof FilterOPtion) => {
              onFilter(v, i)
            }}
          />
        ),
      },
    ])
  })

  const [items, setItems] = createSignal(getItem())

  createEffect(() => {
    const a: Items = {
      id: played() ? 'MarkUnplayed' : 'MarkPlayed',
      lable: t(played() ? 'MarkUnplayed' : 'MarkPlayed'),
      icon: <FaSolidCheck class={`text-2xl ${played() ? 'text-indicator' : ''}`} />,
    }
    const itemss = [...getItem()]
    itemss.unshift(a)
    setItems(itemss)
  })

  const [parent] = createAutoAnimate()

  const baseInfoEpisode = (data: MediaInfoDetail) => <BaseInfoEpisode val={data} />

  return (
    <>
      <Back />
      <Avatar onMark={onMark} items={items()} mask={false} />
      {/* <HashImage
        hash={getHash(props.data.ImageBlurHashes, 'Backdrop')}
        url={getImageUrl(props.data.Id, props.data.ImageBlurHashes!, 'Backdrop')}
        class="w-full h-full disable-select brightness-30"
        type="backdrop"
      /> */}
      <img
        alt=''
        src={getBackDropImageUrl(item.Id, item.BackdropImageTags)}
        class='object-cover w-full h-full animate-fadeIn brightness-30 aspect-backdrop disable-select'
      />
      <div class='absolute top-0 left-0 w-full h-full shadow-edge' />
      <Show when={episode().Keys.length > 0}>
        <div ref={parent} class='absolute top-[20%] h-[37%] left-[5%] w-9/10'>
          {/* <BaseInfoEpisode val={episode().Items[option.s][option.e]} /> */}
          {baseInfoEpisode(episode().Items[option.s][option.e])}
        </div>
        <Carousel class='fixed top-[57%] h-[31%] left-[5%] w-9/10 [@media(max-height:18rem)]:hidden flex overflow-x-auto  flex-row gap-8 py-2 px-2 scrollbar-none disable-select'>
          <For each={episode().Items[option.s]}>
            {(item, i) => (
              <div
                class={`hover:bg-primary ${matchEpisode(i()) ? 'bg-primary ring-8 ring-primary' : 'text-normal/50'} relative h-full shrink-0 rounded-xl bg-component-separator duration-300 ease-linear`}
                onMouseEnter={() => {
                  if (i() === option.e) return
                  setOption('e', i())
                }}
              >
                {/*  <img
                      alt=''
                      loading='lazy'
                      src={getImageUrl(item.Id, item.ImageTags, 'Primary')}
                      class='h-[78%] cursor-pointer rounded-t-xl object-cover aspect-episode'
                      onClick={() => goPlay(item)}
                    /> */}
                <HashImage
                  hash={getHash('Primary', item.ImageBlurHashes)}
                  url={getImageUrl(item.Id, item.ImageTags, 'Primary')}
                  class='h-[78%] cursor-pointer rounded-t-xl aspect-episode'
                  onClick={() => goPlay(item)}
                />
                <Show when={item.CommunityRating}>
                  <CicleProgress
                    val={item.CommunityRating?.toFixed(1)}
                    class='absolute left-[1.64%] top-[2%] h-[18%] w-[14.77%]'
                  />
                </Show>
                <Show when={item.UserData.Played}>
                  <Checked class='absolute right-0 top-0 flex h-[18%] w-[14.77%]' />
                </Show>
                <div class='absolute truncate @container flex flex-row h-[22%] w-full items-center justify-center px-6 font-semibold aspect-episode'>
                  <p class='truncate text-2xl @max-xs:text-xl @max-2xs:text-lg @max-3xs:text-sm'>
                    {item.ParentIndexNumber +
                      'x' +
                      repaire0(item.IndexNumber!) +
                      ' · ' +
                      item.Name.trim()}
                  </p>
                </div>
              </div>
            )}
          </For>
        </Carousel>
        <div class='absolute top-[57%] h-[31%] flex justify-center left-0 w-[5%]'>
          <Show when={carouselOption.scroll}>
            <button class='prev-next' onClick={() => scrollT(0)} title='' disabled={carouselOption.prev}>
              <FaSolidAngleLeft
                class={`${carouselOption.prev ? 'text-normal/50' : ''} text-screen-main`}
              />
            </button>
          </Show>
        </div>
        <div class='absolute top-[57%] h-[31%] flex justify-center right-0 w-[5%]'>
          <Show when={carouselOption.scroll}>
            <button class='prev-next' onClick={() => scrollT(1)} title='' disabled={carouselOption.next}>
              <FaSolidAngleRight
                class={`${carouselOption.next ? 'text-normal/50' : ''} text-screen-main`}
              />
            </button>
          </Show>
        </div>
        <ScrollerSeason
          data={episode().Keys}
          season={option.s}
          onClick={(v) => {
            const oe = option.e
            const os = option.s
            batch(() => {
              setOption('s', v)
              setOption('e', option.t.find((n) => n.s === v)?.e ?? 0)
              setOption('t', (k) => k.s === os, 'e', oe)
            })
            setCarOption('cur', option.e)
            needScroll()
            scrollToPosition(option.e)
          }}
        />
      </Show>
    </>
  )
}

type ScrollerSeaonProps = {
  data?: number[]
  season: number
  onClick?: (v: number) => void
}

const ScrollerSeason = (props: ScrollerSeaonProps) => {
  const { Carousel, scrollT, carouselOption } = CarouselWrapper({
    padding: 8,
    mode: 'mutex',
  })
  const { t } = useAppContext()
  const label = t('Season') + ' '
  const matchSeason = createSelector(() => props.season)
  return (
    <>
      <Carousel class='absolute left-[5%] top-[88%] flex h-[12%] w-[65%] flex-row items-center gap-4 overflow-x-auto scrollbar-none [@media(max-height:34rem)]:hidden'>
        <Index each={props.data}>
          {(item) => (
            <button
              onclick={() => {
                if (props.onClick) props.onClick(item())
              }}
              class={`${matchSeason(item()) ? 'bg-from-to' : 'text-normal/50'} hover:text-normal hover:bg-from-to disable-default h-16 max-3xl:h-14 max-2xl:h12 w-36 shrink-0 rounded-xl bg-component-separator cursor-pointer text-2xl max-3xl:text-xl font-semibold duration-300 ease-linear`}
            >
              {label + item()}
            </button>
          )}
        </Index>
      </Carousel>
      <Show when={carouselOption.scroll}>
        <div class='absolute left-[70%] top-[88%] flex h-[12%] w-[10%] animate-fadeIn items-center justify-center'>
          <Show
            when={carouselOption.next}
            fallback={
              <button
                onClick={() => scrollT(1)}
                title=''
                class='cursor-pointer disabled:cursor-default disable-default hover:text-primary'
              >
                <FaSolidAngleRight class='text-screen-main' />
              </button>
            }
          >
            <button
              onClick={() => scrollT(0)}
              title=''
              class='cursor-pointer disabled:cursor-default disable-default hover:text-primary'
            >
              <FaSolidAngleLeft class='text-screen-main' />
            </button>
          </Show>
        </div>
      </Show>
    </>
  )
}

export default Episode
