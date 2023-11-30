from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from .models import Mortgage
from .serializers import MortgageSerializer
from django.http import JsonResponse
from decimal import Decimal    

# Create your views here.
print("Inside views.py")

class MortgageViewSet(viewsets.ModelViewSet):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

class MortgageCreateView(generics.CreateAPIView):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

    def create(self, request, *args, **kwargs):
        print("Inside create method")
        print("Request data:", request.data)
        response = super().create(request, *args, **kwargs)
        mortgage = response.data
        monthly_payment = self.calculate_monthly_payment(
            mortgage['loan_amount'],
            mortgage['down_payment'],
            mortgage['interest_rate'],
            mortgage['loan_term']
        )
        
        print("Monthly Payment:", monthly_payment)
        mortgage['monthly_payment'] = monthly_payment
        return JsonResponse({'message': 'Mortgage details saved successfully!', 'mortgage': mortgage})

    def calculate_monthly_payment(self, loan_amount, down_payment, interest_rate, loan_term):
        principal = Decimal(loan_amount) - Decimal(down_payment)
        monthly_interest_rate = (Decimal(interest_rate) / 100) / 12
        num_payments = Decimal(loan_term) * 12

        monthly_payment = (
            principal * monthly_interest_rate /
            (1 - (1 + monthly_interest_rate) ** -num_payments)
        )
        
        print("Monthly Payment:", monthly_payment)
        return round(monthly_payment, 2)
