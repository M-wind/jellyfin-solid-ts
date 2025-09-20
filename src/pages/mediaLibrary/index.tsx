import { For, Match, Show, Switch, batch, createResource } from 'solid-js'
import { deleteMediaLibrary, getMediaLibrary } from '../../helper/api'
import { getMediaLibraryImage } from '../../helper/utils'
import { BiSolidFolderPlus, BiSolidPencil } from 'solid-icons/bi'
import { BsPencilSquare } from 'solid-icons/bs'
import { RiSystemDeleteBinLine, RiSystemRefreshLine } from 'solid-icons/ri'
import { createStore } from 'solid-js/store'
import { useAppContext } from '../../context/AppContext'
import Avatar from '../avatar'
import Back from '../back'
import OpreateMediaLibray from './opreate'
import Refresh from './refresh'
import Rename from './rename'

type MediaLibraryProps = {
  onBack?: () => void
}

const MediaLibrary = (props: MediaLibraryProps) => {
  const { state, t } = useAppContext()

  const [virtualFolders, { refetch }] = createResource(async () => {
    return await getMediaLibrary()
  })

  const onDelete = (name: string) => {
    deleteMediaLibrary(name).then((v) => {
      if (v.ok) refetch()
    })
  }

  const [oldData, setOldData] = createStore<{
    id: string | undefined
    name: string | undefined
    type: CollectionType
    libraryOptions: LibraryOptions | undefined
  }>({
    id: undefined,
    name: undefined,
    type: '',
    libraryOptions: undefined,
  })

  const onUpdate = (v: VirtualFolder) => {
    batch(() => {
      setOldData('id', v.ItemId)
      setOldData('name', v.Name)
      setOldData('type', v.CollectionType)
      setOldData('libraryOptions', v.LibraryOptions)
    })
    setOpen('update', true)
  }

  const [open, setOpen] = createStore({
    update: false,
    refresh: false,
    rename: false,
  })

  const onAdd = () => {
    setOldData('id', undefined)
    setOldData('name', undefined)
    setOldData('type', '')
    setOldData('libraryOptions', undefined)
    setOpen('update', true)
  }

  const onRefresh = (v: VirtualFolder) => {
    setOldData('id', v.ItemId)
    setOpen('refresh', true)
  }

  const onRename = (v: VirtualFolder) => {
    setOldData('name', v.Name)
    setOpen('rename', true)
  }

  return (
    <Show when={virtualFolders.state === 'ready'}>
      <Show
        when={!open.update && !open.refresh && !open.rename}
        fallback={
          <Switch>
            <Match when={open.update}>
              <OpreateMediaLibray
                options={oldData}
                onBack={() => setOpen('update', false)}
                onConfirm={() => {
                  setOpen('update', false)
                  refetch()
                }}
              />
            </Match>
            <Match when={open.refresh}>
              <Refresh id={oldData.id} onBack={() => setOpen('refresh', false)} />
            </Match>
            <Match when={open.rename}>
              <Rename
                name={oldData.name}
                onBack={() => setOpen('rename', false)}
                onConfirm={() => {
                  setOpen('rename', false)
                  refetch()
                }}
              />
            </Match>
          </Switch>
        }
      >
        <Back onBack={props.onBack} />
        <Show when={state.route !== 'wizard'}>
          <Avatar />
        </Show>
        <div class='absolute left-[5%] top-40 grid animate-fadeIn xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 auto-rows-min gap-4 bottom-12 w-9/10 overflow-y-auto'>
          <For each={virtualFolders()}>
            {(v) => (
              <div class='flex relative justify-center items-center w-full aspect-backdrop min-w-52'>
                <Show
                  when={!!v.PrimaryImageItemId}
                  fallback={
                    <>
                      <div class='absolute w-full h-full rounded-xl -z-10 bg-highlight brightness-75' />
                      <span class='font-extrabold text-white text-media'>{v.Name}</span>
                    </>
                  }
                >
                  <img
                    loading='lazy'
                    class='w-full rounded-xl aspect-backdrop min-w-52'
                    src={getMediaLibraryImage(v.PrimaryImageItemId)}
                  />
                </Show>
                <div class='flex absolute bottom-0 flex-row gap-4 justify-end items-center pr-2 w-full h-12'>
                  <BiSolidPencil
                    class='text-2xl cursor-pointer hover:text-primary'
                    onClick={() => onRename(v)}
                    title={t('ButtonRename')}
                  />
                  <RiSystemRefreshLine
                    class='text-2xl cursor-pointer hover:text-primary'
                    onClick={() => onRefresh(v)}
                    title={t('ScanLibrary')}
                  />
                  <BsPencilSquare
                    class='text-2xl cursor-pointer hover:text-primary'
                    onClick={() => onUpdate(v)}
                    title={t('ManageLibrary')}
                  />
                  <RiSystemDeleteBinLine
                    class='text-2xl cursor-pointer hover:text-error'
                    onClick={() => onDelete(v.Name)}
                    title={t('ButtonRemove')}
                  />
                </div>
              </div>
            )}
          </For>
          <div class='flex relative justify-center items-center w-full aspect-backdrop min-w-52'>
            <div class='absolute w-full h-full rounded-xl bg-highlight brightness-75 -z-10' />
            <BiSolidFolderPlus class='text-7xl cursor-pointer hover:text-primary' onClick={onAdd} />
          </div>
        </div>
      </Show>
    </Show>
  )
}

export default MediaLibrary
