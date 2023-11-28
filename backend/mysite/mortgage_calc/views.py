from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from .models import Mortgage
from .serializers import MortgageSerializer
from django.http import JsonResponse

# Create your views here.

class MortgageViewSet(viewsets.ModelViewSet):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

class MortgageCreateView(generics.CreateAPIView):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        mortgage = response.data
        monthly_payment = self.calculate_monthly_payment(
            mortgage['loan_amount'],
            mortgage['down_payment'],
            mortgage['interest_rate'],
            mortgage['loan_term']
        )
        mortgage['monthly_payment'] = monthly_payment
        return JsonResponse({'message': 'Mortgage details saved successfully!', 'mortgage': mortgage})

    def calculate_monthly_payment(self, loan_amount, down_payment, interest_rate, loan_term):
        principal = loan_amount - down_payment
        monthly_interest_rate = (interest_rate / 100) / 12
        num_payments = loan_term * 12

        monthly_payment = (
            principal * monthly_interest_rate /
            (1 - (1 + monthly_interest_rate) ** -num_payments)
        )
        return round(monthly_payment, 2)
