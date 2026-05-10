from django.contrib import admin
from django.urls import path
from tracker import views  
from tracker.views import save_data, get_history, get_stats

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/save/', views.save_data), 
    path('api/history/<str:device_id>/', views.get_history),
    path('api/save/',            save_data),
    path('api/history/<str:device_id>/', get_history),
    path('api/stats/',           get_stats),  
]