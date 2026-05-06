from django.contrib import admin
from django.urls import path
from tracker import views  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/save/', views.save_data), 
    path('api/history/<str:device_id>/', views.get_history),
]