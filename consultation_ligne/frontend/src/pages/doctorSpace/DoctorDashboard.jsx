import React from 'react'
import logoMoney from '../../assets/spaceDocImage/earning_icon.jpg'
import logoAppointments from '../../assets/spaceDocImage/appointments_icon.jpg'
import logoPatients from '../../assets/spaceDocImage/patients_icon.jpg'
import logoList from '../../assets/spaceDocImage/list_icon.jpg'

const DoctorDashboard = () => {
  return (
    <div className='m-1'>

        <div className='flex flex-wrap gap-3'>

            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'> 
                <img src={logoMoney} alt="" className="w-14 h-14" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>15</p>
                    <p className='text-gray-400'>money</p>
                </div>
            </div>

            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                <img src={logoAppointments} alt="" className="w-14 h-14" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>10</p>
                    <p className='text-gray-400'>Rendez-vous</p>
                </div>
            </div>

            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                <img src={logoPatients} alt="" className="w-14 h-14" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>20</p>
                    <p className='text-gray-400'>Patients</p>
                </div>
            </div>

        </div>

        <div className='bg-white'>

            <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
                <img src={logoList} alt="" className='w-6 h-6'/>
                <p className='font-semibold'>Rendez-vous récents</p>
            </div>

            <div className='pt-4 border-t-0'>

            </div>

        </div>

    </div>
  )
}

export default DoctorDashboard
