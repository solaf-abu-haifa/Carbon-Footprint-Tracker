from rest_framework import serializers
from .models import UserCarbonTracker

class UserCarbonTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCarbonTracker
        fields = '__all__'
        read_only_fields = ['created_at']