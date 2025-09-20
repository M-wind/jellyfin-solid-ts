import { createSignal } from 'solid-js'
import Button from '../../components/button'
import { useAppContext } from '../../context/AppContext'
import useAlert from '../../components/alert'
import { renameMediaLibrary } from '../../helper/api'

type RenameProps = {
  name: string | undefined
  onConfirm: () => void
  onBack: () => void
}

const Rename = (props: RenameProps) => {
  const { t } = useAppContext()

  const [newName, setNewName] = createSignal('')

  const onChange = (v: string) => {
    setNewName(v)
  }

  const onConfirm = () => {
    if (newName() === props.name) {
      useAlert('不能与旧名字一样')
      return
    }
    if (newName() === '') {
      useAlert('名字不能为空')
      return
    }
    renameMediaLibrary(props.name!, newName()).then((v) => {
      if (v.ok) props.onConfirm()
    })
  }

  return (
    <>
      <div class='absolute top-6 right-6 left-6 bottom-20'>
        <div class='grid grid-cols-2 auto-rows-auto gap-6 animate-fadeIn max-md:grid-cols-1'>
          <div class='flex flex-col w-full min-w-72'>
            <div class='text-minor'>{t('LabelNewName')}</div>
            <input
              class='py-3 pr-10 pl-6 mt-1 focus:border base-component focus:border-primary'
              autofocus
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div class='flex mt-7 w-full text-minor'>{t('MessageRenameMediaFolder')}</div>
        </div>
      </div>
      <div class='absolute bottom-6 left-6'>
        <Button
          onClick={props.onBack}
          lable={t('ButtonBack')}
          class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
      <div class='absolute right-6 bottom-6'>
        <Button
          onClick={onConfirm}
          lable={t('ButtonOk')}
          class='z-30 w-20 h-10 text-lg font-bold hover:bg-from-to'
        />
      </div>
    </>
  )
}

export default Rename
