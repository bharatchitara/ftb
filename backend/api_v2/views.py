from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import hashlib, random, string

from .models import OneTimeCode
from .serializers import OTPRequestSerializer, OTPVerifySerializer

User = get_user_model()

class OTPRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OTPRequestSerializer

    def post(self, request):
        data = self.get_serializer(data=request.data)
        data.is_valid(raise_exception=True)
        email = data.validated_data["email"]

        user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
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
            user = User.objects.get(email=email)
            otp   = OneTimeCode.objects.filter(user=user).latest("created_at")
        except (User.DoesNotExist, OneTimeCode.DoesNotExist):
            return Response({"detail": "Invalid"}, status=status.HTTP_400_BAD_REQUEST)

        expected_hash = hashlib.sha256(code.encode()).hexdigest()
        
        if expected_hash != otp.code_hash or timezone.now() > otp.expires_at:
            return Response({"detail": "Invalid or expired"}, status=status.HTTP_400_BAD_REQUEST)


        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"email": request.user.email})