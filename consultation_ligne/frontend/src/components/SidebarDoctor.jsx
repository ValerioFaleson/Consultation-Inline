import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import SpaceDoctorNavbar from './SpaceDoctorNavbar';
import DoctorProfile from '../pages/doctorSpace/DoctorProfile';
import DoctorAppointments from '../pages/doctorSpace/DoctorAppointments';
import DoctorDashboard from '../pages/doctorSpace/DoctorDashboard';
import logoDashboard from '../assets/spaceDocImage/home_icon.jpg';
import logoAppointment from '../assets/spaceDocImage/appointment_icon.jpg';
import logoDoctor from '../assets/spaceDocImage/patient_icon.jpg';

const SidebarDoctor = () => {
  return (
    <div>
      <SpaceDoctorNavbar />
      <div className="flex">
        <div className="flex w-full">
          {/* Barre de navigation à droite */}
          <div className="max-h-screen bg-white border-r">
            <ul className='text-[#515151] mt-5'>
              <NavLink to='/spaceDoctor/dashboard' className={({ isActive }) => `flex items-center gap-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                <img src={logoDashboard} alt="Tableau de Bord" className="w-8 h-8" />
                <p className='hidden md:block'>Tableau de Bord</p>
              </NavLink><br />

              <NavLink to='/spaceDoctor/appointments' className={({ isActive }) => `flex items-center gap-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                <img src={logoAppointment} alt="Mes Rendez-vous" className="w-8 h-8" />
                <p className='hidden md:block'>Mes Rendez-vous</p>
              </NavLink><br />

              <NavLink to='/spaceDoctor/profile' className={({ isActive }) => `flex items-center gap-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
                <img src={logoDoctor} alt="Mon Profil" className="w-8 h-8" />
                <p className='hidden md:block'>Mon Profil</p>
              </NavLink><br />
            </ul>
          </div>
          {/* Contenu principal */}
          <div className="p-4 flex-1">
            <Routes>
              <Route path='profile' element={<DoctorProfile />} />
              <Route path='appointments' element={<DoctorAppointments />} />
              <Route path='dashboard' element={<DoctorDashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarDoctor;
