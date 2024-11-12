import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    specialite: '',
    age: '',
    experience: '',
    about: '',
    fees: '',
    address: '',
    availability: false,
    grade: '',
    email: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null); // État pour l'URL temporaire de l'image

  const [isSpecialiteEditing, setIsSpecialiteEditing] = useState(false);
  const [isGradeEditing, setIsGradeEditing] = useState(false);

  const fileInputRef = useRef(null); // Référence pour l'input de fichier

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/doctor/profile', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        const doctorData = response.data;
        if (doctorData.image && !doctorData.image.startsWith('http')) {
          doctorData.image = `http://localhost:8000${doctorData.image}`;
        }
        setDoctor(doctorData);
        setFormData({
          name: doctorData.name,
          firstName: doctorData.firstName,
          specialite: doctorData.specialite.design,
          age: doctorData.age,
          experience: doctorData.experience,
          about: doctorData.about,
          fees: doctorData.fees,
          address: doctorData.address,
          availability: doctorData.availability,
          grade: doctorData.grade ? doctorData.grade.name : '',
          email: doctorData.email,
          image: null
        });
        setImagePreview(doctorData.image); // Mettre à jour l'aperçu de l'image
      } catch (error) {
        toast.error('Erreur lors de la récupération du profil');
      }
    };

    const fetchSpecialtiesAndGrades = async () => {
      const token = localStorage.getItem('token');
      try {
        const specialtiesResponse = await axios.get('http://localhost:8000/api/specialities/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        const gradesResponse = await axios.get('http://localhost:8000/api/grades/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setSpecialties(specialtiesResponse.data);
        setGrades(gradesResponse.data);
      } catch (error) {
        toast.error('Erreur lors de la récupération des spécialités et des grades');
      }
    };

    fetchDoctorProfile();
    fetchSpecialtiesAndGrades();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });
    setImagePreview(URL.createObjectURL(file)); // Mettre à jour l'URL temporaire de l'image
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSpecialiteChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      specialite: value
    });
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      grade: value
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
  
    // Vérifier les IDs des spécialités et des grades seulement si modifiés
    const specialiteId = specialties.find(spec => spec.design === formData.specialite)?.id;
    const gradeId = grades.find(gr => gr.name === formData.grade)?.id;
  
    const updatedFormData = new FormData();
    updatedFormData.append('name', formData.name);
    updatedFormData.append('firstName', formData.firstName);
    updatedFormData.append('age', formData.age);
    updatedFormData.append('experience', formData.experience);
    updatedFormData.append('about', formData.about);
    updatedFormData.append('fees', formData.fees);
    updatedFormData.append('address', formData.address);
    updatedFormData.append('availability', formData.availability);
    updatedFormData.append('email', formData.email);
  
    // Ajouter `specialite_id` seulement si modifié
    if (specialiteId !== undefined) {
      updatedFormData.append('specialite_id', specialiteId);
    }
  
    // Ajouter `grade_id` seulement si modifié
    if (gradeId !== undefined) {
      updatedFormData.append('grade_id', gradeId);
    }
  
    // Ajouter l'image si présente
    if (formData.image) {
      updatedFormData.append('image', formData.image);
    }
  
    try {
      console.log('Updated FormData:', updatedFormData);  // Journaliser les données envoyées
      const response = await axios.put('http://localhost:8000/api/doctor/profile', updatedFormData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setDoctor(response.data);
      setIsEditing(false);
      setIsSpecialiteEditing(false);
      setIsGradeEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <div>
        <img className='bg-primary w-full sm:max-w-72 rounded-lg cursor-pointer' src={imagePreview || doctor.image} alt={doctor.name} 
          onClick={() => isEditing && fileInputRef.current.click()} // Ajouter l'événement de clic pour l'édition
        />
        <input
          type="file"
          ref={fileInputRef}
          name="image"
          onChange={handleFileChange}
          className="hidden" // Masquer l'input de fichier
        />
      </div>
      <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
          Dr {isEditing ? (
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='w-1/2 mr-2' />
          ) : (
            <span>{doctor.name}</span>
          )} {isEditing ? (
            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className='w-1/2 mr-2' />
          ) : (
            <span>{doctor.firstName}</span>
          )}
          <img src={assets.verified_icon} alt="" />
        </p>
        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
          <p>
          {isEditing ? (
            <>
              {isSpecialiteEditing ? (
                <select name="specialite" value={formData.specialite} onChange={handleSpecialiteChange} className='w-1/2 mr-2'>
                  {specialties.map(speciality => (
                    <option key={speciality.id} value={speciality.design}>{speciality.design}</option>
                  ))}
                </select>
              ) : (
                <>
                  <span>{doctor.specialite}</span>
                  <button onClick={() => setIsSpecialiteEditing(true)} className='ml-2 text-blue-500'>Modifier</button>
                </>
              )}
            </>
          ) : (
            <span>{doctor.specialite}</span>
          )}</p>
          <button className='py-0.5 px-2 border text-xs rounded-full'>{doctor.age} ans</button>
        </div>
        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
          {isEditing && (
            <input type="file" name="image" onChange={handleFileChange} className='hidden' ref={fileInputRef} />
          )}
        </div>
        <div>
          <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
            A Propos <img src={assets.info_icon} alt="" />
          </p>
          {isEditing ? (
            <textarea name="about" value={formData.about} onChange={handleInputChange} className='text-sm text-gray-500 w-full mt-1' />
          ) : (
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{doctor.about}</p>
          )}
          <div className='flex items-center gap-2 text-sm text-gray-500 max-w-[700px] mt-1'>
            Grade : {isEditing ? (
              <>
                {isGradeEditing ? (
                  <select name="grade" value={formData.grade} onChange={handleGradeChange} className='w-1/2 mr-2'>
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.name}>{grade.name}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <span>{doctor.grade}</span>
                    <button onClick={() => setIsGradeEditing(true)} className='ml-2 text-blue-500'>Modifier</button>
                  </>
                )}
              </>
            ) : (
              <span>{doctor.grade}</span>
            )}
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 max-w-[700px] mt-1'>
            Expérience : {isEditing ? (
              <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className='w-1/2 mr-2' />
            ) : (
              <span>{doctor.experience}</span>
            )} ans
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 max-w-[700px] mt-1'>
            Adresse : {isEditing ? (
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className='w-1/2 mr-2' />
            ) : (
              <span>{doctor.address}</span>
            )}
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 max-w-[700px] mt-1'>
            Email : {isEditing ? (
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className='w-1/2 mr-2' />
            ) : (
              <span>{doctor.email}</span>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2 text-gray-500 font-medium mt-1'>
          Frais de consultation: {isEditing ? (
            <input type="text" name="fees" value={formData.fees} onChange={handleInputChange} className='text-gray-600 w-1/2 mr-2' />
          ) : (
            <span className='text-gray-600'>{doctor.fees}</span>
          )}
        </div>
        <div className='flex gap-1 pt-2'>
          {isEditing ? (
            <input type="checkbox" name="availability" checked={formData.availability} onChange={handleCheckboxChange} />
          ) : (
            <input type="checkbox" checked={doctor.availability} readOnly />
          )}
          <label htmlFor="availability">Disponibilité</label>
        </div>
        <button onClick={isEditing ? handleSave : handleEditClick} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>
          {isEditing ? 'Enregistrer' : 'Modifier'}
        </button>
      </div>
    </div>
  );
}

export default DoctorProfile;
