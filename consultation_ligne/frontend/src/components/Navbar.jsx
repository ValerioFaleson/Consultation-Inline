import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        const imageURL = parsedUser.image.startsWith('http') ? parsedUser.image : `http://localhost:8000${parsedUser.image}`;
        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
          image: imageURL || null
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse des données utilisateur:", error);
    }
  }, [token]);

  useEffect(() => {
    if (location.state?.updateNavbar) {
      setToken(!!localStorage.getItem('token'));
    }
  }, [location.state]);

  // Ajout de l'écouteur d'événement pour la mise à jour du profil
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      setUser(prevUser => ({
        ...prevUser,
        image: event.detail.image
      }));
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Ajouter un écouteur de changements sur le localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem('userImage');
      setUser(prevUser => ({
        ...prevUser,
        image: updatedImage
      }));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Supprimer également les données utilisateur du localStorage
    setToken(false);
    setUser({}); // Réinitialiser l'état utilisateur
    // toast.success('Déconnexion réussie. À bientôt!');
    navigate('/'); // Redirection vers la page de connexion
  };

  return (
    <div>
        <ToastContainer />
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={() => navigate('/')} className='w-40 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
          <NavLink to='/'><li className='py-1'>ACCEUIL</li></NavLink>
          <NavLink to='/doctors'><li className='py-1'>DOCTEURS</li></NavLink>
          <NavLink to='/about'><li className='py-1'>A PROPOS</li></NavLink>
          <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
        </ul>
        <div className='flex items-center gap-4'>
          { token
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                {user.image
                  ? <img className='w-8 h-8 rounded-full' src={user.image} alt="User Profile" />
                  : <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-700'>
                      {user.name ? user.name.charAt(0).toUpperCase() : ''}
                    </div>
                }
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>Mon Profile</p>
                    <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>Mon Rendez-vous</p>
                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Déconnexion</p>
                  </div>
                </div>
              </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Se connecter</button>
          }
          <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
          <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <img className='w-36' src={assets.logo} alt="" />
              <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
            </div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
              <NavLink onClick={() => setShowMenu(false)} to='/'><p>ACCEUIL</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p>DOCTEURS</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about'><p>A PROPOS</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact'><p>CONTACT</p></NavLink>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
