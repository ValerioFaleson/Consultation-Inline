from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.contrib.auth import authenticate
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication
from .models import Patient
from .models import Doctor, Speciality, Grade, Appointment
from .serializers import DoctorSerializer, SpecialitySerializer , GradeSerializer, AppointmentSerializer
from django.http import JsonResponse
import logging
from rest_framework import status
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

class SpecialityViewSet(viewsets.ModelViewSet):
    queryset = Speciality.objects.all()
    serializer_class = SpecialitySerializer
    permission_classes = [IsAuthenticated]

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]




class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
            serializer = DoctorSerializer(doctor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                # Log the errors for debugging
                print(serializer.errors)  # Journaliser les erreurs de validation
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)





class CurrentPatientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            data = {
                'id': patient.id,
                'name': patient.name,
                'firstName': patient.firstName,
                'email': patient.email,
                'dob': patient.dob,
                'gender': patient.gender,
                'adresse': patient.adresse,
                'phone': patient.phone,
                'histoMedic': patient.histoMedic,
                'currencySymbol': ''  # Ajoutez le symbole monétaire si nécessaire
            }
            return Response(data)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=404)



# class AppointmentViewSet(viewsets.ModelViewSet):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         if hasattr(user, 'patient'):
#             return Appointment.objects.filter(patient=user.patient)
#         return Appointment.objects.none()

#     def perform_create(self, serializer):
#         user = self.request.user
#         logger.debug(f"Utilisateur dans perform_create: {user}")
#         if hasattr(user, 'patient'):
#             patient_profile = user.patient
#             logger.debug(f"Patient trouvé: {patient_profile}")
#             validated_data = {
#                 **serializer.validated_data,
#                 'patient': patient_profile
#             }
#             try:
#                 appointment = serializer.save(**validated_data)
#                 logger.debug(f"Rendez-vous créé: {appointment}")
#             except ValidationError as e:
#                 logger.error(f"Validation error: {e.detail}")
#                 return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
#             except Exception as e:
#                 logger.error(f"General error: {e}")
#                 return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             logger.error("User authenticated but not associated with a patient profile.")
#             raise ValidationError("User authenticated but not associated with a patient profile.")
        
