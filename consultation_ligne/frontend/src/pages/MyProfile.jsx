import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const [userData, setUserData] = useState({
    name: '',
    firstName: '',
    image: '',
    email: '',
    cin: '',
    dob: '',
    gender: '',
    address: '',
    histoMedic: '',
    phone: '',
  });

  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [version, setVersion] = useState(0); // État pour forcer le re-rendu
  const navigate = useNavigate();

  // Fonction pour récupérer les données utilisateur
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const imageUrl = response.data.image ? (response.data.image.startsWith('http') ? response.data.image : `http://localhost:8000${response.data.image}`) : '';
      setUserData({
        name: response.data.name,
        firstName: response.data.firstName,
        image: imageUrl,
        email: response.data.email,
        cin: response.data.cin,
        dob: response.data.dob,
        gender: response.data.gender,
        address: response.data.address,
        histoMedic: response.data.histoMedic,
        phone: response.data.phone,
      });
    } catch (error) {
      console.error("Il y a eu une erreur!", error);
    }
  };

  // Appel de la fonction fetchProfile lors du montage du composant
  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', userData.name || '');
      formData.append('firstName', userData.firstName || 'DefaultFirstName');
      formData.append('cin', userData.cin || '');
      formData.append('dob', userData.dob || '');
      formData.append('gender', userData.gender || 'Non spécifié');
      formData.append('address', userData.address || '');
      formData.append('phone', userData.phone || '');
      formData.append('histoMedic', userData.histoMedic || '');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(
        'http://localhost:8000/api/update-profile/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.message === 'Profile updated successfully') {
        setIsEdit(false);
        const updatedImage = imageFile ? URL.createObjectURL(imageFile) : userData.image;
        setUserData(prev => ({ ...prev, image: updatedImage }));
        localStorage.setItem('user', JSON.stringify({ ...userData, image: updatedImage }));
        setVersion(version + 1); // Mise à jour de l'état pour forcer le re-rendu
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      await saveProfile(); // Appel de la fonction qui sauvegarde le profil
      setIsEdit(false); // Mise à jour de l'état pour désactiver le mode d'édition
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du profil:', error);
    }
  };

  // Fonction pour formater la date en jj/mm/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour gérer le changement de fichier
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setUserData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  return (
    <div key={version} className='max-w-lg flex flex-col gap-4 text-sm p-4 bg-white shadow-lg rounded-lg'>
      <img className='w-36 h-36 rounded-full mx-auto' src={userData.image} alt="Profile" />
      {isEdit ? (
        <>
          <input type="file" onChange={handleImageChange} className='block mx-auto' />
          <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 mx-auto' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
        </>
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4 text-center'>{userData.name}</p>
      )}
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>INFORMATION DE CONTACT</p>
        <div className='grid grid-cols-2 gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Téléphone:</p>
          {isEdit ? (
            <input className='bg-gray-100 max-w-52' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}
          <p className='font-medium'>Adresse:</p>
          {isEdit ? (
            <input className='bg-gray-50' onChange={e => setUserData(prev => ({ ...prev, address: e.target.value }))} value={userData.address} type="text" />
          ) : (
            <p className='text-gray-500'>{userData.address}</p>
          )}
        </div>
      </div>
      <div>
        <p className='text-neutral-500 underline mt-3'>INFORMATION DE BASE</p>
        <div className='grid grid-cols-2 gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>CIN:</p>
          {isEdit ? (
            <input className='bg-gray-100' type="text" onChange={e => setUserData(prev => ({ ...prev, cin: e.target.value }))} value={userData.cin} />
          ) : (
            <p className='text-gray-400'>{userData.cin}</p>
          )}
          <p className='font-medium'>Genre:</p>
          {isEdit ? (
            <select className='max-w-20 bg-gray-100' onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
              <option value="Non spécifié">Non spécifié</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}
          <p className='font-medium'>Date de naissance:</p>
          {isEdit ? (
            <input className='max-w-28 bg-gray-100' type="date" onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
          ) : (
            <p className='text-gray-400'>{formatDate(userData.dob)}</p>  // Utilisation de la fonction de formatage ici
          )}
        </div>
      </div>
      <div className='mt-6'>
        <p className='text-neutral-500 underline mb-2'>HISTOIRE MÉDICALE</p>
        {isEdit ? (
          <textarea className='bg-gray-100 w-full h-40 p-2 border border-gray-300 rounded' onChange={e => setUserData(prev => ({ ...prev, histoMedic: e.target.value }))} value={userData.histoMedic} />
        ) : (
          <p className='text-gray-400 w-full h-40 p-2 overflow-y-auto border border-gray-300 rounded'>{userData.histoMedic}</p>
        )}
      </div>
      <div className='mt-10'>
        {isEdit ? (
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={handleSave}>Enregistrer les informations</button>
        ) : (
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Modifier</button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
