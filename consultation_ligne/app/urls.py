from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, SpecialityViewSet, GradeViewSet, AppointmentViewSet, DoctorProfileView,DoctorAppointmentsView,get_top_doctors, get_doctors_by_speciality ,login_view, signup_view, update_profile, get_profile, CurrentPatientView

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'specialities', SpecialityViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'appointments', AppointmentViewSet) # Enregistrez la vue de rendez-vous

urlpatterns = [
    path('', include(router.urls)),
    path('top-doctors/', get_top_doctors, name='get_top_doctors'),
    path('doctors/speciality/<int:speciality_id>/', get_doctors_by_speciality, name='get_doctors_by_speciality'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('update-profile/', update_profile, name='update_profile'),  # Ajout de l'URL pour la mise à jour du profil
    path('profile/', get_profile, name='get_profile'), # Nouvelle route pour récupérer le profil
    path('current_patient/', CurrentPatientView.as_view(), name='current-patient'),
    path('appointments/<int:pk>/cancel/', AppointmentViewSet.as_view({'post': 'cancel'}), name='appointment-cancel'),
    path('appointments/<int:pk>/confirm/', AppointmentViewSet.as_view({'post': 'confirm'}), name='appointment-confirm'),
    path('doctor/profile', DoctorProfileView.as_view(), name='doctor-profile'),
    path('doctor_appointments/', DoctorAppointmentsView.as_view(), name='doctor-appointments'), # Ajouter cette ligne
]
