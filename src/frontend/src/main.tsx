import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}/>
                <Route path='/walrus' element={<h1> Walrus Here </h1>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
