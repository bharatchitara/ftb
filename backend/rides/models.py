from django.conf import settings
from django.db import models

class RideRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    ]
    rider = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='ride_requests', on_delete=models.CASCADE
    )
    driver = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='driver_requests', on_delete=models.CASCADE
    )
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)