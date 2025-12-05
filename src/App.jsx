import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomePage from './Pages//HomePage/HomePage';
import Login from "./Pages/LoginPage/Login"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/home' element={<HomePage/>} />
        <Route path='/login' element={<Login/> } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
