import { FaSolidPlus } from 'solid-icons/fa'
import { For, Show, batch, createResource } from 'solid-js'
import { createStore } from 'solid-js/store'
import { getDeepPaths, getDriver } from '../../helper/api'

type PathSelectorProps = {
  id?: string
  w?: string
  onSelect: (path: string, id?: string) => void
}

const PathSelector = ({ id, w, onSelect }: PathSelectorProps) => {
  const [state, setState] = createStore({
    show: false,
    path: '',
    name: '',
    pathOpreate: [''],
  })

  const fetcher = async (path: string) => {
    let paths: EnvironmentDrivers[] = []
    if (path === '') {
      paths = await getDriver()
    } else {
      paths.push({
        Name: '···',
        Path: state.pathOpreate[state.pathOpreate.length - 2],
        Type: 'Directory',
      })
      paths = [...paths, ...(await getDeepPaths(path))]
    }
    return paths
  }

  const [paths] = createResource(() => state.path, fetcher)

  const choosePath = (val: EnvironmentDrivers) => {
    batch(() => {
      const op = [...state.pathOpreate]
      if (val.Name === '···') {
        op.pop()
      } else {
        op.push(val.Path)
      }
      setState('name', () => val.Name)
      setState('path', () => val.Path)
      setState('pathOpreate', () => op)
    })
  }

  return (
    <div class={`relative mt-1 ${w || 'w-full'}`}>
      <div>
        <button
          type='button'
          class='py-3 pr-10 pl-6 w-full h-12 base-component cursor-pointer'
          onClick={() => setState('show', () => !state.show)}
        >
          <span class='flex items-center'>
            <span class='block truncate'>{state.path}</span>
          </span>
          <span
            class='flex absolute inset-y-1 right-2 justify-center items-center w-10 h-10 rounded-md hover:text-success hover-component'
            onClick={(e) => {
              e.stopPropagation()
              setState('show', () => false)
              if (state.path === '') return
              onSelect(state.path, id)
            }}
          >
            <FaSolidPlus />
          </span>
        </button>
      </div>
      <Show when={state.show && paths.state === 'ready'}>
        <div class='absolute z-50 mt-1 w-full rounded-md bg-component shadow-lg'>
          <ul class='overflow-y-auto py-1 max-h-64 min-h-12 scrollbar-0'>
            <For each={paths()}>
              {(v) => (
                <li
                  class='relative py-2 pr-9 pl-3 cursor-pointer select-none hover:bg-component-hover'
                  onClick={() => choosePath(v)}
                >
                  <div class='flex items-center ml-3 font-normal truncate'>{v.Name}</div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  )
}

export default PathSelector
