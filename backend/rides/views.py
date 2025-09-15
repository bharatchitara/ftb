from rest_framework import viewsets, permissions
from .models import RideRequest
from .serializers import RideRequestSerializer

from utils.emailhandler import send_email
from travel_buddy_backend.settings import DEFAULT_FROM_EMAIL 

class RideRequestViewSet(viewsets.ModelViewSet):
    queryset = RideRequest.objects.all()
    serializer_class = RideRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(rider=self.request.user)

        ## send email to driver when ride request is created

        driver_email = ride_request.driver.email
        rider_name = self.request.user.name or self.request.user.email
        
        subject='FTB- New Ride Request'
        message = """
            You have a new ride request from {rider_name}.
            <br> Here are the details:
            <br> Pickup latitude: {ride_request.pickup_lat}, Pickup longitude: {ride_request.pickup_lng}
        """

        from_email = DEFAULT_FROM_EMAIL
        to_email = [driver_email]

        email_send_flag = send_email(message, subject, from_email, to_email)
        

    def get_queryset(self):
        user = self.request.user
        if user.user_role == 'rider':
            return RideRequest.objects.filter(rider=user)
        elif user.user_role == 'driver':
            return RideRequest.objects.filter(driver=user)
        return RideRequest.objects.none()