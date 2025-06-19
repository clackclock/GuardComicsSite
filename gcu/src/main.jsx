// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import './index.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Contact from "./pages/contact";
import Gallery from "./pages/gallery";
import NoPage from "./pages/NoPage";
import './index.css'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="GuardComicsSite/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />}/>
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);