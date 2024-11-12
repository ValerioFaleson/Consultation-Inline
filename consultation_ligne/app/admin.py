from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
# Register your models here.
from .models import Doctor , Patient
from .models import Speciality
from .models import Role , City
from .models import Categories , Types
from .models import Appointment
from .models import Message
from .models import Symptom
from .models import Grade

class DoctorAdmin(admin.ModelAdmin):
    list_display = ('cin', 'name', 'firstName', 'specialite', 'availability', 'horaireDispo')
    search_fields = ['name']

    def save_model(self, request, obj, form, change):
        if not obj.user:
            user = User.objects.create_user(username=obj.email, email=obj.email, password='doctor')
            user.is_active = True
            user.save()
            obj.user = user
        super().save_model(request, obj, form, change)

class PatientAdmin(admin.ModelAdmin):
    list_display = ('cin', 'name', 'firstName', 'adresse', 'histoMedic')
    search_fields = ['name']

class SpecialityAdmin(admin.ModelAdmin):
    # list_display = ('design')
    search_fields = ['design']

class GradeAdmin(admin.ModelAdmin):
    search_fields = ['name']

class RoleAdmin(admin.ModelAdmin):
    search_fields = ['design']

class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'cp')
    search_fields = ['name']

class CategoriesAdmin(admin.ModelAdmin):
    search_fields = ['name']

class TypesAdmin(admin.ModelAdmin):
    search_fields = ['name']

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'date', 'heure')
    search_fields = ['name','heure']

class MessageAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'contenu', 'timestamp')
    search_fields = ['patient','doctor']

class SymptomAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ['name']

admin.site.register(Speciality, SpecialityAdmin)
admin.site.register(Grade, GradeAdmin)
admin.site.register(Doctor, DoctorAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Types, TypesAdmin)
admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Symptom, SymptomAdmin)

