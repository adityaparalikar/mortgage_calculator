from django.urls import path
from .views import MortgageCreateView

urlpatterns = [
    path('api/mortgage/', MortgageCreateView.as_view(), name='mortgage-create'),
]
