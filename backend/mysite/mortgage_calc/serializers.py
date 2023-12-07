from rest_framework import serializers
from .models import Mortgage

class MortgageSerializer(serializers.ModelSerializer):
    
    interest_rate = serializers.DecimalField(max_digits=6, decimal_places=4)
    
    class Meta:
        model = Mortgage
        fields = ['id', 'loan_amount', 'down_payment', 'interest_rate', 'loan_term']
