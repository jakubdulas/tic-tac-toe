from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('create-game/', views.create_game, name='create-game'),
    path('join-the-game/', views.join_the_game, name='join-the-game'),
    path('game/', views.game, name='game'),
    path('announce-winner/', views.announce_winner, name='announce-winner'),
    path('surrender/', views.surrender, name='surrender'),
    path('play-again/', views.play_again, name='play-again'),
]