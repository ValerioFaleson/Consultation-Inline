import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assets';

const Appointment = () => {
  const { docId } = useParams();
  const dayOfWeek = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [patientId, setPatientId] = useState(null);

  const fetchDocInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/doctors/${docId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setDocInfo(response.data);
    } catch (error) {
      toast.error("Il y a eu une erreur!", { position: toast.POSITION.TOP_RIGHT });
      console.error("Il y a eu une erreur!", error);
    }
  };

  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/current_patient/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setPatientId(response.data.id);
      setCurrencySymbol(response.data.currencySymbol);
    } catch (error) {
      toast.error("Il y a eu une erreur!", { position: toast.POSITION.TOP_RIGHT });
      console.error("Il y a eu une erreur!", error);
    }
  };

  const handleBookAppointment = async () => {
    const token = localStorage.getItem('token');
    const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);
    const data = {
      patient: patientId,
      doctor: docId,
      date: selectedSlot.datetime.toISOString().split('T')[0],
      heure: selectedSlot.datetime.toTimeString().split(' ')[0],
      description: '',
      status: 'en attente',
      duration: '00:30:00'
    };

    console.log('Data sent:', data);

    try {
      await axios.post('http://localhost:8000/api/appointments/', data, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Rendez-vous sélectionné, en attente de confirmation!');
    } catch (error) {
      toast.error('Erreur lors de la prise de rendez-vous.');
      console.error("Il y a eu une erreur!", error.response.data);
    }
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots(prev => ([...prev, timeSlots]));
    }
  };

  useEffect(() => {
    fetchDocInfo();
    fetchPatientInfo();
  }, [docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return docInfo && (
    <div>
      <ToastContainer />
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image.startsWith('http') ? docInfo.image : `http://localhost:8000${docInfo.image}`} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            Dr {docInfo.name} {docInfo.firstName}
            <img src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.specialite}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.age} ans</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              A Propos <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Grade : {docInfo.grade}</p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Expérience : {docInfo.experience} ans</p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Adresse : {docInfo.address}</p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>Email : {docInfo.email}</p>
          </div>
          <p className='text-gray-500 font-medium'>
            Frais de consultation: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      {docInfo.availability && (
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Réserver des créneaux </p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white ' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button onClick={handleBookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
            Prendre un rendez-vous
          </button>
        </div>
      )}
      {!docInfo.availability && (
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p className='text-red-600'>Le docteur n'est pas disponible pour des rendez-vous pour le moment.</p>
        </div>
      )}
        </div>
  );
};

export default Appointment;
