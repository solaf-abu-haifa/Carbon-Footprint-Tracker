import React, { useState, useEffect, useCallback } from 'react';
import {
  Car, Utensils, Zap, Plane, ShoppingBag, Droplets,
  Save, ChevronDown, Info, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
 

const TRANSPORT_FACTORS = {
  petrol_small:  0.142, petrol_medium: 0.170, petrol_large:  0.215,
  diesel_car:    0.155, hybrid_car:    0.105, ev_car:        0.047,
  motorcycle:    0.103, bus_public:    0.089, minibus:       0.105,
  taxi:          0.170, bicycle:       0.0,   walking:       0.0,
};
const DRIVING_STYLE_MULT = { city: 1.25, highway: 0.88, mixed: 1.00 };
 
const PROTEIN_FACTORS = {
  beef: 27.0, lamb: 39.2, pork: 12.1, poultry: 6.9,
  fish_farmed: 5.1, fish_wild: 3.0, seafood: 6.1,
  eggs: 4.5, dairy: 3.2, legumes: 0.9, tofu_tempeh: 2.0, nuts: 2.3,
};
const DIET_BASE = {
  omnivore: 0, low_meat: -0.5, pescatarian: -0.9, vegetarian: -1.2, vegan: -1.5,
};
 
const HEATING_FACTORS = {
  none: 0, electric: 0.588, natural_gas: 2.04, lpg: 2.98,
  diesel_heater: 2.68, wood: 0.39, district: 0.30,
};
const ELEC_FACTOR = 0.588; 
 
const WATER_FACTORS = {
  city_network: 0.708, well_pump: 0.500, tanker: 1.200, mixed: 0.850,
};
 
const RECYCLING_REDUCTION = { none: 0, some: 0.10, most: 0.20, full: 0.35 };
 
const FLIGHT_FACTORS = {
  short_economy: 70, medium_economy: 110, long_economy: 140,
  short_business: 175, medium_business: 275, long_business: 350,
  short_first: 280, medium_first: 440, long_first: 560,
};
 

export function calcBreakdown(v) {
  // المواصلات
  const baseTrans = v.transport_km * (TRANSPORT_FACTORS[v.transport_type] || 0);
  const styleMult = DRIVING_STYLE_MULT[v.driving_style] || 1;
  let transport = baseTrans * styleMult;
  if (v.uses_carpool && v.carpool_persons > 1) transport /= Math.min(v.carpool_persons, 4);
 
  // الطيران
  const cls = v.flight_class || 'economy';
  const flights =
    ((v.flights_short_hours  * (FLIGHT_FACTORS[`short_${cls}`]  || 70))  +
     (v.flights_medium_hours * (FLIGHT_FACTORS[`medium_${cls}`] || 110)) +
     (v.flights_long_hours   * (FLIGHT_FACTORS[`long_${cls}`]   || 140))) / 365;
 
  // الغذاء
  const proteinKg    = (v.protein_grams || 0) / 1000;
  const proteinImpact = proteinKg * (PROTEIN_FACTORS[v.protein_type] || 0);
  const wasteMult    = 1 + ((v.food_waste_percent || 20) / 100);
  const localSaving  = ((v.local_food_percent || 50) / 100) * 0.05;
  let food           = proteinImpact * wasteMult * (1 - localSaving);
  food              += DIET_BASE[v.diet_type] || 0;
  food               = Math.max(food, 0);
 
  // الطاقة
  const netElec     = v.has_solar
    ? v.electricity_usage * (1 - (v.solar_coverage_pct || 0) / 100)
    : v.electricity_usage;
  const elecDaily   = (netElec * ELEC_FACTOR) / 30;
  const heatDaily   = ((v.heating_usage || 0) * (HEATING_FACTORS[v.heating_type] || 0)) / 30;
  const coolExtra   = ['ac_standard','ac_inverter'].includes(v.cooling_type) && v.cooling_months > 0
    ? (v.electricity_usage * 0.30 * ELEC_FACTOR * v.cooling_months) / 365
    : 0;
  const energy      = (elecDaily + heatDaily + coolExtra) / Math.max(v.household_size || 1, 1);
 
  const water = ((v.water_usage_liters || 0) / 1000) * (WATER_FACTORS[v.water_source] || 0.708);
 
  const shoppingRaw  = ((v.clothes_spend || 0) * 0.15 +
                        (v.electronics_spend || 0) * 0.25 +
                        (v.furniture_spend || 0) * 0.10) / 30;
  const secondhandS  = shoppingRaw * ((v.buys_secondhand_pct || 0) / 100) * 0.70;
  const recycleS     = shoppingRaw * (RECYCLING_REDUCTION[v.waste_recycling] || 0);
  const shopping     = Math.max(shoppingRaw - secondhandS - recycleS, 0);
 
  const total = transport + flights + food + energy + water + shopping;
  return {
    transport: +transport.toFixed(3),
    flights:   +flights.toFixed(3),
    food:      +food.toFixed(3),
    energy:    +energy.toFixed(3),
    water:     +water.toFixed(3),
    shopping:  +shopping.toFixed(3),
    total:     +total.toFixed(2),
  };
}
 

function SectionCard({ icon: Icon, color, title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-50 ${color}`}>
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-base">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}
 
function Field({ label, hint, children }) {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && (
          <button onClick={() => setShowHint(s => !s)} className="text-gray-400 hover:text-blue-500">
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {showHint && <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">{hint}</p>}
      {children}
    </div>
  );
}
 
function Select({ value, onChange, options, color = 'blue' }) {
  const ring = { blue:'focus:ring-blue-400', orange:'focus:ring-orange-400', yellow:'focus:ring-yellow-400', cyan:'focus:ring-cyan-400', purple:'focus:ring-purple-400', green:'focus:ring-green-400' };
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full p-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 ${ring[color]||ring.blue} outline-none font-medium cursor-pointer appearance-none`}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
 
function NumInput({ value, onChange, placeholder = '0', min = 0 }) {
  return (
    <input
      type="number" min={min}
      value={value || ''}
      placeholder={placeholder}
      onChange={e => onChange(Number(e.target.value) || 0)}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none"
    />
  );
}
 
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}
 
function RangeSlider({ value, onChange, min = 0, max = 100, step = 5, unit = '%' }) {
  return (
    <div className="space-y-1">
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-green-500"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}{unit}</span>
        <span className="font-bold text-gray-700">{value}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
 
function SubBar({ label, value, color, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{value.toFixed(2)} كغم</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
 

const INITIAL = {
  // مواصلات
  transport_type: 'petrol_medium', transport_km: 0,
  driving_style: 'mixed', uses_carpool: false, carpool_persons: 1,
  // طيران
  flights_short_hours: 0, flights_medium_hours: 0, flights_long_hours: 0,
  flight_class: 'economy',
  // غذاء
  diet_type: 'omnivore', protein_type: 'poultry', protein_grams: 0,
  food_waste_percent: 20, local_food_percent: 50,
  // طاقة
  electricity_usage: 0, has_solar: false, solar_coverage_pct: 30,
  heating_type: 'none', heating_usage: 0,
  cooling_type: 'none', cooling_months: 3,
  // مياه
  water_usage_liters: 0, water_source: 'city_network',
  // مشتريات
  clothes_spend: 0, electronics_spend: 0, furniture_spend: 0,
  shopping_frequency: 'monthly', buys_secondhand_pct: 0,
  waste_recycling: 'none',
  // منزل
  household_size: 1, building_type: 'apartment_medium',
};
 
export const CarbonCalculator = ({ onFootprintChange, onSave }) => {
  const [v, setV] = useState(INITIAL);
  const upd = useCallback((key, val) => setV(prev => ({ ...prev, [key]: val })), []);
 
  const bd = calcBreakdown(v);
 
  useEffect(() => { if (onFootprintChange) onFootprintChange(bd.total); }, [bd.total]);
 
  const handleSave = () => onSave({
    transport_type: v.transport_type,       transport_km: v.transport_km,
    driving_style: v.driving_style,         uses_carpool: v.uses_carpool,
    carpool_persons: v.carpool_persons,
    flights_short_hours: v.flights_short_hours,
    flights_medium_hours: v.flights_medium_hours,
    flights_long_hours: v.flights_long_hours,
    flight_class: v.flight_class,
    diet_type: v.diet_type,                  protein_type: v.protein_type,
    protein_grams: v.protein_grams,         food_waste_percent: v.food_waste_percent,
    local_food_percent: v.local_food_percent,
    electricity_usage: v.electricity_usage, has_solar: v.has_solar,
    solar_coverage_pct: v.solar_coverage_pct,
    heating_type: v.heating_type,           heating_usage: v.heating_usage,
    cooling_type: v.cooling_type,           cooling_months: v.cooling_months,
    water_usage_liters: v.water_usage_liters, water_source: v.water_source,
    clothes_spend: v.clothes_spend,         electronics_spend: v.electronics_spend,
    furniture_spend: v.furniture_spend,     shopping_frequency: v.shopping_frequency,
    buys_secondhand_pct: v.buys_secondhand_pct,
    waste_recycling: v.waste_recycling,
    household_size: v.household_size,       building_type: v.building_type,
  });
 
  const JORDAN_AVG = 14.0;
  const WORLD_AVG  = 11.0;
  const pctJordan  = ((bd.total - JORDAN_AVG) / JORDAN_AVG * 100).toFixed(0);
  const statusColor = bd.total < 8 ? 'bg-emerald-500' : bd.total < 14 ? 'bg-amber-500' : 'bg-red-500';
  const statusLabel = bd.total < 8 ? 'ممتازة 🌱' : bd.total < 14 ? 'متوسطة ⚡' : 'مرتفعة ⚠️';
  const CompIcon = bd.total < JORDAN_AVG ? TrendingDown : bd.total === JORDAN_AVG ? Minus : TrendingUp;
 
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" dir="rtl">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
 
        {/* ─── عمود المدخلات ─────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">
 
          {/* المواصلات */}
          <SectionCard icon={Car} color="text-blue-600" title="🚗 التنقل والمواصلات">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="نوع المركبة">
                <Select color="blue" value={v.transport_type} onChange={val => upd('transport_type', val)} options={[
                  {value:'petrol_small',  label:'🚗 بنزين صغيرة (≤1.4L)'},
                  {value:'petrol_medium', label:'🚗 بنزين متوسطة (1.5–2.0L)'},
                  {value:'petrol_large',  label:'🚙 بنزين كبيرة / SUV'},
                  {value:'diesel_car',    label:'🚗 ديزل'},
                  {value:'hybrid_car',    label:'⚡🚗 هجينة (Hybrid)'},
                  {value:'ev_car',        label:'⚡ كهربائية'},
                  {value:'motorcycle',    label:'🏍️ دراجة نارية'},
                  {value:'bus_public',    label:'🚌 باص عام'},
                  {value:'minibus',       label:'🚐 سرفيس / ميني باص'},
                  {value:'taxi',          label:'🚕 تاكسي'},
                  {value:'bicycle',       label:'🚲 دراجة هوائية'},
                  {value:'walking',       label:'🚶 مشي'},
                ]} />
              </Field>
              <Field label="المسافة اليومية (كم/يوم)" hint="المسافة الإجمالية ذهاباً وإياباً">
                <NumInput value={v.transport_km} onChange={val => upd('transport_km', val)} placeholder="مثال: 30" />
              </Field>
              <Field label="نمط القيادة" hint="القيادة في المدينة تستهلك وقوداً أكثر بـ25% من الطريق السريع">
                <Select color="blue" value={v.driving_style} onChange={val => upd('driving_style', val)} options={[
                  {value:'city',    label:'🏙️ داخل المدينة (إشارات / ازدحام)'},
                  {value:'highway', label:'🛣️ طريق سريع'},
                  {value:'mixed',   label:'🔀 مختلط'},
                ]} />
              </Field>
              <div className="space-y-3">
                <Toggle checked={v.uses_carpool} onChange={val => upd('uses_carpool', val)} label="أشارك السيارة مع آخرين (Carpool)" />
                {v.uses_carpool && (
                  <Field label="عدد المسافرين في السيارة (معك)">
                    <Select color="blue" value={v.carpool_persons} onChange={val => upd('carpool_persons', Number(val))} options={[
                      {value:2,label:'شخصان'},{value:3,label:'3 أشخاص'},{value:4,label:'4 أشخاص'}
                    ]} />
                  </Field>
                )}
              </div>
            </div>
          </SectionCard>
 
          {/* الطيران */}
          <SectionCard icon={Plane} color="text-sky-600" title="✈️ الطيران">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="درجة السفر" hint="درجة الأعمال تُنتج 2.5× أكثر من الاقتصادية">
                <Select color="cyan" value={v.flight_class} onChange={val => upd('flight_class', val)} options={[
                  {value:'economy',  label:'💺 اقتصادي'},
                  {value:'business', label:'💼 أعمال'},
                  {value:'first',    label:'🌟 أول'},
                ]} />
              </Field>
              <Field label="رحلات قصيرة (<3 ساعات) — ساعات/سنة" hint="مثال: عمّان–بيروت ≈ 1.5 ساعة">
                <NumInput value={v.flights_short_hours} onChange={val => upd('flights_short_hours', val)} />
              </Field>
              <Field label="رحلات متوسطة (3–6 ساعات) — ساعات/سنة" hint="مثال: عمّان–دبي ≈ 3 ساعات">
                <NumInput value={v.flights_medium_hours} onChange={val => upd('flights_medium_hours', val)} />
              </Field>
              <Field label="رحلات طويلة (>6 ساعات) — ساعات/سنة" hint="مثال: عمّان–لندن ≈ 5.5 ساعة">
                <NumInput value={v.flights_long_hours} onChange={val => upd('flights_long_hours', val)} />
              </Field>
            </div>
          </SectionCard>
 
          {/* الغذاء */}
          <SectionCard icon={Utensils} color="text-orange-600" title="🍽️ النظام الغذائي">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="النظام الغذائي العام" hint="يؤثر على انبعاثات الغذاء الكلية">
                <Select color="orange" value={v.diet_type} onChange={val => upd('diet_type', val)} options={[
                  {value:'omnivore',    label:'🍖 آكل كل شيء'},
                  {value:'low_meat',    label:'🥗 قليل اللحوم'},
                  {value:'pescatarian', label:'🐟 نباتي مع أسماك'},
                  {value:'vegetarian',  label:'🥦 نباتي'},
                  {value:'vegan',       label:'🌿 نباتي صارم (Vegan)'},
                ]} />
              </Field>
              <Field label="المصدر الرئيسي للبروتين">
                <Select color="orange" value={v.protein_type} onChange={val => upd('protein_type', val)} options={[
                  {value:'beef',       label:'🥩 لحم بقر'},
                  {value:'lamb',       label:'🐑 لحم خروف / ماعز'},
      
                  {value:'poultry',    label:'🍗 دواجن'},
                  {value:'fish_farmed',label:'🐟 أسماك مزروعة'},
                  {value:'fish_wild',  label:'🐠 أسماك برية'},
                  {value:'seafood',    label:'🦐 مأكولات بحرية'},
                  {value:'eggs',       label:'🥚 بيض'},
                  {value:'dairy',      label:'🧀 منتجات ألبان'},
                  {value:'legumes',    label:'🫘 بقوليات'},
                  {value:'tofu_tempeh',label:'🌱 توفو / تمبيه'},
                  {value:'nuts',       label:'🥜 مكسرات'},
                ]} />
              </Field>
              <Field label="كمية البروتين (غرام/يوم)" hint="متوسط الشخص البالغ: 50–70 غرام/يوم">
                <NumInput value={v.protein_grams} onChange={val => upd('protein_grams', val)} placeholder="مثال: 60" />
              </Field>
             
          
            </div>
          </SectionCard>
 
          {/* الطاقة */}
          <SectionCard icon={Zap} color="text-yellow-600" title="⚡ الطاقة في المنزل">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="عدد أفراد الأسرة" hint="تنقسم انبعاثات المنزل على جميع الأفراد">
                <Select color="yellow" value={v.household_size} onChange={val => upd('household_size', Number(val))} options={
                  [1,2,3,4,5,6,7,8].map(n => ({value:n, label:`${n} ${n===1?'فرد':'أفراد'}`}))
                } />
              </Field>
              <Field label="استهلاك الكهرباء (kWh/شهر)" hint="يجدها في فاتورة الكهرباء. المنزل الأردني المتوسط: 200–400 kWh">
                <NumInput value={v.electricity_usage} onChange={val => upd('electricity_usage', val)} placeholder="مثال: 300" />
              </Field>
              <div className="sm:col-span-2 space-y-3">
                <Toggle checked={v.has_solar} onChange={val => upd('has_solar', val)} label="عندي ألواح طاقة شمسية" />
                {v.has_solar && (
                  <Field label={`تغطية الطاقة الشمسية: ${v.solar_coverage_pct}%`} hint="نسبة الكهرباء المولّدة من الألواح الشمسية">
                    <RangeSlider value={v.solar_coverage_pct} onChange={val => upd('solar_coverage_pct', val)} min={10} max={100} step={10} />
                  </Field>
                )}
              </div>
              <Field label="نوع التدفئة" hint="المازوت والغاز لهما انبعاثات أعلى من الكهرباء">
                <Select color="yellow" value={v.heating_type} onChange={val => upd('heating_type', val)} options={[
                  {value:'none',         label:'❌ لا تدفئة'},
                  {value:'electric',     label:'🔌 تدفئة كهربائية'},
                  {value:'natural_gas',  label:'🔥 غاز طبيعي'},
                  {value:'lpg',          label:'🛢️ بوتاجاز (LPG)'},
                  {value:'diesel_heater',label:'🛢️ مازوت / سولار'},
                  {value:'wood',         label:'🪵 حطب'},
                  {value:'district',     label:'🏢 تدفئة مركزية'},
                ]} />
              </Field>
              {v.heating_type !== 'none' && (
                <Field
                  label={`كمية التدفئة / شهر (${['electric','district'].includes(v.heating_type)?'kWh':'كغم/لتر'})`}
                  hint="انظر فاتورة الغاز أو تقدير الاستهلاك الشهري في موسم الشتاء"
                >
                  <NumInput value={v.heating_usage} onChange={val => upd('heating_usage', val)} />
                </Field>
              )}
              <Field label="نوع التبريد">
                <Select color="yellow" value={v.cooling_type} onChange={val => upd('cooling_type', val)} options={[
                  {value:'none',        label:'❌ لا تبريد'},
                  {value:'ac_inverter', label:'❄️ مكيف إنفرتر'},
                  {value:'ac_standard', label:'❄️ مكيف عادي'},
                  {value:'fan_only',    label:'🌀 مراوح فقط'},
                  {value:'evaporative', label:'💨 مبرد تبخيري (كولر)'},
                ]} />
              </Field>
              {['ac_standard','ac_inverter'].includes(v.cooling_type) && (
                <Field label="عدد أشهر التشغيل" hint="في الأردن عادةً 3–5 أشهر (مايو–سبتمبر)">
                  <Select color="yellow" value={v.cooling_months} onChange={val => upd('cooling_months', Number(val))} options={
                    [1,2,3,4,5,6].map(n => ({value:n,label:`${n} أشهر`}))
                  } />
                </Field>
              )}
            </div>
          </SectionCard>
 
          {/* المياه */}
          <SectionCard icon={Droplets} color="text-cyan-600" title="💧 استهلاك المياه">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الاستهلاك اليومي للفرد (لتر/يوم)" hint="متوسط الأردني: 90–130 لتر/يوم. ضخ المياه يستهلك طاقة وينتج انبعاثات">
                <NumInput value={v.water_usage_liters} onChange={val => upd('water_usage_liters', val)} placeholder="مثال: 100" />
              </Field>
              <Field label="مصدر المياه الرئيسي">
                <Select color="cyan" value={v.water_source} onChange={val => upd('water_source', val)} options={[
                  {value:'city_network', label:'🏙️ شبكة المياه البلدية'},
                  {value:'well_pump',    label:'⛽ بئر + مضخة'},
                  {value:'tanker',       label:'🚛 صهريج'},
                  {value:'mixed',        label:'🔀 مختلط'},
                ]} />
              </Field>
            </div>
          </SectionCard>
 
          {/* المشتريات والنفايات */}
          <SectionCard icon={ShoppingBag} color="text-purple-600" title="🛍️ المشتريات والنفايات">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="إنفاق الملابس (دينار/شهر)">
                <NumInput value={v.clothes_spend} onChange={val => upd('clothes_spend', val)} />
              </Field>
              <Field label="إنفاق الإلكترونيات (دينار/شهر)">
                <NumInput value={v.electronics_spend} onChange={val => upd('electronics_spend', val)} />
              </Field>
              <Field label="إنفاق الأثاث والمنزل (دينار/شهر)">
                <NumInput value={v.furniture_spend} onChange={val => upd('furniture_spend', val)} />
              </Field>
              
            
            </div>
          </SectionCard>
 
        </div>
 
        {/* ─── كرت النتائج ───────────────────────────── */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-4">
 
            {/* الرقم الرئيسي */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-green-200">
              <h3 className="text-center font-bold opacity-80 mb-2 text-sm">بصمتك اليومية</h3>
              <div className="text-center">
                <span className="text-6xl font-black tracking-tighter">{bd.total}</span>
                <p className="text-lg opacity-80 mt-1">كغم CO₂</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="font-bold text-base">{(bd.total * 30).toFixed(0)}</div>
                  <div className="opacity-70">كغم/شهر</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="font-bold text-base">{(bd.total * 365 / 1000).toFixed(1)}</div>
                  <div className="opacity-70">طن/سنة</div>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs opacity-70">الحالة:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} text-white`}>
                  {statusLabel}
                </span>
              </div>
            </div>
 
            {/* مقارنة المعدلات */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h4 className="font-bold text-sm text-gray-700 mb-3">📊 مقارنة المعدلات</h4>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'المعدل الأردني', val: JORDAN_AVG, color: 'bg-amber-400' },
                  { label: 'المعدل العالمي', val: WORLD_AVG,  color: 'bg-blue-400' },
                  { label: 'بصمتك',          val: bd.total,   color: 'bg-green-500' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="w-20 text-gray-500">{r.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${Math.min((r.val/20)*100,100)}%` }} />
                    </div>
                    <span className="w-12 text-right font-bold text-gray-700">{r.val} كغم</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs">
                <CompIcon className={`w-4 h-4 ${bd.total < JORDAN_AVG ? 'text-green-500' : 'text-red-500'}`} />
                <span className={bd.total < JORDAN_AVG ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(+pctJordan)}% {bd.total < JORDAN_AVG ? 'أقل' : 'أكثر'} من المعدل الأردني
                </span>
              </div>
            </div>
 
            {/* تفصيل القطاعات */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h4 className="font-bold text-sm text-gray-700 mb-3">🔍 تفصيل القطاعات</h4>
              <div className="space-y-3">
                <SubBar label="🚗 مواصلات" value={bd.transport} color="bg-blue-400"   max={bd.total} />
                <SubBar label="✈️ طيران"    value={bd.flights}   color="bg-sky-400"    max={bd.total} />
                <SubBar label="🍽️ غذاء"    value={bd.food}      color="bg-orange-400" max={bd.total} />
                <SubBar label="⚡ طاقة"     value={bd.energy}    color="bg-yellow-400" max={bd.total} />
                <SubBar label="💧 مياه"     value={bd.water}     color="bg-cyan-400"   max={bd.total} />
                <SubBar label="🛍️ مشتريات" value={bd.shopping}  color="bg-purple-400" max={bd.total} />
              </div>
            </div>
 
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-4 rounded-2xl font-black text-base transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ الإحصائيات
            </button>
 
          </div>
        </div>
 
      </div>
    </div>
  );
};