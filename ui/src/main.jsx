import { StrictMode } from 'react'
import ReactDOM , {createRoot} from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import './index.css'






createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={ <div>
        <p> this is an application to test multicontainers </p>
    </div>} />
    </Routes>
  </BrowserRouter>,
)
