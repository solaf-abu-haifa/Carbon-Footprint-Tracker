from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Count
from .serializers import UserCarbonTrackerSerializer
from .models import UserCarbonTracker
 
 
@api_view(['POST'])
def save_data(request):
    serializer = UserCarbonTrackerSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({
            "message": "تم الحفظ بنجاح!",
            "carbon_result":   instance.carbon_result,
            "carbon_transport": instance.carbon_transport,
            "carbon_flights":   instance.carbon_flights,
            "carbon_food":      instance.carbon_food,
            "carbon_energy":    instance.carbon_energy,
            "carbon_water":     instance.carbon_water,
            "carbon_shopping":  instance.carbon_shopping,
        }, status=201)
    return Response(serializer.errors, status=400)
 
 
@api_view(['GET'])
def get_history(request, device_id=None):
    try:
        records = UserCarbonTracker.objects.filter(device_id=device_id).order_by('-created_at')
        serializer = UserCarbonTrackerSerializer(records, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
 
 
@api_view(['GET'])
def get_stats(request):
    """إحصائيات مجمّعة للباحثين"""
    qs = UserCarbonTracker.objects.all()
    stats = qs.aggregate(
        avg_total=Avg('carbon_result'),
        avg_transport=Avg('carbon_transport'),
        avg_food=Avg('carbon_food'),
        avg_energy=Avg('carbon_energy'),
        avg_flights=Avg('carbon_flights'),
        avg_water=Avg('carbon_water'),
        avg_shopping=Avg('carbon_shopping'),
        count=Count('id'),
    )
    by_city = list(
        qs.values('city')
          .annotate(avg=Avg('carbon_result'), count=Count('id'))
          .order_by('-avg')[:20]
    )
    by_gender = list(
        qs.values('gender')
          .annotate(avg=Avg('carbon_result'), count=Count('id'))
    )
    return Response({
        "overall": stats,
        "by_city": by_city,
        "by_gender": by_gender,
    })
 