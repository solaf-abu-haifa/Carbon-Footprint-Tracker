import { useState, useEffect } from 'react';
import { Leaf, Calculator, Lightbulb } from 'lucide-react';
import { CarbonCalculator } from './components/CarbonCalculator';
import TipsSection from './components/TipsSection';
import axios from 'axios';
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [currentFootprint, setCurrentFootprint] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState({
    age: '',
    gender: 'M',
    city: '',
    consent: false,
  });

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const deviceID = localStorage.getItem('research_device_id');
    if (!deviceID) {
      setShowOnboarding(true);
    } else {
      fetchHistoryFromServer(deviceID);
      const savedInfo = JSON.parse(localStorage.getItem('user_basic_info') || '{}');
      setUserData(prev => ({ ...prev, ...savedInfo }));
    }
  }, []);

  const fetchHistoryFromServer = async (deviceID) => {
  if (!deviceID) return; // حماية عشان ما يبعت طلب فاضي
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/history/${deviceID}/`);
    setMonthlyData(response.data);
  } catch (error) {
    console.error("فشل في جلب التاريخ:", error.response?.data);
  }
};

  async function saveMonthlyRecord(dataObject) {
    const deviceID = localStorage.getItem('research_device_id');
    const savedInfo = JSON.parse(localStorage.getItem('user_basic_info') || '{}');

    // نأخذ البيانات كما جاءت من الحاسبة ونضيف عليها بيانات الباحث
    const payload = {
      ...dataObject, // هذا سيجلب (transport_km, protein_grams, إلخ) تلقائياً
      device_id: deviceID,
      gender: userData.gender || savedInfo.gender || 'M',
      age: parseInt(userData.age || savedInfo.age) || 0,
      city: userData.city || savedInfo.city,
    };

    if (!payload.city) {
      alert("خطأ: يرجى إدخال المدينة في بيانات الباحث أولاً.");
      setShowOnboarding(true);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/save/', payload);
      alert("تم حفظ بياناتك بنجاح!");
      fetchHistoryFromServer(deviceID);
    } catch (error) {
      console.log("تفاصيل خطأ السيرفر:", error.response?.data);
      alert("فشل الحفظ: " + JSON.stringify(error.response?.data));
    }

  }
 
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (!userData.consent) {
      alert('يرجى الموافقة على استخدام البيانات للمتابعة.');
      return;
    }

    const uniqueID = 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('research_device_id', uniqueID);
    localStorage.setItem('user_basic_info', JSON.stringify(userData));

    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-6 text-right" dir="rtl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">حاسبة البصمة الكربونية</h1>
                <p className="text-sm text-gray-600">احسب تأثيرك على البيئة</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2" dir="rtl">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>الحاسبة</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span>النصائح</span>
          </button>
        </div>
      </div>

      <div className="py-8">
        {activeTab === 'calculator' && (
          <CarbonCalculator
            onFootprintChange={setCurrentFootprint}
            onSave={saveMonthlyRecord}
          />
        )}
        {activeTab === 'tips' && <TipsSection />}
      </div>

      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-gray-100" dir="rtl">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="text-green-600 w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">بيانات الباحث</h2>
              <p className="text-xs text-gray-500 mt-2">يرجى إدخال البيانات التالية للمساهمة في البحث العلمي</p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">العمر</label>
                <input 
                  type="number" required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الجنس</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={userData.gender}
                  onChange={(e) => setUserData({...userData, gender: e.target.value})}
                >
                  <option value="M">ذكر</option>
                  <option value="F">أنثى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">المدينة</label>
                <input 
                  type="text" placeholder="مثلاً: عمان" required
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={userData.city}
                  onChange={(e) => setUserData({...userData, city: e.target.value})}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-xl mt-4">
                <div className="flex gap-2">
                  <input 
                    type="checkbox" required
                    className="mt-1 h-4 w-4"
                    checked={userData.consent}
                    onChange={(e) => setUserData({...userData, consent: e.target.checked})}
                  />
                  <label className="text-xs text-blue-800">
                    أوافق على استخدام هذه البيانات لأغراض البحث العلمي.
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md">
                موافقة ومتابعة
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}