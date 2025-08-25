from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import hashlib

from .models import OneTimeCode
from userlogin.models import FTBUsers
from .serializers import OTPRequestSerializer, OTPVerifySerializer, ProfileSerializer, DriverProfileSerializer , DriverLocationSerializer, RiderLocationSerializer


class OTPRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OTPRequestSerializer

    def post(self, request):
        data = self.get_serializer(data=request.data)
        data.is_valid(raise_exception=True)
        email = data.validated_data["email"]

        ftb_user, _ = FTBUsers.objects.get_or_create(
            email=email,
            defaults={"email": email, "driver_profile_completed": False, "rider_profile_completed": False}
        )

        otp_obj, raw_code = OneTimeCode.generate_code(ftb_user)

        send_mail(
            subject="Your login code",
            message=f"Your Find Travel Buddy login code is {raw_code}",
            from_email=None,
            recipient_list=[email],
        )
        return Response({"detail": "OTP sent"}, status=status.HTTP_200_OK)


class OTPVerifyView(generics.GenericAPIView):
    serializer_class = OTPVerifySerializer

    def post(self, request):
        data = self.get_serializer(data=request.data)
        data.is_valid(raise_exception=True)
        email = data.validated_data["email"]
        code = data.validated_data["code"]
        role = request.data.get("role") 

        try:
            user = FTBUsers.objects.get(email=email)
            otp = OneTimeCode.objects.filter(user=user).latest("created_at")
        except Exception:
            return Response({"detail": "Invalid"}, status=status.HTTP_400_BAD_REQUEST)

        expected_hash = hashlib.sha256(code.encode()).hexdigest()

        if expected_hash != otp.code_hash or timezone.now() > otp.expires_at:
            return Response({"detail": "Invalid or expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Set role
        if role == "driver":
            user.is_driver = True
        else:
            user.is_rider = True
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            ftb_user = FTBUsers.objects.get(email=request.user.email)
            return Response({
                "email": ftb_user.email,
                "driver_profile_completed": ftb_user.driver_profile_completed,
                "is_driver":ftb_user.is_driver ,
                "rider_profile_completed": ftb_user.rider_profile_completed,
                "is_rider":ftb_user.is_rider ,
                "latitude" : ftb_user.latitude,
                "longitude":  ftb_user.longitude,
            })
        except FTBUsers.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)


## class for rider profile 
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = FTBUsers.objects.get(email=request.user.email)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

    def put(self, request):
        try:
            profile = FTBUsers.objects.get(email=request.user.email)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(rider_profile_completed=True)
                return Response(serializer.data)

            if ('Ensure this field has no more than 10 characters.' in str(serializer.errors['phone'][0]) ):
                return Response("Phone number have more then 10 digits", status=400)
            else:
                return Response("Failed to update profile. Please check your inputs and try again.", status=400)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Rider Profile not found'}, status=404)


## class for driver profile
class DriverProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self , request):
        try:
            profile = FTBUsers.objects.get(email=request.user.email)
            serializer = DriverProfileSerializer(profile)
            return Response(serializer.data)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Driver Profile not found'}, status=404)


    def put(self, request):
        try:
            profile = FTBUsers.objects.get(email=request.user.email)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(driver_profile_completed=True)
                return Response(serializer.data)

            if ('Ensure this field has no more than 10 characters.' in str(serializer.errors['phone'][0]) ):
                return Response("Phone number have more then 10 digits", status=400)
            else:
                return Response("Failed to update profile. Please check your inputs and try again.", status=400)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Rider Profile not found'}, status=404)



class DriverLocationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        drivers = FTBUsers.objects.filter(
            is_driver=True,
            driver_profile_completed=True,
            latitude__isnull=False,
            longitude__isnull=False
        )
        serializer = DriverLocationSerializer(drivers, many=True)
        return Response(serializer.data)



class RiderLocationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        riders = FTBUsers.objects.filter(
            is_rider=True,
            rider_profile_completed=True,
            latitude__isnull=False,
            longitude__isnull=False
        )
        serializer = RiderLocationSerializer(riders, many=True)
        return Response(serializer.data)