#     @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
#     def cancel(self, request, pk=None):
#         appointment = self.get_object()
#         appointment.status = 'annulé'
#         appointment.save()
#         return Response({'status': 'Rendez-vous annulé'}, status=status.HTTP_200_OK)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'patient'):
            return Appointment.objects.filter(patient=user.patient)
        elif hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'patient'):
            patient_profile = user.patient
            serializer.save(patient=patient_profile)
        else:
            raise ValidationError("User authenticated but not associated with a patient profile.")

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        user = self.request.user
        appointment = self.get_object()
        if (hasattr(user, 'doctor') and appointment.doctor == user.doctor) or (hasattr(user, 'patient') and appointment.patient == user.patient):
            appointment.status = 'annulé'
            appointment.save()
            return Response({'status': 'Rendez-vous annulé'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Non autorisé à annuler ce rendez-vous'}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def confirm(self, request, pk=None):
        user = self.request.user
        appointment = self.get_object()
        if hasattr(user, 'doctor') and appointment.doctor == user.doctor:
            appointment.status = 'confirmé'
            appointment.save()
            return Response({'status': 'Rendez-vous confirmé'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Non autorisé à confirmer ce rendez-vous'}, status=status.HTTP_403_FORBIDDEN)




class DoctorAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            doctor = Doctor.objects.get(user=user)
            appointments = Appointment.objects.filter(doctor=doctor)
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)


# Vue pour récupérer les docteurs par spécialité
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def get_doctors_by_speciality(request, speciality_id):
    doctors = Doctor.objects.filter(specialite_id=speciality_id)
    doctors_data = [
        {
            'id': doctor.id,
            'name': doctor.name,
            'firstName': doctor.firstName,
            'specialite': doctor.specialite.design,
            'grade': doctor.grade.name if doctor.grade else '',
            'image': doctor.image.url if doctor.image else None,
            'availability': doctor.availability,
        } for doctor in doctors
    ]
    return JsonResponse(doctors_data, safe=False)

# Vue pour récupérer les docteurs "top"
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top_doctors(request):
    top_grades = Grade.objects.filter(name__in=['Professeur de Médecine', 'Consultant', 'Chef de Clinique', 'Spécialiste', 'Chirurgien']).values_list('id', flat=True)
    top_doctors = Doctor.objects.filter(grade__in=top_grades)
    doctors_data = [{
        'id': doctor.id,
        'names': f"{doctor.name} {doctor.firstName}",
        'speciality': doctor.specialite.design,
        'grade': doctor.grade.name,
        'image': doctor.image.url if doctor.image else None,
        'availability': doctor.availability,
    } for doctor in top_doctors]
    return JsonResponse(doctors_data, safe=False)

# Loginn
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    login_type = request.data.get('loginType')  # Récupérez le type de connexion

    if not email or not password or not login_type:
        return Response({'error': 'Email, mot de passe et type de connexion requis.'}, status=400)

    try:
        logger.debug(f"Requête reçue : email={email}, password={password}, login_type={login_type}")

        user = authenticate(username=email, password=password)
        logger.debug(f"Utilisateur authentifié: {user}")

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            try:
                if login_type == 'Patient' and Patient.objects.filter(user=user).exists():
                    patient = Patient.objects.get(user=user)
                    logger.debug(f"Patient associé: {patient}")
                    return Response({
                        'token': token.key,
                        'user': {
                            'name': patient.name,
                            'email': patient.email,
                            'address': patient.adresse,
                            'gender': patient.gender,
                            'dob': patient.dob,
                            'image': patient.image.url if patient.image else None,
                            'is_doctor': False
                        },
                        'message': 'Connexion réussie'
                    })
                elif login_type == 'Docteur' and Doctor.objects.filter(user=user).exists():
                    doctor = Doctor.objects.get(user=user)
                    logger.debug(f"Doctor associé: {doctor}")
                    return Response({
                        'token': token.key,
                        'user': {
                            'name': doctor.name,
                            'email': doctor.email,
                            'specialite': doctor.specialite.design if doctor.specialite else None,
                            'horaireDispo': doctor.horaireDispo,
                            'age': doctor.age,
                            'degree': doctor.degree,
                            'experience': doctor.experience,
                            'about': doctor.about,
                            'fees': doctor.fees,
                            'address': doctor.address,
                            'availability': doctor.availability,
                            'image': doctor.image.url if doctor.image else None,
                            'is_doctor': True
                        },
                        'message': 'Connexion réussie'
                    })
                else:
                    logger.error("Utilisateur non associé au type de connexion sélectionné.")
                    return Response({'error': 'Utilisateur non trouvé ou type de connexion incorrect.'}, status=400)
            except Exception as e:
                logger.error(f"Erreur lors de la récupération des informations utilisateur : {e}")
                return Response({'error': f"Erreur interne du serveur lors de la récupération des informations utilisateur : {e}"}, status=500)
        else:
            logger.error("Identifiants invalides.")
            return Response({'error': 'Identifiants invalides.'}, status=400)
    except Exception as e:
        logger.error(f"Erreur lors de l'authentification : {e}")
        return Response({'error': f"Erreur interne du serveur lors de l'authentification : {e}"}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')

    if User.objects.filter(username=email).exists():
        return Response({'error': 'L\'utilisateur existe déjà'}, status=400)

    if not email or not password or not name:
        return Response({'error': 'Champs requis manquants'}, status=400)

    try:
        user = User.objects.create_user(username=email, email=email, password=password)
        patient = Patient.objects.create(user=user, name=name, email=email, password=password)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'name': patient.name,
                'email': patient.email,
                'address': patient.adresse,
                'gender': patient.gender,
                'dob': patient.dob,
                'image': patient.image.url if patient.image else ''  # Include user image URL
            },
            'message': 'Compte créé avec succès'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    logger.debug(f"Utilisateur: {user}")
    logger.debug(f"Données reçues: {request.data}")
    
    try:
        patient = Patient.objects.get(user=user)
        logger.debug(f"Patient: {patient}")
        required_fields = ['name', 'firstName', 'cin', 'dob', 'gender', 'address', 'phone']
        
        for field in required_fields:
            if not request.data.get(field):
                logger.error(f"Le champ {field} est manquant.")
                return Response({'error': f'Le champ {field} est requis'}, status=400)

        # Assurez-vous que toutes les valeurs sont présentes
        patient.name = request.data.get('name', patient.name)
        patient.firstName = request.data.get('firstName', patient.firstName)
        patient.cin = request.data.get('cin', patient.cin)
        patient.dob = request.data.get('dob', patient.dob)
        patient.gender = request.data.get('gender', patient.gender)
        patient.adresse = request.data.get('address', patient.adresse)
        patient.phone = request.data.get('phone', patient.phone)
        patient.histoMedic = request.data.get('histoMedic', patient.histoMedic)

        if 'image' in request.FILES:
            logger.debug("Fichier image reçu.")
            patient.image = request.FILES['image']

        patient.save()
        logger.debug("Profil mis à jour avec succès.")
        return Response({'message': 'Profil mis à jour avec succès'})
    except Patient.DoesNotExist:
        logger.error("Patient non trouvé.")
        return Response({'error': 'Patient non trouvé'}, status=404)
    except Exception as e:
        logger.error(f"Erreur: {str(e)}")
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    try:
        patient = Patient.objects.get(user=user)
        return Response({
            'name': patient.name,
            'firstName': patient.firstName,
            'image': patient.image.url if patient.image else '',
            'email': patient.email,
            'cin': patient.cin,
            'dob': patient.dob,
            'gender': patient.gender,
            'address': patient.adresse,
            'histoMedic': patient.histoMedic,
            'phone': patient.phone,
        })
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)





# Vue d'index existante
def index(request):
    return render(request, 'index.html')
