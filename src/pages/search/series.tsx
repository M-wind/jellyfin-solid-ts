import { FaSolidAngleLeft, FaSolidAngleRight } from 'solid-icons/fa'
import { For, Show, createEffect, on } from 'solid-js'
import CarouselWrapper from '../../components/carousel'
import { getImageUrl } from '../../helper/utils'

type SeriesProps = {
  items: SearchItems[]
  t: NT
  onClick: (id: string) => void
  update: (type: string, cur: number) => void
  cur: number
}

const Series = (props: SeriesProps) => {
  const { Carousel, scrollT, carouselOption, scrollToPosition } = CarouselWrapper({
    padding: 16,
  })

  createEffect(
    on(
      () => carouselOption.scroll,
      () => {
        if (carouselOption.scroll && props.cur !== 0) scrollToPosition(props.cur, 'instant')
      },
      { defer: true },
    ),
  )

  const scroll = (d: number) => {
    scrollT(d)
    props.update('Series', carouselOption.cur)
  }

  return (
    <div class='flex relative flex-col w-full'>
      <div class='flex flex-row gap-4 w-full'>
        <div class='w-[5%]' />
        <div class='text-2xl font-semibold leading-normal'>{props.t('Series')}</div>
        <div class='text-2xl font-semibold leading-normal text-primary'>{props.items.length}</div>
      </div>
      <div class='flex flex-row w-full h-[21rem]'>
        <Carousel
          length={props.items.length}
          class='flex absolute left-[5%] overflow-x-auto flex-row gap-8 py-2 px-2 w-9/10 scrollbar-none disable-select'
        >
          <For each={props.items}>
            {(v) => (
              <div class='flex relative flex-col gap-2 h-full shrink-0'>
                <img
                  class='h-72 rounded-xl duration-300 ease-linear cursor-pointer hover:ring-8 aspect-primary hover:ring-primary'
                  onClick={() => props.onClick(v.Id)}
                  src={getImageUrl(v.Id, { Primary: v.PrimaryImageTag }, 'Primary')}
                />
                <div class='flex flex-row justify-center w-full'>
                  <p class='px-6 text-sm font-semibold text-secondary truncate'>{v.Name}</p>
                </div>
              </div>
            )}
          </For>
        </Carousel>
        <div class='w-[5%] absolute right-0 h-72 flex flex-col gap-9 items-center justify-center'>
          <Show when={carouselOption.scroll}>
            <button onClick={() => scroll(0)} title='' disabled={carouselOption.prev} class='prev-next'>
              <FaSolidAngleLeft
                class={`${carouselOption.prev ? 'text-normal/50' : ''} text-screen-main`}
              />
            </button>
            <button onClick={() => scroll(1)} title='' disabled={carouselOption.next} class='prev-next'>
              <FaSolidAngleRight
                class={`${carouselOption.next ? 'text-normal/50' : ''} text-screen-main`}
              />
            </button>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default Series
