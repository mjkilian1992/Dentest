from django.contrib import admin
from models import *
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


# Register your models here.
admin.site.register(EmailConfirmation)
admin.site.register(EmailAddress)
admin.site.register(PasswordReset)

#============================ Make extended user profile visible in admin ============================================/
class ProfileInline(admin.StackedInline):
    model = Profile

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (ProfileInline, )

admin.site.unregister(User)
admin.site.register(User, UserAdmin)