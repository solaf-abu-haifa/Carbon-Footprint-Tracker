import React, { useState } from 'react';
import { Leaf, Calculator, BarChart3, Lightbulb, Save, Plane } from 'lucide-react';
export const CarbonCalculator = ({ onFootprintChange, onSave }) => {
  const [transport, setTransport] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [food, setFood] = useState(0);
  const [shopping, setShopping] = useState(0);
  const [flights, setFlights] = useState(0);

    const calculateTotal = () => {
    const transportTotal = transport * 0.12 * 30; 
    const energyTotal = energy * 0.5;            
    const foodTotal = food * 2.5 * 4;           
    const shoppingTotal = shopping * 0.05;      
    const flightsTotal = (flights * 200) / 12;  
    
    const total = Math.round(transportTotal + energyTotal + foodTotal + shoppingTotal + flightsTotal);
    return total;
  };
   const handleSave = () => {
     const fullData = {
     transport: transport,
     energy: energy,
     food: food,
     shopping: shopping,
     flights: flights,
     totalResult: totalResult
    };
       onSave(fullData);
};
  const totalResult = calculateTotal();

  // مصفوفة المدخلات مع استخدام أيقوناتك الأساسية بالتناوب أو حسب الفئة
  const inputFields = [
    { label: 'المواصلات (كم/يوم)', icon: <Calculator />, value: transport, setter: setTransport },
    { label: 'الكهرباء (كيلوواط/شهر)', icon: <Lightbulb />, value: energy, setter: setEnergy },
    { label: 'اللحوم (وجبات/أسبوع)', icon: <Leaf />, value: food, setter: setFood },
    { label: 'التسوق (دينار/شهر)', icon: <BarChart3 />, value: shopping, setter: setShopping },
    { label: 'الطيران (ساعة/سنة)', icon: <Plane />, value: flights, setter: setFlights },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">حساب الانبعاثات</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="text-green-600">{field.icon}</span>
                {field.label}
              </label>
              <input
                type="number"
                min="0"
                value={field.value || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  field.setter(val);
                  onFootprintChange(calculateTotal()); // تحديث فوري للبصمة الحالية
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 text-center">
          <p className="text-gray-600 font-medium mb-1">بصمتك الكربونية لهذا الشهر</p>
          <div className="text-5xl font-black text-green-600 mb-6">
            {totalResult} <span className="text-lg font-medium text-gray-500">كغم CO₂</span>
          </div>
          <button
            onClick={() => onSave(totalResult)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all active:scale-95"
          >
            <Leaf className="w-5 h-5" />
            حفظ البيانات في الإحصائيات
          </button>
        
        </div>
      </div>
    </div>
  );
};