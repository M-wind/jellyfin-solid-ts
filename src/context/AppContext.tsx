import {
  type JSX,
  batch,
  createContext,
  createEffect,
  createResource,
  on,
  onMount,
  useContext,
} from 'solid-js'
import { type SetStoreFunction, createStore } from 'solid-js/store'
import http from '../helper/api/http'

type AppStore = {
  theme: string
  userId: string
  bgUrl: string
  uuid: string
  route: string
  lang: string
  pages: { id: Pages; param?: any }[]
}

type AppContext = {
  state: AppStore
  updateState: SetStoreFunction<AppStore>
  t: NT
  st: ST
}

const AppContext = createContext<AppContext>()

const dict: { default: { [index: string]: string } } = await import('../i18n/en-US.json')
const en = dict.default

export const AppProvider = (props: { children: JSX.Element }) => {
  const [state, updateState] = createStore<AppStore>({
    theme: 'dark',
    userId: 'd8a32082e2f2499c85804019e4b509b0',
    bgUrl: 'https://bing.ee123.net/img/rand',
    uuid: btoa(new Date().getTime().toString()),
    route: 'connect',
    lang: navigator.language,
    pages: [{ id: 'Home', param: '' }],
    // color: {
    //   '--primary': '#7c4dff',
    //   '--highlight': '#7e57c2',
    //   '--indicator': '#43a047',
    // },
  })

  // createEffect(() => {
  //   document.documentElement.style.setProperty('--theme', state.theme)
  // })

  onMount(() => {
    const authorization = sessionStorage.getItem('Authorization')
    const userId = sessionStorage.getItem('UserId')
    const baseUrl = sessionStorage.getItem('BaseUrl')
    if (!!authorization && !!userId && !!baseUrl) {
      http.setHeader('Authorization', authorization)
      http.setBaseUrl(baseUrl)
      batch(() => {
        updateState('userId', userId)
        updateState('route', 'home')
      })
    }
    const lang = localStorage.getItem('lang')
    if (lang) updateState('lang', lang)
  })

  createEffect(
    on(
      () => state.theme,
      () => {
        document.documentElement.setAttribute('class', state.theme)
      },
    ),
  )

  const fetcher = async (name: string) => {
    if (name === 'en-US') {
      return en
    }
    return await import(`../i18n/${name}.json`)
  }

  const [trans] = createResource(() => state.lang, fetcher, {
    initialValue: en,
  })

  const t = (name: string, replace?: string[]) => {
    let value = trans()[name] || en[name]
    if (replace) {
      value = replace.reduce((pre, cur, index) => {
        return pre.replace(`{${index}}`, cur)
      }, value)
    }
    return value
  }

  const st = (name: string, st?: { str?: string; last?: boolean }) => {
    const value = trans()[name] || en[name]
    if (st?.last) return value.slice(0, value.length - 1).trim()
    return value.slice(0, value.indexOf(st?.str || '(')).trim()
  }

  return (
    <AppContext.Provider value={{ state, updateState, t, st }}>{props.children}</AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) throw 'useAppContext: cannot find a AppContext'
  return context
}
