import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import logoCancel from '../../assets/spaceDocImage/cancel_icon.jpg';
import logoTick from '../../assets/spaceDocImage/tick_icon.jpg';
import defaultPatientImage from '../../assets/spaceDocImage/upload_area.jpg';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/doctor_appointments/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    }
    fetchAppointments();
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    const dateTime = parseISO(`${dateStr}T${timeStr}`);
    return format(dateTime, 'dd/MM/yyyy à HH:mm');
  };

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:8000/api/appointments/${appointmentId}/cancel/`, {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId ? { ...appointment, status: 'annulé' } : appointment
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous', error);
    }
  };

  const handleConfirm = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:8000/api/appointments/${appointmentId}/confirm/`, {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId ? { ...appointment, status: 'confirmé' } : appointment
        )
      );
    } catch (error) {
      console.error('Erreur lors de la confirmation du rendez-vous', error);
    }
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Tous les Rendez-vous</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patients</p>
          <p>Payement</p>
          <p>Age</p>
          <p>Date & Heure</p>
          <p>Prix</p>
          <p>Statuts</p>
          <p>Action</p>
        </div>

        {appointments.map((appointment, index) => (
          <div key={appointment.id} className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
            <div>{index + 1}</div>
            <div className='flex items-center'>
                {/* <img src={`http://localhost:8000${appointment.patient_details.image}`} alt="Patient" className='w-10 h-10 rounded-full mr-2'/> */}
                <img src={appointment.patient_details.image ? `http://localhost:8000${appointment.patient_details.image}` : defaultPatientImage} alt="Patient" className='w-10 h-10 rounded-full mr-2'/>
                <span>{appointment.patient_details.name}</span>
            </div>

            <div>
              {appointment.payment_status}
            </div>

            <div>
              {appointment.patient_details.age} ans
            </div>

            <div>
              le {formatDateTime(appointment.date, appointment.heure)}
            </div>

            <div>
              {appointment.price} €
            </div>

            <div>
              {appointment.status}
            </div>

            <div className='flex space-x-2'>
              {appointment.status === 'annulé' ? (
                <span className='text-red-500'>Non validé</span>
              ) : (
                <>
                  <img src={logoCancel} alt="Cancel" className='w-9 h-9 cursor-pointer' onClick={() => handleCancel(appointment.id)}/>
                  {appointment.status !== 'confirmé' && <img src={logoTick} alt="Confirm" className='w-9 h-9 cursor-pointer' onClick={() => handleConfirm(appointment.id)}/>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments;
