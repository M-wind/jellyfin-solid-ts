import { For, createResource } from 'solid-js'
import { useAppContext } from '../../context/AppContext'
import { getAllItemByGenres } from '../../helper/api'
import Avatar from '../avatar'
import Back from '../back'

const Genres = () => {
  const { state, updateState } = useAppContext()

  const param = state.pages[state.pages.length - 1]
  const mediaType: MediaType = param.param?.type

  const fetcher = async () => {
    return await getAllItemByGenres(state.userId, mediaType)
  }

  const [geners] = createResource(fetcher)

  const handleClick = (id: string) => {
    const pages = [...state.pages]
    pages.push({
      id: 'Title',
      param: {
        type: mediaType,
        option: { EnableTotalRecordCount: false, GenreIds: id },
      },
    })
    updateState('pages', pages)
  }

  return (
    <>
      <Back />
      <Avatar />
      <div class='absolute left-[5%] top-40 w-9/10 bottom-0 animate-fadeIn overflow-y-auto scrollbar-0'>
        <div class='flex flex-row flex-wrap gap-6'>
          <For each={geners()?.Items}>
            {(item) => (
              <button
                onClick={() => handleClick(item.Id)}
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

export default Genres
