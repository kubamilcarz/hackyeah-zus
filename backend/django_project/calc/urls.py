from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='calc-index'),
    path('signup', views.signup, name='signup'),
    path('pension', views.pension, name='pension-calc'),
    path('fact', views.fact, name='pension-fact'),
]
