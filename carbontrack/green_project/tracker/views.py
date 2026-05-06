from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserCarbonTrackerSerializer
from .models import UserCarbonTracker

@api_view(['POST'])
def save_data(request):
    serializer = UserCarbonTrackerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save() 
        return Response({"message": "تم الحفظ بنجاح!"}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_history(request, device_id):
    records = UserCarbonTracker.objects.filter(device_id=device_id).order_by('-id')
    serializer = UserCarbonTrackerSerializer(records, many=True)
    return Response(serializer.data)
