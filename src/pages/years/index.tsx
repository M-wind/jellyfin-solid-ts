import { For, createResource } from 'solid-js'
import { useAppContext } from '../../context/AppContext'
import { getYears } from '../../helper/api'
import Avatar from '../avatar'
import Back from '../back'

const Years = () => {
  const { state, updateState } = useAppContext()

  const param = state.pages[state.pages.length - 1]
  const mediaType: MediaType = param.param?.type

  const fetcher = async () => {
    return await getYears(state.userId, mediaType)
  }

  const [years] = createResource(fetcher)

  const handleClick = (id: string) => {
    const pages = [...state.pages]
    pages.push({
      id: 'Title',
      param: { type: mediaType, option: { Years: id } },
    })
    updateState('pages', pages)
  }

  return (
    <>
      <Back />
      <Avatar />
      <div class='absolute left-[5%] top-40 w-9/10 bottom-0 animate-fadeIn overflow-y-auto scrollbar-0'>
        <div class='flex flex-row flex-wrap gap-6'>
          <For each={years()?.Items}>
            {(item) => (
              <button
                type='button'
                onClick={() => handleClick(item.Name)}
                class='flex items-center px-12 h-24 text-3xl font-semibold rounded-2xl cursor-pointer max-3xl:text-2xl max-3xl:h-20 bg-component disable-select hover:bg-from-to'
              >
                {item.Name}
              </button>
            )}
          </For>
        </div>
      </div>
    </>
  )
}

export default Years
