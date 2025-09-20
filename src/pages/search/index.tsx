import { createAutoAnimate } from '@formkit/auto-animate/solid'
import { For, Show, batch, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import Searchs from '../../components/search'
import { useAppContext } from '../../context/AppContext'
import { getMediaItemById, getSearch } from '../../helper/api'
import { SearchTypeOptions } from '../../helper/option'
import Avatar from '../avatar'
import Back from '../back'
import Episode from './episode'
import Movie from './movie'
import Person from './person'
import Series from './series'

type SearchR = {
  show: boolean
  cur: number
  data: SearchItems[]
}

const Search = () => {
  const { state, t, updateState } = useAppContext()

  const param = state.pages[state.pages.length - 1]
  const data: { [index: string]: SearchR } = param.param?.data
  const opt: ToggleDataType[] = Object.keys(data || {}).map((v) => {
    return { Name: v, DefaultEnabled: data[v].show }
  })

  const [option, setOption] = createSignal(data ? opt : SearchTypeOptions)

  const [searchR, setSearchR] = createStore<{
    [index: string]: SearchR
  }>(
    data || {
      Movie: { show: true, cur: 0, data: [] },
      Series: { show: true, cur: 0, data: [] },
      Episode: { show: true, cur: 0, data: [] },
      Person: { show: true, cur: 0, data: [] },
    },
  )

  const onSearch = async (v: string) => {
    const types = option().reduce((pre, cur) => {
      if (cur.DefaultEnabled) pre = pre + cur.Name + ','
      return pre
    }, '')

    const data = await getSearch(state.userId, v, types)
    const r = data.SearchHints.reduce<{ [index: string]: SearchR }>(
      (pre, cur) => {
        pre[cur.Type].data.push(cur)
        return pre
      },
      {
        Movie: { show: true, data: [], cur: 0 },
        Series: { show: true, data: [], cur: 0 },
        Episode: { show: true, data: [], cur: 0 },
        Person: { show: true, data: [], cur: 0 },
      },
    )
    setSearchR(r)
  }

  const onClick = (name: string) => {
    const a = [...option()].map((v) => {
      return name !== v.Name ? v : { ...v, DefaultEnabled: !v.DefaultEnabled }
    })
    batch(() => {
      setOption(a)
      setSearchR(name, 'show', !searchR[name]['show'])
    })
  }

  const goPlay = (id: string) => {
    updateParam()
    getMediaItemById(id).then((v) => {
      const pages = updateParam()
      pages.push({ id: 'Video', param: { data: v } })
      updateState('pages', pages)
    })
  }

  const goBrowseE = (id: string) => {
    getMediaItemById(id).then((v) => {
      const pages = updateParam()
      pages.push({ id: 'Episode', param: { data: v } })
      updateState('pages', pages)
    })
  }

  const goBrowseT = (id: string) => {
    const pages = updateParam()
    pages.push({
      id: 'Title',
      param: {
        option: { PersonIds: id, IncludeItemTypes: 'Movie,Series,Episode' },
      },
    })
    updateState('pages', pages)
  }

  const updateParam = () => {
    const pages = [...state.pages]
    const current = pages.pop()
    pages.push({
      id: 'Search',
      param: { ...current?.param, data: searchR },
    })
    return pages
  }

  const [parent] = createAutoAnimate()

  const updateCur = (type: string, cur: number) => {
    setSearchR(type, 'cur', cur)
  }

  return (
    <>
      <Back />
      <Avatar />
      <div class='flex flex-col absolute left-[5%] top-12 w-9/10 gap-4 items-center h-24 max-md:top-32'>
        <Searchs w='w-full min-xl:w-[50%] min-lg:w-[55%] min-md:w-[60%]' onClick={onSearch} />
        <div class='flex flex-row gap-6'>
          <For each={option()}>
            {(v) => (
              <div
                class={`flex flex-row gap-1 items-center px-4 rounded-lg cursor-pointer ${v.DefaultEnabled ? 'bg-from-to' : 'bg-component'}`}
                onClick={() => onClick(v.Name)}
              >
                <p class='leading-normal text-md'>{t(v.Name)}</p>
              </div>
            )}
          </For>
        </div>
      </div>
      <div
        ref={parent}
        class='flex overflow-y-auto absolute bottom-4 top-40 flex-col gap-4 w-full scrollbar-0 max-md:top-60'
      >
        <Show when={searchR['Movie'].show && searchR['Movie'].data.length !== 0}>
          <Movie
            items={searchR['Movie'].data}
            t={t}
            onClick={goPlay}
            cur={searchR['Movie'].cur}
            update={updateCur}
          />
        </Show>
        <Show when={searchR['Series'].show && searchR['Series'].data.length !== 0}>
          <Series
            items={searchR['Series'].data}
            t={t}
            onClick={goBrowseE}
            cur={searchR['Series'].cur}
            update={updateCur}
          />
        </Show>
        <Show when={searchR['Episode'].show && searchR['Episode'].data.length !== 0}>
          <Episode
            items={searchR['Episode'].data}
            t={t}
            onClick={goPlay}
            cur={searchR['Episode'].cur}
            update={updateCur}
          />
        </Show>
        <Show when={searchR['Person'].show && searchR['Person'].data.length !== 0}>
          <Person
            items={searchR['Person'].data}
            t={t}
            onClick={goBrowseT}
            cur={searchR['Person'].cur}
            update={updateCur}
          />
        </Show>
      </div>
    </>
  )
}

export default Search
