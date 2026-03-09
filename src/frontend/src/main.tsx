import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/index.css'
import App from '@/App.tsx'
import LoginPage from '@/pages/login/login.tsx'
import { ThemeButton } from './components/ui/themeButton'
import SignupPage from './pages/signup/signup'
import { GamePage } from './pages/start/game'
import { Play } from './pages/play/game'
import {create} from 'zustand'
import { type gameStartState } from './lib/interfaces/customHooks'
import type { color, gameTypes } from '../../common/interfaces/enums'

export const useGame = create<gameStartState>((set) => ({
    gameType:null,
    color:null,
    gameIncrement:null,
    socket:null,
    setGameType:(gameType:gameTypes) => set({gameType}),
    setColor:(color:color) => set({color}),
    setGameIncrement:(gameIncrement:number) => set({gameIncrement}),
    setSocket:(socket:WebSocket) => set({socket}),
}))

    createRoot(document.getElementById('root')!).render(

        <StrictMode>
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
        </StrictMode>,
    )
