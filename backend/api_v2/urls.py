from django.urls import path
from .views import OTPRequestView, OTPVerifyView, MeView, ProfileView, DriverProfileView

urlpatterns = [
    path("auth/otp/request/", OTPRequestView.as_view()),
    path("auth/otp/verify/",  OTPVerifyView.as_view()),
    path("auth/me/", MeView.as_view()),
    path("auth/profile/",ProfileView.as_view()),
    path("auth/driver_profile/", DriverProfileView.as_view()),
]
