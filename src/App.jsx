import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomePage from './Pages//HomePage/HomePage';
import Notification from './Pages/Notification/Notification';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/notification' element={<Notification/> } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
