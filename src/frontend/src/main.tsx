import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/index.css'
import App from '@/App.tsx'
import LoginPage from '@/pages/login/login.tsx'
import { ThemeButton } from './components/ui/themeButton'
import SignupPage from './pages/signup/signup'
import { GamePage } from './pages/start/game'
import { Play } from './pages/play/game'

    createRoot(document.getElementById('root')!).render(

        <>
        <BrowserRouter>
        <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/start' element={<GamePage/>}/>
        <Route path='/play' element={<Play/>}/>
        </Routes>
        </BrowserRouter>
        <ThemeButton/>
        </>
    )
