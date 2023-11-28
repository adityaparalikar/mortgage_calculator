from rest_framework import serializers
from .models import Mortgage

class MortgageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mortgage
        fields = ['id', 'loan_amount', 'down_payment', 'interest_rate', 'loan_term']
