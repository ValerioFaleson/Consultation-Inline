import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns';
import logoTick from '../assets/spaceDocImage/tick_icon.jpg'; // Assurez-vous que le chemin est correct

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/appointments/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error("Il y a eu une erreur lors de la récupération des rendez-vous!", { position: toast.POSITION.TOP_RIGHT });
      console.error("Il y a eu une erreur!", error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/appointments/${appointmentId}/cancel/`, {}, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success("Rendez-vous annulé avec succès!");
      fetchAppointments(); // Réactualiser la liste des rendez-vous
    } catch (error) {
      toast.error("Erreur lors de l'annulation du rendez-vous!");
      console.error("Il y a eu une erreur!", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDateTime = (dateString, timeString) => {
    const date = parseISO(dateString);
    const time = parseISO(`${dateString}T${timeString}`);
    return `${format(date, 'dd/MM/yyyy')} à ${format(time, 'HH:mm')}`;
  };

  return (
    <div>
      <ToastContainer />
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>Mes Rendez-vous</p>
      <div>
        {appointments.map((appointment, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={appointment.doctor_details?.image || ''} alt={appointment.doctor_details?.name || 'Image non disponible'} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{appointment.doctor_details?.name} {appointment.doctor_details?.firstName}</p>
              <p>{appointment.doctor_details?.specialite || 'Spécialité non définie'}</p>
              <p className='text-zinc-700 font-medium mt-1'>Adresse:</p>
              <p className='text-xs'>{appointment.doctor_details?.address || 'Adresse non définie'}</p>
              <p className='text-zinc-700 font-medium mt-1'>Email:</p>
              <p className='text-xs'>{appointment.doctor_details?.email || 'Adresse non définie'}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>
                  Date & Heure: {formatDateTime(appointment.date, appointment.heure)}
                </span>
              </p>
            </div>
            <div className='flex flex-col gap-2 justify-center items-center'>
              {appointment.status === 'confirmé' && (
                <img src={logoTick} alt="Confirmé" className='w-9 h-9' />
              )}
              {appointment.status === 'annulé' ? (
                <p className='text-sm text-red-600 font-medium text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Rendez-vous annulé</p>
              ) : (
                <>
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                    Payer en ligne
                  </button>
                  <button onClick={() => cancelAppointment(appointment.id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                    Annuler le rendez-vous
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
