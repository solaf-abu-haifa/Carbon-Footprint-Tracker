from django.db import models


class UserCarbonTracker(models.Model):
    GENDER_CHOICES = [('M', 'ذكر'), ('F', 'أنثى')]

    TRANSPORT_CHOICES = [
        ('petrol_small',   'سيارة بنزين صغيرة (≤1.4L)'),
        ('petrol_medium',  'سيارة بنزين متوسطة (1.5–2.0L)'),
        ('petrol_large',   'سيارة بنزين كبيرة (>2.0L / SUV)'),
        ('diesel_car',     'سيارة ديزل'),
        ('hybrid_car',     'سيارة هجينة (Hybrid)'),
        ('ev_car',         'سيارة كهربائية'),
        ('motorcycle',     'دراجة نارية'),
        ('bus_public',     'باص عام / حافلة'),
        ('minibus',        'سرفيس / ميني باص'),
        ('taxi',           'تاكسي'),
        ('bicycle',        'دراجة هوائية'),
        ('walking',        'مشي'),
    ]

    PROTEIN_CHOICES = [
        ('beef',           'لحم بقر'),
        ('lamb',           'لحم خروف / ماعز'),
        ('pork',           'لحم خنزير'),
        ('poultry',        'دواجن (دجاج / ديك رومي)'),
        ('fish_farmed',    'أسماك مزروعة'),
        ('fish_wild',      'أسماك برية'),
        ('seafood',        'مأكولات بحرية أخرى'),
        ('eggs',           'بيض'),
        ('dairy',          'منتجات ألبان'),
        ('legumes',        'بقوليات (عدس / حمص / فول)'),
        ('tofu_tempeh',    'توفو / تمبيه'),
        ('nuts',           'مكسرات'),
    ]

    HEATING_CHOICES = [
        ('none',           'لا يوجد تدفئة'),
        ('electric',       'تدفئة كهربائية'),
        ('natural_gas',    'غاز طبيعي'),
        ('lpg',            'غاز بوتاجاز (LPG)'),
        ('diesel_heater',  'مازوت / سولار'),
        ('wood',           'حطب'),
        ('district',       'تدفئة مركزية مشتركة'),
    ]

    COOLING_CHOICES = [
        ('none',           'لا يوجد تبريد'),
        ('ac_inverter',    'مكيف إنفرتر'),
        ('ac_standard',    'مكيف عادي'),
        ('fan_only',       'مراوح فقط'),
        ('evaporative',    'مبرد تبخيري (كولر)'),
    ]

    DIET_TYPE_CHOICES = [
        ('omnivore',       'آكل كل شيء'),
        ('low_meat',       'قليل اللحوم'),
        ('pescatarian',    'نباتي مع أسماك'),
        ('vegetarian',     'نباتي'),
        ('vegan',          'نباتي صارم (Vegan)'),
    ]

    BUILDING_CHOICES = [
        ('apartment_small',  'شقة صغيرة (< 80 م²)'),
        ('apartment_medium', 'شقة متوسطة (80–150 م²)'),
        ('apartment_large',  'شقة كبيرة (> 150 م²)'),
        ('house_small',      'بيت مستقل صغير'),
        ('house_large',      'بيت مستقل كبير / فيلا'),
    ]

    WATER_SOURCE_CHOICES = [
        ('city_network',   'شبكة المياه البلدية'),
        ('well_pump',      'بئر + مضخة'),
        ('tanker',         'صهريج'),
        ('mixed',          'مختلط'),
    ]

    SHOPPING_FREQ_CHOICES = [
        ('rarely',         'نادراً (< مرة/شهر)'),
        ('monthly',        'شهرياً'),
        ('weekly',         'أسبوعياً'),
        ('daily',          'يومياً تقريباً'),
    ]

    WASTE_CHOICES = [
        ('none',           'لا أفصل أو أعيد تدوير'),
        ('some',           'أفصل بعض المواد'),
        ('most',           'أفصل معظم المواد'),
        ('full',           'فصل كامل + كمبوست'),
    ]

    device_id    = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    gender       = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    age          = models.PositiveIntegerField(null=True, blank=True)
    city         = models.CharField(max_length=100, null=True, blank=True)
    household_size = models.PositiveIntegerField(default=1, help_text="عدد أفراد الأسرة")
    building_type  = models.CharField(max_length=30, choices=BUILDING_CHOICES, default='apartment_medium')

    transport_type      = models.CharField(max_length=25, choices=TRANSPORT_CHOICES, default='petrol_medium')
    transport_km        = models.FloatField(default=0.0, help_text="كم/يوم")
    driving_style       = models.CharField(max_length=10, choices=[('city','مدينة'),('highway','طريق سريع'),('mixed','مختلط')], default='mixed')
    uses_carpool        = models.BooleanField(default=False, help_text="هل تشارك السيارة مع آخرين؟")
    carpool_persons     = models.PositiveIntegerField(default=1)

    flights_short_hours  = models.FloatField(default=0.0, help_text="ساعات رحلات قصيرة (<3 ساعات) سنوياً")
    flights_medium_hours = models.FloatField(default=0.0, help_text="ساعات رحلات متوسطة (3–6 ساعات) سنوياً")
    flights_long_hours   = models.FloatField(default=0.0, help_text="ساعات رحلات طويلة (>6 ساعات) سنوياً")
    flight_class         = models.CharField(max_length=10, choices=[('economy','اقتصادي'),('business','أعمال'),('first','أول')], default='economy')

    diet_type           = models.CharField(max_length=20, choices=DIET_TYPE_CHOICES, default='omnivore')
    protein_type        = models.CharField(max_length=20, choices=PROTEIN_CHOICES, default='poultry')
    protein_grams       = models.FloatField(default=0.0, help_text="غرام/يوم")
    food_waste_percent  = models.FloatField(default=20.0, help_text="نسبة هدر الطعام %")
    local_food_percent  = models.FloatField(default=50.0, help_text="نسبة الغذاء المحلي/الموسمي %")

    electricity_usage   = models.FloatField(default=0.0, help_text="kWh/شهر")
    has_solar           = models.BooleanField(default=False)
    solar_coverage_pct  = models.FloatField(default=0.0, help_text="نسبة تغطية الطاقة الشمسية %")
    heating_type        = models.CharField(max_length=20, choices=HEATING_CHOICES, default='none')
    heating_usage       = models.FloatField(default=0.0, help_text="كغ غاز أو لتر مازوت أو kWh/شهر")
    cooling_type        = models.CharField(max_length=20, choices=COOLING_CHOICES, default='none')
    cooling_months      = models.PositiveIntegerField(default=3, help_text="عدد أشهر التبريد في السنة")

    water_usage_liters  = models.FloatField(default=0.0, help_text="لتر/يوم للفرد")
    water_source        = models.CharField(max_length=20, choices=WATER_SOURCE_CHOICES, default='city_network')

    clothes_spend       = models.FloatField(default=0.0, help_text="دينار/شهر")
    electronics_spend   = models.FloatField(default=0.0, help_text="دينار/شهر")
    furniture_spend     = models.FloatField(default=0.0, help_text="دينار/شهر")
    shopping_frequency  = models.CharField(max_length=10, choices=SHOPPING_FREQ_CHOICES, default='monthly')
    buys_secondhand_pct = models.FloatField(default=0.0, help_text="نسبة المشتريات المستعملة %")
    waste_recycling     = models.CharField(max_length=10, choices=WASTE_CHOICES, default='none')

    carbon_transport    = models.FloatField(null=True, blank=True)
    carbon_flights      = models.FloatField(null=True, blank=True)
    carbon_food         = models.FloatField(null=True, blank=True)
    carbon_energy       = models.FloatField(null=True, blank=True)
    carbon_water        = models.FloatField(null=True, blank=True)
    carbon_shopping     = models.FloatField(null=True, blank=True)
    carbon_result       = models.FloatField(null=True, blank=True, help_text="كغم CO₂ / يوم")

    created_at = models.DateTimeField(auto_now_add=True)


    TRANSPORT_FACTORS = {
        # كغم CO₂ لكل كم
        'petrol_small':   0.142,
        'petrol_medium':  0.170,
        'petrol_large':   0.215,
        'diesel_car':     0.155,
        'hybrid_car':     0.105,
        'ev_car':         0.047,   # شبكة كهرباء أردنية (~0.588 kgCO₂/kWh × 0.080 kWh/km)
        'motorcycle':     0.103,
        'bus_public':     0.089,
        'minibus':        0.105,
        'taxi':           0.170,
        'bicycle':        0.0,
        'walking':        0.0,
    }

    DRIVING_STYLE_MULTIPLIER = {
        'city':     1.25,   # stop-and-go أسوأ بـ 25%
        'highway':  0.88,
        'mixed':    1.00,
    }

    PROTEIN_FACTORS = {
        # كغم CO₂ لكل كغم غذاء (IPCC / Our World in Data 2023)
        'beef':        27.0,
        'lamb':        39.2,
        'pork':        12.1,
        'poultry':      6.9,
        'fish_farmed':  5.1,
        'fish_wild':    3.0,
        'seafood':      6.1,
        'eggs':         4.5,
        'dairy':        3.2,
        'legumes':      0.9,
        'tofu_tempeh':  2.0,
        'nuts':         2.3,
    }

    DIET_BASE_FACTORS = {
        # كغم CO₂ يومي إضافي لنوع النظام الغذائي العام
        'omnivore':   0.0,
        'low_meat':  -0.5,
        'pescatarian': -0.9,
        'vegetarian': -1.2,
        'vegan':      -1.5,
    }

    HEATING_FACTORS = {
        # كغم CO₂ لكل وحدة (كغ غاز أو لتر أو kWh)
        'none':          0.0,
        'electric':      0.588,   # kWh → شبكة أردن
        'natural_gas':   2.04,    # كغ/كغ
        'lpg':           2.98,    # كغ/كغ
        'diesel_heater': 2.68,    # كغ/لتر
        'wood':          0.39,    # كغ/كغ (biomass partial credit)
        'district':      0.30,    # kWh
    }

    ELECTRICITY_FACTOR = 0.588   # kgCO₂/kWh — شبكة كهرباء الأردن 2023

    WATER_FACTORS = {
        # كغم CO₂ لكل م³ (ضخ + معالجة)
        'city_network': 0.708,
        'well_pump':    0.500,
        'tanker':       1.200,
        'mixed':        0.850,
    }

    RECYCLING_REDUCTION = {
        'none':  0.0,
        'some':  0.10,
        'most':  0.20,
        'full':  0.35,
    }

    FLIGHT_FACTORS = {
        # كغم CO₂ لكل ساعة طيران (يشمل Radiative Forcing ×1.9)
        'short_economy':    70.0,
        'medium_economy':  110.0,
        'long_economy':    140.0,
        'short_business':  175.0,
        'medium_business': 275.0,
        'long_business':   350.0,
        'short_first':     280.0,
        'medium_first':    440.0,
        'long_first':      560.0,
    }

    def _calc_transport(self):
        base = self.transport_km * self.TRANSPORT_FACTORS.get(self.transport_type, 0)
        style_mult = self.DRIVING_STYLE_MULTIPLIER.get(self.driving_style, 1.0)
        result = base * style_mult
        if self.uses_carpool and self.carpool_persons > 1:
            result /= min(self.carpool_persons, 4)
        return round(result, 4)

    def _calc_flights(self):
        cls = self.flight_class
        daily = 0
        for length, hours in [('short', self.flights_short_hours),
                               ('medium', self.flights_medium_hours),
                               ('long', self.flights_long_hours)]:
            key = f"{length}_{cls}"
            daily += (hours * self.FLIGHT_FACTORS.get(key, self.FLIGHT_FACTORS[f"{length}_economy"])) / 365
        return round(daily, 4)

    def _calc_food(self):
        # البروتين المحدد (غرام → كغم × عامل)
        protein_kg = self.protein_grams / 1000
        protein_impact = protein_kg * self.PROTEIN_FACTORS.get(self.protein_type, 0)
        # تعديل هدر الطعام
        waste_mult = 1 + (self.food_waste_percent / 100)
        # تعديل المنتجات المحلية (توفر نقل أقل)
        local_reduction = (self.local_food_percent / 100) * 0.05
        result = protein_impact * waste_mult * (1 - local_reduction)
        # إضافة تأثير النظام الغذائي العام
        result += self.DIET_BASE_FACTORS.get(self.diet_type, 0)
        return round(max(result, 0), 4)

    def _calc_energy(self):
        # كهرباء
        net_electricity = self.electricity_usage * (1 - self.solar_coverage_pct / 100) if self.has_solar else self.electricity_usage
        elec_daily = (net_electricity * self.ELECTRICITY_FACTOR) / 30
        # تدفئة
        heat_daily = (self.heating_usage * self.HEATING_FACTORS.get(self.heating_type, 0)) / 30
        # تبريد (تقدير من أشهر التبريد وإضافة 30% على الكهرباء في موسم الصيف)
        cooling_factor = 0.0
        if self.cooling_type in ('ac_standard', 'ac_inverter') and self.cooling_months > 0:
            extra_kwh_month = self.electricity_usage * 0.30
            cooling_factor = (extra_kwh_month * self.ELECTRICITY_FACTOR * self.cooling_months) / 365
        total = elec_daily + heat_daily + cooling_factor
        # قسمة على عدد أفراد الأسرة
        return round(total / max(self.household_size, 1), 4)

    def _calc_water(self):
        liters_daily = self.water_usage_liters
        m3_daily = liters_daily / 1000
        factor = self.WATER_FACTORS.get(self.water_source, 0.708)
        return round(m3_daily * factor, 4)

    def _calc_shopping(self):
        clothes_daily    = (self.clothes_spend * 0.15) / 30
        electronics_daily = (self.electronics_spend * 0.25) / 30
        furniture_daily  = (self.furniture_spend * 0.10) / 30
        subtotal = clothes_daily + electronics_daily + furniture_daily
        # تخفيض للمشتريات المستعملة
        secondhand_saving = subtotal * (self.buys_secondhand_pct / 100) * 0.70
        # تخفيض لإعادة التدوير
        recycling_saving = subtotal * self.RECYCLING_REDUCTION.get(self.waste_recycling, 0)
        return round(max(subtotal - secondhand_saving - recycling_saving, 0), 4)

    def save(self, *args, **kwargs):
        self.carbon_transport = self._calc_transport()
        self.carbon_flights   = self._calc_flights()
        self.carbon_food      = self._calc_food()
        self.carbon_energy    = self._calc_energy()
        self.carbon_water     = self._calc_water()
        self.carbon_shopping  = self._calc_shopping()
        self.carbon_result    = round(
            self.carbon_transport + self.carbon_flights + self.carbon_food +
            self.carbon_energy + self.carbon_water + self.carbon_shopping, 2
        )
        super().save(*args, **kwargs)

    def __str__(self):
        g = "ذكر" if self.gender == 'M' else "أنثى" if self.gender == 'F' else "—"
        return f"{g} | {self.city} | {self.carbon_result} kgCO₂/day"

    class Meta:
        verbose_name = "سجل تتبع الكربون"
        verbose_name_plural = "سجلات تتبع الكربون"
        ordering = ['-created_at']
