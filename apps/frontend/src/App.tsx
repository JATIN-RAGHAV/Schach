import './App.css'
import { ThemeButton } from './components/ui/themeButton'
import { BrowserRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/login/login'
import SignupPage from './pages/signup/signup'
import { GamePage } from './pages/start/game'
import Home from './pages/home/Home'
import { Play } from './pages/play/game'

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/signup' element={<SignupPage />}/>
                    <Route path='/start' element={<GamePage/>}/>
                    <Route path='/play' element={<Play/>}/>
                </Routes>
            </BrowserRouter>
            <ThemeButton/>
        </>
    )
}

export default App
