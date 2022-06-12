from rest_framework import serializers
from .models import Game
from django.contrib.auth import get_user_model

User = get_user_model()

class GameSerializer(serializers.ModelSerializer):
    score = serializers.CharField(read_only=True)
    class Meta:
        model = Game
        exclude = ['created']




class GameListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['creator', 'access_code']
    
    def to_representation(self, instance):
        return {
            "username": instance.creator.username,
            "access_code": instance.access_code
        }

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        account = User(
            username=self.validated_data['username'],
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password2': 'Passwords must match.'})

        account.set_password(password)
        account.save()
        return account