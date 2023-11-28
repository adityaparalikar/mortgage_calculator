from django.db import models

# Create your models here.

class Mortgage(models.Model):
    
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    down_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    loan_term = models.IntegerField()
