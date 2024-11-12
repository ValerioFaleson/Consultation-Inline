import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function TopDoctors() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const { setTopDoctors } = useContext(AppContext);

    useEffect(() => {
        const fetchTopDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/top-doctors/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                setDoctors(response.data);
                setTopDoctors(response.data);
            } catch (error) {
                console.error('Il y a eu une erreur!', error);
            }
        };
        fetchTopDoctors();
    }, []);

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900'>
            <h1 className='text-3xl font-medium'>Les meilleurs médecins pour réserver</h1>
            <p className='sm:w-1/3 text-center text-sm'>Il suffit de parcourir notre longue liste de Docteurs de confiance.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item.id}`); scrollTo(0, 0); }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-blue-50' src={`http://localhost:8000${item.image}`} alt={`${item.names}`} />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.availability ? 'text-green-500' : 'text-red-500'}`}>
                                <p className={`w-2 h-2 rounded-full ${item.availability ? 'bg-green-500' : 'bg-red-500'}`}></p>
                                <p>{item.availability ? 'Disponible' : 'Pas disponible'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.names}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>plus</button>
        </div>
    );
}

export default TopDoctors;
