import { pinyin } from 'pinyin-pro'
// import { TbCircleLetterS, TbCircleLetterE } from 'solid-icons/tb'
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
import CarouselWrapper from '../../components/carousel'
import { Checked, CicleProgress } from '../../components/svg'
import { useAppContext } from '../../context/AppContext'
import { getMediaItemsByType, markPlayed, markUnplayed } from '../../helper/api'
import { letters } from '../../helper/option'
import { getBackDropImageUrl, getHash, getImageUrl } from '../../helper/utils'
import Avatar from '../avatar'
import Back from '../back'
import { BaseInfo, BaseInfoEpisode } from '../base/info'
import { createStore } from 'solid-js/store'
// import tempMockData from '../../Mock'
import HashImage from '../../components/hashImage'
import { orginalItems } from '../base/item'
import { Toggle } from '../../components/toggle'
import { Items } from '../../components/menuItem'

interface MediaInfoDetailLetter extends MediaInfoDetail {
  Letter: string
}

type Letters = {
  [index: string]: string
}

type MediaItemsLetter = {
  Items: MediaInfoDetailLetter[]
  StartIndex: number
  TotalRecordCount: number
}

const initialValue: MediaItemsLetter = {
  Items: [],
  StartIndex: 0,
  TotalRecordCount: 0,
}

