from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import RideRequest
from .serializers import RideRequestSerializer

from utils.emailhandler import send_email
from travel_buddy_backend.settings import DEFAULT_FROM_EMAIL 

class RideRequestViewSet(viewsets.ModelViewSet):
    queryset = RideRequest.objects.all()
    serializer_class = RideRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ride_request = serializer.save(rider=self.request.user)

        ## send email to driver when ride request is created

        driver_email = ride_request.driver.email
        rider_name = self.request.user.name or self.request.user.email
        
        subject='FTB- New Ride Request'
        message = f"""
        Hi Buddy,

        You have a new ride request from Rider- {rider_name}.
        Here are the details:
        Pickup latitude: {ride_request.pickup_lat}, Pickup longitude: {ride_request.pickup_lng}
        
        --
        Thanks
        Find Travel Buddy Team
        """

        from_email = DEFAULT_FROM_EMAIL
        to_email = [driver_email]

        email_send_flag = send_email(message, subject, from_email, to_email)
        

    def get_queryset(self):
        user = self.request.user
        role = self.request.query_params.get('role')
        if role == 'rider':
            # if rider, we wil send 0 
            der_role = 0 
            return RideRequest.objects.filter(rider=user).filter(~Q(status='accepted')), der_role
        elif role == 'driver':
            # if driver, we wil send 1
            der_role = 1
            return RideRequest.objects.filter(driver=user).filter(~Q(status='accepted')), der_role
        return RideRequest.objects.none()


    def list(self, request, *args, **kwargs):
        queryset, role  = self.get_queryset()
        result = []
        if (role == 0 ):
            ## for the rider view
            for req in queryset:
                result.append({
                    'id': req.id,
                    'status': req.status,
                    'driver_name': str(req.driver.name),
                    'driver_email': str(req.driver.email),
                    'driver_phone': str(req.driver.phone),
                    'pickup_lat': req.pickup_lat,
                    'pickup_lng': req.pickup_lng,
                    'created_at': req.created_at,
                })
            return Response(result)
        
        elif (role == 1 ):
            ## for the driver view
            for req in queryset:
                result.append({
                    'id': req.id,
                    'status': req.status,
                    'rider_name': str(req.rider.name),
                    'rider_email': str(req.rider.email),
                    'rider_phone': str(req.rider.phone),
                    'pickup_lat': req.pickup_lat,
                    'pickup_lng': req.pickup_lng,
                    'created_at': req.created_at,
                })
            return Response(result)


    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        ride_request = RideRequest.objects.get(id = pk)
        ride_request.status = 'accepted'
        ride_request.save()
        return Response({'status': 'accepted'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        ride_request = RideRequest.objects.get(id = pk)
        ride_request.status = 'rejected'
        ride_request.save()
        return Response({'status': 'rejected'})