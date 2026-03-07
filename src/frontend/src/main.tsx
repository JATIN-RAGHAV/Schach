import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@/index.css'
import App from '@/App.tsx'
import LoginPage from '@/pages/login/login.tsx'
import { ThemeButton } from './components/ui/themeButton'
import SignupPage from './pages/signup/signup'
import { GamePage } from './pages/play/game'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}/>
                <Route path='/login' element={<LoginPage />}/>
                <Route path='/signup' element={<SignupPage/>}/>
                <Route path='/play' element={<GamePage/>}/>
            </Routes>
        </BrowserRouter>
        <ThemeButton/>
    </StrictMode>,
)
