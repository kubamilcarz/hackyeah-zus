from django.urls import path
from . import views

urlpatterns = [
    path('pension', views.pension, name='pension-calc'),
    path('fact', views.fact, name='pension-fact'),
]