const Title = () => {
  const { state, updateState, t } = useAppContext()
  const param = state.pages[state.pages.length - 1].param
  const mediaType: MediaType = param?.type
  const option: MediaItemOption = param?.option

  const fetch = async () => {
    const data = await getMediaItemsByType(state.userId, mediaType, option)
    // const data = await tempMockData()
    const d = {
      Items: sortByLetter(data.Items),
      StartIndex: 0,
      TotalRecordCount: data.Items.length,
    }
    return d
  }

  const [filterOption, setFilterOption] = createStore<FilterOPtion>(
    param?.filterOption ?? {
      unPlayed: false,
    },
  )

  const { Carousel, scrollT, scrollToPosition, carouselOption, needScroll, setOption } = CarouselWrapper(
    {
      padding: 16,
    },
  )

  createEffect(
    on(
      () => carouselOption.scroll,
      () => {
        if (carouselOption.scroll && cur() !== 0) scrollToPosition(cur(), 'instant')
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => title.state === 'ready',
      () => {
        if (title().TotalRecordCount > 0) {
          setData(title())
          if (param?.filterOption) {
            mutate(filterByOpt(data.Items))
          }
        }
      },
    ),
  )

  const sortByLetter = (data: MediaInfoDetail[]) => {
    let XJ = { ...inLetters() }
    const DL: MediaInfoDetailLetter[] = []
    for (let i = 0; i < data.length; i++) {
      let first = pinyin(data[i].Name.substring(0, 1), {
        pattern: 'first',
        toneType: 'none',
      }).toUpperCase()
      if (!letters.includes(first)) first = '#'
      XJ = { ...XJ, [first]: first }
      DL.push({ ...data[i], Letter: first })
    }
    DL.sort((a, b) => a.Letter.charCodeAt(0) - b.Letter.charCodeAt(0))
    setInLetters(XJ)
    return DL
  }

  const [title, { mutate }] = createResource(fetch, { initialValue })

  const [data, setData] = createStore(initialValue)

  const [cur, setCur] = createSignal(param?.cur || 0)

  const [inLetters, setInLetters] = createSignal<Letters>({})

  const isMatch = createSelector<Letters, string>(inLetters, (str, data) =>
    Object.keys(data).includes(str),
  )

  const scrollToLetter = (letter: string) => {
    const index = title().Items.findIndex((v) => v.Letter === letter)
    scrollToPosition(index)
  }

  const played = createMemo(() => {
    if (title().TotalRecordCount === 0) return false
    return title().Items[cur()].UserData.Played
  })

  const isSelected = createSelector(cur)

  const goPlayOrBrowse = () => {
    const item = title().Items[cur()]
    const pages = [...state.pages]
    // const current = pages.pop()
    // pages.push({
    //   id: 'Title',
    //   param: { ...current?.param, cur: cur() },
    // })
    pages.push({
      id: item?.MediaType === 'Video' ? 'Video' : 'Episode',
      param: { data: item },
    })
    updateState('pages', pages)
  }

  onCleanup(() => {
    updateState('pages', (k) => k.id === 'Title', 'param', {
      ...param,
      cur: cur(),
      filterOption,
    })
  })

  const filterByOpt = (items: MediaInfoDetailLetter[]) => {
    const d = filterOption.unPlayed ? items.filter((v) => !v.UserData.Played) : items
    return {
      Items: d,
      StartIndex: 0,
      TotalRecordCount: d.length,
    }
  }

  const onMark = (v: boolean) => {
    const itemId = title().Items[cur()].Id
    const res = v ? markPlayed(state.userId, itemId) : markUnplayed(state.userId, itemId)
    res.then((k) => {
      if (k.ok) {
        mutate((m) => {
          const a = m.Items.map((n) => {
            return n.Id === itemId ? { ...n, UserData: { ...n.UserData, Played: v } } : n
          })
          return {
            ...m,
            Items: a,
          }
        })
        setData('Items', (i) => i.Id === itemId, 'UserData', 'Played', v)
        // setTitle(filterByOpt(title.Items))
      }
    })
  }

  const onFilter = (v: boolean, id: keyof FilterOPtion) => {
    const d = data.Items.some((k) => k.UserData.Played)
    if (!d) return
    batch(() => {
      setCur(0)
      setFilterOption(id, v)
    })
    const a = filterByOpt(data.Items)
    const letter = a.Items.reduce<Letters>((pre, cur) => {
      pre[cur.Letter] = cur.Letter
      return pre
    }, {})
    setInLetters(letter)
    mutate(a)
    if (a.TotalRecordCount === 0) return
    setOption('cur', 0)
    needScroll()
    scrollToPosition(0)
  }

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

  return (
    <>
      <Back />
      <Avatar onMark={onMark} items={items()} mask={false} />
      {/* {backgroud(
            getImageUrl(val()?.Items[cur()].Id!, val()?.Items[cur()].ImageBlurHashes!, 'Backdrop'),
          )} */}
      <Show when={title().TotalRecordCount > 0}>
        <img
          class='object-cover w-full h-full brightness-30'
          src={getBackDropImageUrl(title().Items[cur()].Id, title().Items[cur()].BackdropImageTags)}
          alt=''
        />
        <div class='absolute top-0 left-0 w-full h-full shadow-edge' />
        <div class='absolute top-[20%] h-[37%] left-[5%] w-9/10 [@media(max-height:34rem)]:hidden'>
          <Show
            when={title().Items[cur()].Type === 'Episode'}
            fallback={<BaseInfo val={title().Items[cur()]} />}
          >
            <BaseInfoEpisode val={title().Items[cur()]} />
          </Show>
        </div>
        <Carousel class='fixed top-[57%] h-[31%] left-[5%] w-9/10 [@media(max-height:18rem)]:hidden flex overflow-x-auto flex-row gap-8 py-2 px-2 scrollbar-none disable-select will-change-scroll'>
          <For each={title().Items}>
            {(item, i) => (
              <div
                class={`relative h-full shrink-0 rounded-xl bg-component ${
                  isSelected(i()) ? 'ring-8 ring-primary' : ''
                } duration-300 ease-linear  ${item.Type === 'Episode' ? 'aspect-episode' : 'aspect-primary'} hover:ring-8 hover:ring-primary`}
                onMouseEnter={() => {
                  if (isSelected(i())) return
                  setCur(i())
                }}
              >
                {/*   <img
                      alt=''
                      src={getImageUrl(item.Id, item.ImageTags, 'Primary')}
                      loading='lazy'
                      class={`h-full cursor-pointer rounded-xl object-cover`}
                      onClick={goPlayOrBrowse}
                    /> */}
                <HashImage
                  hash={getHash('Primary', item.ImageBlurHashes)}
                  url={getImageUrl(item.Id, item.ImageTags, 'Primary')}
                  class={`h-full cursor-pointer rounded-xl object-cover ${item.Type === 'Episode' ? 'aspect-episode' : 'aspect-primary'}`}
                  onClick={goPlayOrBrowse}
                />
                <Show when={item.CommunityRating}>
                  <CicleProgress
                    val={item.CommunityRating?.toFixed(1)}
                    class={`absolute top-[2%] h-[18%] ${item.Type === 'Episode' ? 'left-[1.28%] w-[11.52%]' : 'left-[3%] w-[27%]'}`}
                  />
                </Show>
                <Show when={item.UserData.Played}>
                  <Checked
                    class={`absolute right-0 top-0 flex h-[18%] ${item.Type === 'Episode' ? 'w-[11.52%]' : 'w-[27%]'}`}
                  />
                </Show>
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
        <div class='absolute top-[57%] h-[31%] right-0 w-[5%] flex justify-center '>
          <Show when={carouselOption.scroll}>
            <button class='prev-next' onClick={() => scrollT(1)} title='' disabled={carouselOption.next}>
              <FaSolidAngleRight
                class={`${carouselOption.next ? 'text-normal/50' : ''} text-screen-main`}
              />
            </button>
          </Show>
        </div>
        <Show when={carouselOption.scroll}>
          <div class='absolute left-[5%] top-[88%] text-screen-letter flex h-[12%] w-9/10 animate-fadeIn flex-row items-center justify-between disable-select'>
            <Index each={letters}>
              {(item) => (
                <button
                  onClick={() => {
                    scrollToLetter(item())
                    setCur(carouselOption.cur)
                  }}
                  disabled={!isMatch(item())}
                  class='cursor-pointer disabled:cursor-default hover:text-primary disabled:text-normal/50'
                >
                  {item()}
                </button>
              )}
            </Index>
          </div>
        </Show>
      </Show>
    </>
  )
}

export default Title
