from django.contrib import admin
from .models import UserCarbonTracker
 
 
@admin.register(UserCarbonTracker)
class UserCarbonTrackerAdmin(admin.ModelAdmin):
    list_display  = ['id', 'gender', 'age', 'city', 'transport_type', 'diet_type',
                     'carbon_transport', 'carbon_food', 'carbon_energy',
                     'carbon_flights', 'carbon_water', 'carbon_shopping',
                     'carbon_result', 'created_at']
    list_filter   = ['gender', 'city', 'transport_type', 'diet_type',
                     'heating_type', 'waste_recycling', 'has_solar']
    search_fields = ['city', 'device_id']
    readonly_fields = ['carbon_transport', 'carbon_flights', 'carbon_food',
                       'carbon_energy', 'carbon_water', 'carbon_shopping', 'carbon_result']
    fieldsets = (
        ('بيانات الباحث', {'fields': ('device_id', 'gender', 'age', 'city', 'household_size', 'building_type')}),
        ('المواصلات', {'fields': ('transport_type', 'transport_km', 'driving_style', 'uses_carpool', 'carpool_persons')}),
        ('الطيران', {'fields': ('flights_short_hours', 'flights_medium_hours', 'flights_long_hours', 'flight_class')}),
        ('الغذاء', {'fields': ('diet_type', 'protein_type', 'protein_grams', 'food_waste_percent', 'local_food_percent')}),
        ('الطاقة', {'fields': ('electricity_usage', 'has_solar', 'solar_coverage_pct', 'heating_type', 'heating_usage', 'cooling_type', 'cooling_months')}),
        ('المياه', {'fields': ('water_usage_liters', 'water_source')}),
        ('المشتريات والنفايات', {'fields': ('clothes_spend', 'electronics_spend', 'furniture_spend', 'shopping_frequency', 'buys_secondhand_pct', 'waste_recycling')}),
        ('النتائج', {'fields': ('carbon_transport', 'carbon_flights', 'carbon_food', 'carbon_energy', 'carbon_water', 'carbon_shopping', 'carbon_result', 'created_at')}),
    )