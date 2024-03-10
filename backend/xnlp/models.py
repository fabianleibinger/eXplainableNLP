from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.db import models
from djongo import models as djongo_models

# Create your models here. We will use models to pull out data from database and present them to the user

class User(AbstractUser):
    db_table = 'User'
    managed = True
    USER_ROLE = [('analyst', 'NLP-Analyst'), ('explorer', 'NLP-Explorer')]
    _id = djongo_models.ObjectIdField(primary_key=True, editable=False)
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[MinLengthValidator(5)], 
    )
    email = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(5)], 
    )
    password = models.CharField(
        max_length=128,
        validators=[MinLengthValidator(7)],  
    )
    first_name = models.CharField(
        max_length=128,
        validators=[MinLengthValidator(3)],  
    )
    last_name = models.CharField(
        max_length=128,
        validators=[MinLengthValidator(3)],  
    )
    role = models.CharField(
        max_length=10,
        choices=USER_ROLE,
        default='explorer',
    )
    date_joined = models.DateTimeField(auto_now_add=True)


class Expectations(models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True, editable=False)
    user = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    goal_Expect = models.CharField(max_length=255)
    method_Expect = models.CharField(max_length=255)
    other_Expect = models.CharField(max_length=255)
    task_Expect = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, null=False, blank=False)

class Feedback(models.Model):
    _id = djongo_models.ObjectIdField(primary_key=True, editable=False)
    user = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    inputString = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    
    prediction = models.JSONField(null=True, blank=True)
    shapValues = models.TextField(null=True, blank=True)
    shapFeatures = models.TextField(null=True, blank=True) 
    shapHTMLPlot = models.TextField(null=True, blank=True)
    perturbations = models.TextField(null=True, blank=True)
    perturbationsPrediction = models.TextField(null=True, blank=True)
    perturbationsCtrlCodes = models.TextField(null=True, blank=True)
    limeExplanation = models.TextField(null=True, blank=True)
    
    classifiedCorrectly = models.BooleanField(default=True)

    rating = models.IntegerField(
        choices=[
            (1, '1'),
            (2, '2'),
            (3, '3'),
            (4, '4'),
            (5, '5'),
        ]
    )
    
    comment = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
