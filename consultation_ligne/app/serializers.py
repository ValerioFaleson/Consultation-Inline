from datetime import date
from rest_framework import serializers
from .models import Doctor, Speciality, Grade, Appointment, Patient

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id', 'name', 'firstName', 'dob', 'age','image']

    def get_age(self, obj):
        today = date.today()
        return today.year - obj.dob.year - ((today.month, today.day) < (obj.dob.month, obj.dob.day))

class DoctorSerializer(serializers.ModelSerializer):
    specialite_id = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all(), source='specialite', write_only=True)
    specialite = serializers.ReadOnlyField(source='specialite.design')
    grade_id = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all(), source='grade', write_only=True)
    grade = serializers.ReadOnlyField(source='grade.name')
    image = serializers.ImageField(required=False)  # Ajoutez ceci pour gérer le champ de l'image

    class Meta:
        model = Doctor
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())  # Utiliser l'ID du docteur pour l'écriture
    doctor_details = DoctorSerializer(source='doctor', read_only=True)  # Utiliser DoctorSerializer pour la lecture

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'patient_details', 'doctor', 'doctor_details', 'date', 'heure', 'description', 'status', 'duration','price']

    def create(self, validated_data):
        print(f"Validated data: {validated_data}")  # Journaliser les données validées
        return super().create(validated_data)

class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'
