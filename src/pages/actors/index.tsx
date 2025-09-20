import { pinyin } from 'pinyin-pro'
import { FaSolidAngleLeft, FaSolidAngleRight, FaSolidUser } from 'solid-icons/fa'
import {
  For,
  Index,
  Show,
  batch,
  createEffect,
  createResource,
  createSelector,
  createSignal,
  on,
  onCleanup,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import CarouselWrapper from '../../components/carousel'
import { Loading } from '../../components/svg'
import { useAppContext } from '../../context/AppContext'
import { getPersonById, getAllPersons } from '../../helper/api'
import { letters } from '../../helper/option'
import { getPeopleImageUrl } from '../../helper/utils'
import Avatar from '../avatar'
import Back from '../back'
import { BaseInfoActor } from '../base/info'

interface MediaInfoDetailLetter extends MediaInfoDetail {
  Letter: string
}

type Letters = {
  [index: string]: string
}

const Actors = () => {
  const { state, updateState } = useAppContext()

  const param = state.pages[state.pages.length - 1].param
  const mediaType: MediaType = param?.type

  const fetcher = async () => {
    const data = await getAllPersons(state.userId)
    const d = {
      Items: sortByLetter(data.Items),
      StartIndex: 0,
      TotalRecordCount: data.Items.length,
    }
    return d
  }

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

  const [actors, { mutate }] = createResource(fetcher, {
    initialValue: {
      Items: [],
      StartIndex: 0,
      TotalRecordCount: 0,
    },
  })

  const [inLetters, setInLetters] = createSignal<Letters>({})

  const isMatch = createSelector<Letters, string>(inLetters, (str, data) =>
    Object.keys(data).includes(str),
  )

  const scrollToLetter = (letter: string) => {
    const index = actors().Items.findIndex((v) => v.Letter === letter)
    scrollToPosition(index)
  }

  const [cur, setCur] = createSignal(param?.cur || 0)

  const { Carousel, scrollT, scrollToPosition, carouselOption } = CarouselWrapper({
    padding: 16,
  })

  createEffect(
    on(
      () => carouselOption.scroll,
      () => {
        if (carouselOption.scroll && cur() !== 0) scrollToPosition(cur(), 'instant')
      },
      { defer: true },
    ),
  )

  const handleClick = (v: number) => {
    const pages = [...state.pages]
    pages.push({
      id: 'Title',
      param: {
        type: mediaType,
        option: {
          PersonIds: actors().Items[v].Id,
          IncludeItemTypes: 'Movie,Series',
        },
      },
    })
    updateState('pages', pages)
  }

  onCleanup(() => {
    updateState('pages', (k) => k.id === 'Actors', 'param', {
      ...param,
      cur: cur(),
    })
  })

  const isSelected = createSelector(cur)

  const [personInfo, setPersonInfo] = createStore<{
    id: string
    status: 'pending' | 'ready' | 'unloaded'
  }>({
    status: 'unloaded',
    id: '',
  })

  const getPersonDetail = async (id: string, urls: { Name: string; Url: string }[]) => {
    if (urls.length !== 0 || personInfo.status === 'pending') return
    batch(() => {
      setPersonInfo('id', id)
      setPersonInfo('status', 'pending')
    })
    getPersonById(state.userId, id, 'Actor')
      .then((v) => {
        const newItems = [...actors().Items].map((k) => {
          return v.Id === k.Id ? { ...v, Letter: k.Letter } : k
        })
        mutate((k) => {
          return { ...k, Items: newItems }
        })
      })
      .finally(() => {
        setPersonInfo('status', 'ready')
      })
  }

  return (
    <>
      <Back />
      <Avatar />
      <div class='absolute top-[20%] h-[37%] left-[5%] w-9/10'>
        <BaseInfoActor val={actors().Items[cur()]} />
      </div>
      <Carousel class='fixed top-[57%] h-[31%] animate-fadeIn left-[5%] w-9/10 [@media(max-height:18rem)]:hidden flex overflow-x-auto  flex-row gap-8 py-2 px-2 scrollbar-none disable-select'>
        <For each={actors().Items}>
          {(v, i) => (
            <div
              class={`h-full relative shrink-0 cursor-pointer rounded-xl ${
                isSelected(i()) ? 'ring-8 ring-primary' : ''
              } duration-300 ease-linear hover:ring-8 hover:ring-primary`}
              onMouseEnter={() => {
                if (isSelected(i())) return
                setCur(i())
              }}
              onClick={() => handleClick(i())}
            >
              <Show
                when={v.ImageTags.Primary}
                fallback={
                  <div
                    onContextMenu={() => getPersonDetail(v.Id, v.ExternalUrls)}
                    class='flex justify-center items-center h-full @container rounded-xl bg-component aspect-people'
                  >
                    <FaSolidUser class='text-8xl @max-[14rem]:text-7xl @max-[12rem]:text-6xl @max-[10rem]:text-5xl @max-[8rem]:text-4xl' />
                  </div>
                }
              >
                <img
                  alt=''
                  loading='lazy'
                  class='object-cover h-full rounded-xl brightness-[.8] aspect-people'
                  src={getPeopleImageUrl(v.Name, v.ImageTags.Primary)}
                  onContextMenu={() => getPersonDetail(v.Id, v.ExternalUrls)}
                />
              </Show>
              <Show when={personInfo.status === 'pending' && personInfo.id === v.Id}>
                <div class='flex absolute top-0 left-0 justify-center items-center w-full h-full rounded-xl bg-black/50'>
                  <Loading class='w-1/5 h-1/5 animate-spin' />
                </div>
              </Show>
            </div>
          )}
        </For>
      </Carousel>
      <div class='absolute top-[57%] h-[31%] flex justify-center left-0 w-[5%]'>
        <Show when={carouselOption.scroll}>
          <button
            type='button'
            class='prev-next'
            onClick={() => scrollT(0)}
            disabled={carouselOption.prev}
          >
            <FaSolidAngleLeft class={`${carouselOption.prev ? 'text-nomal/50' : ''} text-screen-main`} />
          </button>
        </Show>
      </div>
      <div class='absolute top-[57%] h-[31%] flex justify-center right-0 w-[5%]'>
        <Show when={carouselOption.scroll}>
          <button
            type='button'
            class='prev-next'
            onClick={() => scrollT(1)}
            disabled={carouselOption.next}
          >
            <FaSolidAngleRight
              class={`${carouselOption.next ? 'text-nomal/50' : ''} text-screen-main`}
            />
          </button>
        </Show>
      </div>
      <Show when={carouselOption.scroll}>
        <div class='absolute left-[5%] top-[88%] text-screen-letter flex h-[12%] w-9/10 animate-fadeIn flex-row items-center justify-between disable-select'>
          <Index each={letters}>
            {(item) => (
              <button
                type='button'
                onClick={() => {
                  scrollToLetter(item())
                  setCur(carouselOption.cur)
                }}
                disabled={!isMatch(item())}
                class='cursor-pointer disabled:cursor-default hover:text-primary disabled:text-nomal/50'
              >
                {item()}
              </button>
            )}
          </Index>
        </div>
      </Show>
    </>
  )
}

export default Actors
