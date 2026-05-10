from rest_framework import serializers
from .models import UserCarbonTracker
 
 
class UserCarbonTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCarbonTracker
        fields = '__all__'
        read_only_fields = [
            'created_at',
            'carbon_transport',
            'carbon_flights',
            'carbon_food',
            'carbon_energy',
            'carbon_water',
            'carbon_shopping',
            'carbon_result',
        ]
        extra_kwargs = {
            'gender':         {'required': False, 'allow_null': True},
            'age':            {'required': False, 'allow_null': True},
            'city':           {'required': False, 'allow_null': True},
            'device_id':      {'required': False, 'allow_null': True},
            'household_size': {'required': False},
            'building_type':  {'required': False},
            'driving_style':  {'required': False},
            'uses_carpool':   {'required': False},
            'carpool_persons':{'required': False},
            'has_solar':      {'required': False},
            'solar_coverage_pct': {'required': False},
            'food_waste_percent': {'required': False},
            'local_food_percent': {'required': False},
            'water_usage_liters': {'required': False},
            'water_source':   {'required': False},
            'heating_type':   {'required': False},
            'heating_usage':  {'required': False},
            'cooling_type':   {'required': False},
            'cooling_months': {'required': False},
            'buys_secondhand_pct': {'required': False},
            'waste_recycling':     {'required': False},
            'shopping_frequency':  {'required': False},
            'diet_type':      {'required': False},
            'flights_short_hours':  {'required': False},
            'flights_medium_hours': {'required': False},
            'flights_long_hours':   {'required': False},
            'flight_class':   {'required': False},
        }
