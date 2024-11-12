import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Doctors() {
    const { speciality } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            let response;
            if (speciality) {
                response = await axios.get(`http://localhost:8000/api/doctors/speciality/${speciality}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                response = await axios.get('http://localhost:8000/api/doctors/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            const updatedDoctors = response.data.map(doctor => ({
                ...doctor,
                image: doctor.image.startsWith('http') ? doctor.image : `http://localhost:8000${doctor.image}`
            }));
            setDoctors(updatedDoctors);
        } catch (error) {
            console.error("Il y a eu une erreur!", error);
        }
    };

    const fetchSpecialities = async () => {
        try {
            const token = localStorage.getItem('token');
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

    useEffect(() => {
        fetchDoctors();
        fetchSpecialities();
    }, [speciality]);

    return (
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            <div className="lg:w-1/4 py-12">
                <center>
                </center>
                <div className={`flex flex-col gap-2 text-sm text-gray-600`}>
                    <button 
                        onClick={() => navigate('/doctors')} 
                        className={`py-1 px-2 border rounded cursor-pointer text-xs hover:bg-gray-200 ${!speciality ? 'bg-blue-200 border-blue-500' : ''}`}
                    >
                        Tout afficher
                    </button>
                    {specialities.map((item, index) => (
                        <Link 
                            key={index} 
                            to={`/doctors/${item.id}`} 
                            className={`py-1 px-2 border rounded cursor-pointer text-xs hover:bg-gray-200 ${speciality == item.id ? 'bg-blue-200 border-blue-500' : ''}`}
                        >
                            {item.design}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="lg:w-3/4">
                <center>
                    <p className='text-gray-600'>Listes des Docteurs</p>
                </center>
                <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                    <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                        {doctors.length > 0 ? (
                            doctors.map((item, index) => (
                                <div onClick={() => navigate(`/appointment/${item.id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                                    <img className='bg-blue-50' src={item.image} alt={`${item.name} ${item.firstName}`} />
                                    <div className='p-4'>
                                        <div className={`flex items-center gap-2 text-sm text-center ${item.availability ? 'text-green-500' : 'text-red-500'}`}>
                                            <p className={`w-2 h-2 rounded-full ${item.availability ? 'bg-green-500' : 'bg-red-500'}`}></p>
                                            <p>{item.availability ? 'Disponible' : 'Pas disponible'}</p>
                                        </div>
                                        <p className='text-gray-900 text-lg font-medium'>Dr {item.name} {item.firstName}</p>
                                        <p className='text-gray-600 text-sm'>{item.specialite}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-center text-gray-600'>Aucun docteur trouvé</p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Doctors;
