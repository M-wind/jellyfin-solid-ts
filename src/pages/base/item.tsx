import { TbHome, TbTransformFilled } from 'solid-icons/tb'
import { Items } from '../../components/menuItem'
import { FiLogOut } from 'solid-icons/fi'
import { RiDocumentFoldersFill } from 'solid-icons/ri'

export const orginalItems = (t: NT, ex?: Items[]) => {
  const o: Items[] = [
    {
      id: 'CodecProfile',
      lable: t('Transcoding'),
      icon: <TbTransformFilled class='text-2xl' />,
    },
    {
      id: 'MediaLibrary',
      lable: t('HeaderLibraries'),
      icon: <RiDocumentFoldersFill class='text-2xl' />,
    },
    {
      id: 'Home',
      lable: t('Home'),
      icon: <TbHome class='text-2xl' />,
    },
    {
      id: 'Logout',
      lable: t('ButtonSignOut'),
      icon: <FiLogOut class='text-2xl' />,
    },
  ]
  return ex ? ex.concat(o) : o
}
