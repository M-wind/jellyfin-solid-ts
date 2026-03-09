import { FaSolidAngleLeft, FaSolidAngleRight, FaSolidUser } from 'solid-icons/fa'
import { For, Show, createEffect, on } from 'solid-js'
import CarouselWrapper from '../../components/carousel'
import { getPeopleImageUrl } from '../../helper/utils'

type PersonProps = {
  items: SearchItems[]
  t: NT
  onClick: (id: string) => void
  update: (type: string, cur: number) => void
  cur: number
}

const Person = (props: PersonProps) => {
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
    props.update('Person', carouselOption.cur)
  }

  return (
    <div class='flex relative flex-col w-full'>
      <div class='flex flex-row gap-4 w-full'>
        <div class='w-[5%]' />
        <div class='text-2xl font-semibold leading-normal'>{props.t('Person')}</div>
        <div class='text-2xl font-semibold leading-normal text-primary'>{props.items.length}</div>
      </div>
      <div class='flex flex-row w-full h-72'>
        <Carousel class='flex absolute left-[5%] overflow-x-auto flex-row gap-8 py-2 px-2 w-9/10 scrollbar-none disable-select'>
          <For each={props.items}>
            {(v) => (
              <div class='flex relative flex-col gap-2 h-full shrink-0'>
                <Show
                  when={v.PrimaryImageTag}
                  fallback={
                    <div
                      class='flex justify-center items-center h-60 rounded-xl duration-300 ease-linear cursor-pointer hover:ring-8 bg-component aspect-people hover:ring-primary'
                      onClick={() => props.onClick(v.Id)}
                    >
                      <FaSolidUser class='text-6xl' />
                    </div>
                  }
                >
                  <img
                    onClick={() => props.onClick(v.Id)}
                    class='object-cover h-60 rounded-xl duration-300 ease-linear cursor-pointer hover:ring-8 aspect-people hover:ring-primary'
                    src={getPeopleImageUrl(v.Name, v.PrimaryImageTag)}
                  />
                </Show>
                <div class='flex flex-row justify-center w-full'>
                  <p class='px-6 text-sm font-semibold text-secondary truncate'>{v.Name}</p>
                </div>
              </div>
            )}
          </For>
        </Carousel>
        <div class='w-[5%] absolute right-0 h-60 flex flex-col gap-9 items-center justify-center'>
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

export default Person
