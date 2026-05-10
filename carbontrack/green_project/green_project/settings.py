import os
from pathlib import Path
from decouple import config
import dj_database_url  # أنصحك بإضافتها لتسهيل ربط قاعدة بيانات Render

# 1. إعدادات المسارات الأساسية
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. إعدادات الحماية (عبر مكتبة decouple)
SECRET_KEY = config('SECRET_KEY', default='django-insecure-your-fallback-key')
DEBUG = config('DEBUG', default=False, cast=bool)

# 3. النطاقات المسموح بها (أضيفي رابط Render الخاص بكِ هنا)
ALLOWED_HOSTS = [
    'yourapp.onrender.com', # استبدلي 'yourapp' باسم مشروعك على Render
    '127.0.0.1',
    'localhost',
]

# 4. التطبيقات المنصبة
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic', # لإدارة الملفات الثابتة في التطوير
    'django.contrib.staticfiles',
    
    # مكتبات الطرف الثالث
    'rest_framework',
    'corsheaders',
    
    # تطبيقك الخاص
    'tracker', 
]

# 5. الميدل وير (الترتيب هنا حرج جداً لعمل CORS و Whitenoise)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # يجب أن يكون تحت Security مباشرة
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # وضعناه هنا لضمان معالجة الطلبات
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'green_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'green_project.wsgi.application'

# 6. قاعدة البيانات (التحويل لـ PostgreSQL الخاص بـ Render)
# إذا توفر رابط DATABASE_URL من Render فسيستخدمه تلقائياً، وإلا سيستخدم الإعدادات اليدوية
DATABASES = {
    'default': dj_database_url.config(
        default=f"postgres://{config('DB_USER')}:{config('DB_PASSWORD')}@{config('DB_HOST')}:{config('DB_PORT', default='5432')}/{config('DB_NAME')}",
        conn_max_age=600
    )
}

# 7. إعدادات CORS (للسماح لـ React بالتحدث مع Django)
CORS_ALLOWED_ORIGINS = [
    'https://carbon-tracker.vercel.app', # رابط تطبيقك على Vercel
    'http://localhost:5173',            # لضمان عمل Vite محلياً
]

# 8. إعدادات الملفات الثابتة (ضرورية لـ Render)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'