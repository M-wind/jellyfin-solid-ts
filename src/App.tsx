import { Match, Suspense, Switch, createMemo, lazy } from 'solid-js'
import ScreenLoading from './components/screenLoading'
import { useAppContext } from './context/AppContext'

const Connect = lazy(() => import('./pages/connect'))
const Wizard = lazy(() => import('./pages/wizard'))
const Login = lazy(() => import('./pages/login'))
const Home = lazy(() => import('./pages/home'))
const Detail = lazy(() => import('./pages/detail'))
const Title = lazy(() => import('./pages/title'))
const Episode = lazy(() => import('./pages/episode'))
const Video = lazy(() => import('./pages/video'))
const Years = lazy(() => import('./pages/years'))
const Genres = lazy(() => import('./pages/genres'))
const Actors = lazy(() => import('./pages/actors'))
const MediaLibrary = lazy(() => import('./pages/mediaLibrary'))
const CodecProfile = lazy(() => import('./pages/codecProfile'))
const Search = lazy(() => import('./pages/search'))

const App = () => {
  const { state } = useAppContext()
  const page = createMemo(() => state.pages[state.pages.length - 1].id)
  return (
    <Suspense fallback={<ScreenLoading />}>
      <Switch>
        <Match when={state.route === 'connect'}>
          <Connect />
        </Match>
        <Match when={state.route === 'wizard'}>
          <Wizard />
        </Match>
        <Match when={state.route === 'login'}>
          <Login />
        </Match>
        <Match when={state.route === 'home'}>
          <Switch fallback={<Home />}>
            <Match when={page() === 'Detail'}>
              <Detail />
            </Match>
            <Match when={page() === 'Title'}>
              <Title />
            </Match>
            <Match when={page() === 'Episode'}>
              <Episode />
            </Match>
            <Match when={page() === 'Video'}>
              <Video />
            </Match>
            <Match when={page() === 'Years'}>
              <Years />
            </Match>
            <Match when={page() === 'Genres'}>
              <Genres />
            </Match>
            <Match when={page() === 'Actors'}>
              <Actors />
            </Match>
            <Match when={page() === 'Search'}>
              <Search />
            </Match>
            <Match when={page() === 'MediaLibrary'}>
              <MediaLibrary />
            </Match>
            <Match when={page() === 'CodecProfile'}>
              <CodecProfile />
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Suspense>
  )
}

export default App
