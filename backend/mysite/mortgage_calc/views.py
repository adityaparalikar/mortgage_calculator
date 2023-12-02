from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from .models import Mortgage
from .serializers import MortgageSerializer
from django.http import JsonResponse
from decimal import Decimal    

# Create your views here.
class MortgageViewSet(viewsets.ModelViewSet):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

class MortgageCreateView(generics.CreateAPIView):
    queryset = Mortgage.objects.all()
    serializer_class = MortgageSerializer

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        response = super().create(request, *args, **kwargs)
        mortgage = response.data
        monthly_payment, amortization_schedule = self.calculate_monthly_payment(
            mortgage['loan_amount'],
            mortgage['down_payment'],
            mortgage['interest_rate'],
            mortgage['loan_term']
        )

        mortgage['monthly_payment'] = monthly_payment
        mortgage['amortization_schedule'] = amortization_schedule
        return JsonResponse({'message': 'Mortgage details saved successfully!', 'mortgage': mortgage})

    def calculate_monthly_payment(self, loan_amount, down_payment, interest_rate, loan_term):
        principal = Decimal(loan_amount) - Decimal(down_payment)
        monthly_interest_rate = (Decimal(interest_rate) / 100) / 12
        num_payments = Decimal(loan_term) * 12

        monthly_payment = (
            principal * monthly_interest_rate /
            (1 - (1 + monthly_interest_rate) ** -num_payments)
        )
        monthly_payment = round(monthly_payment, 2)
        
        amortization_schedule = []
        remaining_amount = principal

        for payment_number in range(1, int(num_payments) + 1):
            interest_payment = remaining_amount * monthly_interest_rate
            principal_payment = monthly_payment - interest_payment

            remaining_amount -= principal_payment

            amortization_schedule.append({
                'payment_number': payment_number,
                'principal': round(principal_payment, 2),
                'interest': round(interest_payment, 2),
                'total_payment': monthly_payment,
                'remaining_amount': round(remaining_amount, 2),
            })
        
        print("Monthly Payment:", monthly_payment)
        print("Amortization: ", amortization_schedule)
        return monthly_payment, amortization_schedule
