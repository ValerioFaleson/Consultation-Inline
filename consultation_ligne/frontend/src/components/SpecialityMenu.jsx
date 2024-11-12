import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SpecialityMenu() {
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const token = localStorage.getItem('token');  // Récupérez le token
        const response = await axios.get('http://localhost:8000/api/specialities/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });
        setSpecialities(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des spécialités !", error);
      }
    };
    fetchSpecialities();
  }, []);

  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium'>Trouver par spécialité</h1>
      <p className='sm:w-1/3 text-center text-sm'>Il suffit de parcourir notre longue liste de Docteurs de confiance, effacer votre rendez-vous sans problème</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full'>
        {specialities.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            key={index}
            to={`/doctors/${item.id}`}  // Utiliser item.id pour l'URL
          >
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
            <p>{item.design}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpecialityMenu;
