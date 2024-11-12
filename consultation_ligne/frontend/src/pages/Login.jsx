import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [state, setState] = useState('Inscription');
  const [loginType, setLoginType] = useState('Patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const baseURL = "http://localhost:8000/api";

    try {
      let response;
      if (state === 'Inscription') {
        if (!validateEmail(email)) {
          toast.error('Veuillez entrer un email valide.');
          return;
        }
        if (password.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères.');
          return;
        }

        response = await axios.post(`${baseURL}/signup/`, { email, password, name });
        toast.success('Compte créé avec succès. Veuillez vous connecter.');
        setState('Connexion');
      } else {
        response = await axios.post(`${baseURL}/login/`, { email, password, loginType });  // Inclure loginType
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          image: response.data.user.image,
          is_doctor: response.data.user.is_doctor
        }));
        toast.success('Connexion réussie. Bienvenue!', {
          onClose: () => {
            if (response.data.user.is_doctor) {
              navigate('/spaceDoctor', { state: { updateNavbar: true } });
            } else {
              navigate('/', { state: { updateNavbar: true } });
            }
          }
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
        <div className='flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
          <p className='text-3xl font-bold text-primary mb-4'>{state === 'Inscription' ? "Créer un compte" : "Connexion"}</p>
          <p className='text-lg'>Veuillez {state === 'Inscription' ? "vous inscrire" : `vous connecter comme ${loginType.toLowerCase()}`}</p>

          {state === 'Connexion' && (
            <div className='w-full mb-4'>
              <p className='mb-2'>Utilisateur </p>
              <div className='flex gap-4'>
                <button
                  type='button'
                  className={`border p-2 rounded ${loginType === 'Patient' ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                  onClick={() => setLoginType('Patient')}
                >
                  Patient
                </button>
                <button
                  type='button'
                  className={`border p-2 rounded ${loginType === 'Docteur' ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                  onClick={() => setLoginType('Docteur')}
                >
                  Docteur
                </button>
              </div>
            </div>
          )}

          {state === "Inscription" && loginType === 'Patient' && (
            <div className='w-full mb-4'>
              <p>Nom complet</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='Entrez votre nom' required />
            </div>
          )}
          <div className='w-full mb-4'>
            <p>Email</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Entrez votre email' required />
          </div>
          <div className='w-full mb-4'>
            <p>Mot de passe</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Entrez votre mot de passe' required />
          </div>
          <button className='bg-primary text-white w-full py-2 rounded-md text-base transition-transform transform hover:scale-105'>
            {state === 'Inscription' ? "Créer un compte" : "Connexion"}
          </button>
          {state === "Inscription" ? (
            <p className='text-sm mt-4'>Vous avez déjà un compte ? <span onClick={() => setState('Connexion')} className='text-primary underline cursor-pointer'>Connectez-vous ici</span></p>
          ) : (
            loginType === 'Patient' && (
              <p className='text-sm mt-4'>Créer un nouveau compte ? <span onClick={() => setState('Inscription')} className='text-primary underline cursor-pointer'>Cliquez ici</span></p>
            )
          )}
        </div>
      </form>
    </>
  );
};

export default Login;
