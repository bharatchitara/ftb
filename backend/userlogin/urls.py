'''
urls file for the userlogin page
this page contains the link of application startup aka landing page
'''

from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("api/hello/", views.ProtectedView.as_view()),
]


