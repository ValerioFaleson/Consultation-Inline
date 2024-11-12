from django.db import models
from django.contrib.auth.models import User
from datetime import date
# Speciality
class Speciality(models.Model):
    image = models.ImageField(upload_to='speciality/', null=True, blank=True)
    design = models.CharField(max_length=50)

    def __str__(self):
        return self.design
# Grade
class Grade(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# Doctor
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='doctors/', null=True, blank=True)
    cin = models.CharField(max_length=12)
    name = models.CharField(max_length=50)
    firstName = models.CharField(max_length=100)
    specialite = models.ForeignKey(Speciality, on_delete=models.CASCADE)
    horaireDispo = models.IntegerField(default=0)
    age = models.IntegerField()
    degree = models.CharField(max_length=50, null=True, blank=True)
    experience = models.IntegerField()
    about = models.TextField(null=True, blank=True)
    fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)  # Combinaison de address_line1 et address_line2
    availability = models.BooleanField(default=True)  # Champ pour la disponibilité
    email = models.EmailField(max_length=254, unique=True, default='default@example.com') # champ email
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True, blank=True)  # Champ pour le grade comme clé étrangère

    def __str__(self):
        return f"{self.name} {self.firstName}"

# Patiens
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='patients/', null=True, blank=True)  # Champ d'image optionnel
    cin = models.CharField(max_length=12, default='')
    name = models.CharField(max_length=50)
    firstName = models.CharField(max_length=100 , default='')
    email = models.EmailField(max_length=254, unique=True, default='default@example.com')  # Champ email avec valeur par défaut
    password = models.CharField(max_length=128, default='defaultpassword')
    dob = models.DateField(default=date(2000, 1, 1))
    gender = models.CharField(max_length=30, default='Non spécifié')
    adresse = models.CharField(max_length=50, default='')
    phone = models.CharField(max_length=15, default='')  # Champ de numéro de téléphone
    histoMedic = models.TextField(default='')  # Historique médical

    def __str__(self):
        return self.name
    
    
# Roles
class Role(models.Model):
    design = models.CharField(max_length=50)

    def __str__(self):
        return self.design
    
# City
class City(models.Model):
    name = models.CharField(max_length=50)
    cp = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
# Categories
class Categories(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
# types
class Types(models.Model):
    design = models.CharField(max_length=50)

    def __str__(self):
        return self.design

# Rendez-vous
class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    heure = models.TimeField()
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('confirmé', 'Confirmé'), ('annulé', 'Annulé'), ('en attente', 'En attente')], default='en attente')
    duration = models.DurationField(default='00:30:00')  # Par exemple, 30 minutes par défaut
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Champ pour le prix

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.doctor.fees  # Définir le prix basé sur le champ fees du docteur
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Rendez-vous de {self.patient} avec {self.doctor} le {self.date} à {self.heure}"


# Modèle pour le message échangé dans le chat
class Message(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)  # Relation avec le modèle Patient
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)  # Relation avec le modèle Médecin
    contenu = models.TextField()  # Contenu du message
    timestamp = models.DateTimeField(auto_now_add=True)  # Date et heure d'envoi

    def __str__(self):
        return f"Message de {self.patient.nom} à {self.doctor.nom} à {self.timestamp}: {self.contenu[:20]}..."
    
# Modèle pour représenter un symptôme
class Symptom(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()  

    def __str__(self):
        return self.nom  