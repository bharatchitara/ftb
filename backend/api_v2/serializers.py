from rest_framework import serializers
from .models import FTBUsers

class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code  = serializers.CharField(max_length=6)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FTBUsers
        fields = [
            'name', 'email', 'phone', 'gender',
            'address', 'latitude', 'longitude',
            'rider_profile_completed'
        ]

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FTBUsers
        fields = [
            'name', 'email', 'phone', 'gender',
            'address', 'latitude', 'longitude',
            'driver_profile_completed',
            'vehicle_type', 'vehicle_number'
        ]
