
const tips = [
  {
   
    title: 'استخدم وسائل النقل العامة',
    description: 'قلل من استخدام السيارة الخاصة واستخدم الدراجة أو المواصلات العامة',
    impact: 'توفير 30% من الانبعاثات',
    icon: "🚲",  },
  {
   
    title: 'وفر الطاقة في المنزل',
    description: 'استخدم مصابيح LED وافصل الأجهزة غير المستخدمة',
    impact: 'توفير 25% من فاتورة الكهرباء',
     icon: "💡",
  },
  {
   
    title: 'أعد التدوير',
    description: 'افصل النفايات وأعد تدوير البلاستيك والورق والزجاج',
    impact: 'تقليل 20% من النفايات',
      icon: "♻️",
  },
  {
    title: 'ازرع الأشجار',
    description: 'الأشجار تمتص ثاني أكسيد الكربون وتنقي الهواء',
    impact: 'امتصاص 21 كغم CO₂/سنة لكل شجرة',
     icon: "🌳",
  },
  {
   
    title: 'وفر المياه',
    description: 'أغلق الصنبور أثناء تنظيف الأسنان واستخدم دش قصير',
    impact: 'توفير 30% من المياه',
    icon: "💧",
  },
 
    {
    
    title: 'استخدم الطاقة المتجددة',
    description: 'اعتمد على الطاقة الشمسية أو طاقة الرياح',
    impact: 'تقليل 50% من انبعاثات الطاقة',
      icon: "☀️",
  },
  {
    
    title:'توفير الكهرباء',
    description:'إطفاء الأجهزة غير المستخدمة.',
    impact: 'تقليل 5% من استهلاك الكهرباء',
     icon: "🔌",
  },
  {

    title: 'التهوية الطبيعية',
    description: 'استخدام الهواء الطلق لتهوية المكان بدلاً من المكيفات.',
    impact: 'توفير يصل إلى 20% من طاقة التبريد',
     icon: "🌬️",
},

];



export default function CarbonTips() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          نصائح لتقليل البصمة الكربونية 🌱
        </h1>

        <p className="text-gray-600 text-lg">
          خطوات بسيطة يمكن أن تحدث فرقاً كبيراً في الحفاظ على البيئة
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {tips.map((tip, index) => (
          <div
            key={index}
            className="
              bg-white
              rounded-2xl
              shadow-md
              p-6
              text-center
              hover:shadow-xl
              hover:-translate-y-2
              transition duration-300
            "
          >

            {/* Icon */}
            <div className="
                w-16 h-16
                mx-auto mb-4
                flex items-center justify-center
                bg-green-100
                text-3xl
                rounded-full
            ">
              {tip.icon}
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {tip.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              {tip.description}
            </p>

            {/* Badge */}
            <span className="
              inline-block
              bg-green-100
              text-green-700
              text-xs
              px-3 py-1
              rounded-full
            ">
              {tip.impact}
            </span>

          </div>
        ))}

      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-green-700 font-medium">
          🌍 كل خطوة صغيرة تصنع فرقاً كبيراً في مستقبل كوكبنا
        </p>
      </div>

    </div>
  );
}

