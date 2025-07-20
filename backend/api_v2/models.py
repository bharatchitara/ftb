from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
import hashlib, random, string
from userlogin.models import FTBUsers


class OneTimeCode(models.Model):
    user= models.ForeignKey(FTBUsers, on_delete=models.CASCADE)
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()

    @classmethod
    def generate_code(cls, user):
        raw  = ''.join(random.choices(string.digits, k=6))
        code_hash = hashlib.sha256(raw.encode()).hexdigest() 
        expiry = timezone.now() + timezone.timedelta(minutes=5)
        return cls.objects.create(user=user, code_hash=code_hash, expires_at=expiry), raw
