import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SidebarDoctor from './components/SidebarDoctor';

function App() {
  const location = useLocation();
  const isDoctorRoute = location.pathname.startsWith('/spaceDoctor');

  return (
    <div className='mx-4 sm:mx-[1%]'>
      {!isDoctorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/spaceDoctor/*' element={<SidebarDoctor />} />
      </Routes>
      {!isDoctorRoute && <Footer />}
    </div>
  );
}

export default App;
