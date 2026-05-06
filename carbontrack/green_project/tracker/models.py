from django.db import models

class UserCarbonTracker(models.Model):
    GENDER_CHOICES = [
        ('M', 'ذكر'),
        ('F', 'أنثى'),
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="الجنس")
    age = models.PositiveIntegerField(verbose_name="العمر") 
    city = models.CharField(max_length=100, verbose_name="المدينة")

    electricity_usage = models.FloatField(default=0.0, help_text="الاستهلاك بالكيلوواط ساعة (kWh)")
    transport_km = models.FloatField(default=0.0, help_text="المسافة المقطوعة بالكيلومتر")

    carbon_result = models.FloatField(null=True, blank=True, verbose_name="نتيجة الكربون")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الإنشاء")

    def save(self, *args, **kwargs):
     
        elec_factor = 0.5 
        transport_factor = 0.2  
        
        self.carbon_result = (self.electricity_usage * elec_factor) + (self.transport_km * transport_factor)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_gender_display()} - {self.city} - {self.carbon_result} kg"

    class Meta:
        verbose_name = "سجل تتبع الكربون"
        verbose_name_plural = "سجلات تتبع الكربون"
        ordering = ['-created_at']
