from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db import models

# Create your models here.

class FTBUsers(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    phone = models.IntegerField(max_length=10, blank=False, null=False)
    is_super_user = models.BooleanField(default=0,blank= True, null=True)
    is_user_verified = models.BooleanField(default=0,blank= True, null=True)
    is_buddy = models.BooleanField(default=0,blank= True, null=True)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField( auto_now=True)

    def __str__(self):
        return str(self.name)

    def __unicode__(self):
        return "%s" % self.name

