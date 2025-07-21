from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import hashlib, random, string

from .models import OneTimeCode
from userlogin.models import FTBUsers
from .serializers import OTPRequestSerializer, OTPVerifySerializer



class OTPRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OTPRequestSerializer

    def post(self, request):
        data = self.get_serializer(data=request.data)
        data.is_valid(raise_exception=True)
        email = data.validated_data["email"]
        
        try:
            auth_user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email, 'password': ''}
            )
        except Exception as e:
            print(f"Error creating or getting user: {e}")
            auth_user = None

        user, _ = FTBUsers.objects.get_or_create(email=email, defaults={"email": email, "profile_completed": False, "user": auth_user})
        otp_obj, raw_code = OneTimeCode.generate_code(user)

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
        code  = data.validated_data["code"]

        try:
            user = FTBUsers.objects.get(email=email)
            otp   = OneTimeCode.objects.filter(user=user).latest("created_at")
        except Exception as e :
            return Response({"detail": "Invalid"}, status=status.HTTP_400_BAD_REQUEST)

        expected_hash = hashlib.sha256(code.encode()).hexdigest()
        
        if expected_hash != otp.code_hash or timezone.now() > otp.expires_at:
            return Response({"detail": "Invalid or expired"}, status=status.HTTP_400_BAD_REQUEST)


        refresh = RefreshToken.for_user(FTBUsers)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            ftb_user = FTBUsers.objects.get(user=request.user)
            return Response({
                "email": ftb_user.email,
                "profile_completed": ftb_user.profile_completed
            })
        except FTBUsers.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = FTBUsers.objects.get(user=request.user)
            serializer = FTBUserSerializer(profile)
            return Response(serializer.data)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

    def put(self, request):
        try:
            profile = FTBUsers.objects.get(user=request.user)
            serializer = FTBUserSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(profile_completed=True)  
                # Mark profile as completed
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except FTBUsers.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

