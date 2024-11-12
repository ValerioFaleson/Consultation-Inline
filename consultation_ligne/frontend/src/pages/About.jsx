import React from 'react'
import { assets } from '../assets/assets'

function About() {
  return (

    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>À PROPOS DE <span className='text-gray-700 font-medium'>NOUS</span></p>
      </div>


      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Bienvenue chez ConsultDoc, votre partenaire de confiance pour gérer vos besoins de santé de manière pratique et efficace. Chez ConsultDoc, nous comprenons les défis auxquels les individus sont confrontés lorsqu'il s'agit de prendre des rendez-vous avec des médecins et de gérer leurs dossiers de santé.</p>
          <p>ConsultDoc s'engage à l'excellence dans la technologie de la santé. Nous nous efforçons constamment d'améliorer notre plateforme en intégrant les dernières avancées pour offrir une meilleure expérience utilisateur et un service de qualité supérieure. Que vous réserviez votre premier rendez-vous ou gériez des soins continus, ConsultDoc est là pour vous accompagner à chaque étape.</p>
          <b className='text-gray-800'>Notre vision</b>
          <p>Notre vision chez ConsultDoc est de créer une expérience de santé fluide pour chaque utilisateur. Nous visons à combler le fossé entre les patients et les prestataires de soins de santé, en rendant plus facile l'accès aux soins dont vous avez besoin, quand vous en avez besoin.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>Pourquoi <span className='text-gray-700 font-semibold'>Choisissez-nous</span> </p>
      </div>



     <div className='flex flex-col md:flex-row mb-20'>

      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficacité :</b>
          <p>Planification de rendez-vous simplifiée qui s'adapte à votre mode de vie chargé.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Commodité :</b>
          <p>Accès à un réseau de professionnels de santé de confiance dans votre région.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personnalisation :</b>
          <p>Recommandations et rappels personnalisés pour vous aider à rester en bonne santé.</p>
        </div>
      </div>

    </div>
  )
}

export default About
