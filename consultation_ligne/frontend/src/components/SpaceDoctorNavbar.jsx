import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SpaceDoctorNavbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Supprimer également les données utilisateur du localStorage
    setToken(false);
    navigate('/login'); // Redirection vers la page de connexion
  };

  return (
    <div>
      <ToastContainer />
      <div className='flex items-center justify-between text-sm py-4 border-b border-b-gray-400'>
        <img onClick={() => navigate('/spaceDoctor')} className='w-40 cursor-pointer' src={assets.logo} alt="Logo" />
        {token && (
          <button onClick={handleLogout} className='bg-primary text-white px-8 py-3 rounded-full font-light'>
            Déconnexion
          </button>
        )}
      </div>
    </div>
  );
}

export default SpaceDoctorNavbar;
