# دليل تخصيص نظام المجاميع

## تغيير الألوان

### الألوان الرئيسية
في ملف `styles.css`، يمكنك تغيير الألوان التالية:

```css
/* اللون الذهبي الرئيسي */
--primary-color: #ffd700;

/* الخلفية الغامقة */
--dark-bg: #1a1a2e;

/* البطاقات */
--card-bg: #2a2a3e;

/* النص */
--text-color: #ffffff;
```

### مثال على تغيير الألوان
```css
:root {
    --primary-color: #00ff88; /* أخضر */
    --dark-bg: #0a0a0a; /* أسود */
    --card-bg: #1a1a1a; /* رمادي غامق */
    --text-color: #ffffff; /* أبيض */
}
```

## تغيير عدد المجاميع

### 1. تعديل HTML
في ملف `index.html`، أضف أو احذف عناصر المجاميع:

```html
<!-- إضافة مجموعة خامسة -->
<div class="group-card" data-group="5">
    <h3>المجموعة الخامسة</h3>
    <div class="top-players" id="group5-top"></div>
</div>

<div class="group-section" id="group5-section">
    <h3>المجموعة الخامسة</h3>
    <div class="players-list" id="group5-players"></div>
</div>
```

### 2. تعديل JavaScript
في ملف `script.js`، أضف المجموعة الجديدة:

```javascript
let groupsData = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [] // إضافة المجموعة الخامسة
};
```

### 3. تعديل النماذج
أضف خيار المجموعة الجديدة في النماذج:

```html
<option value="5">المجموعة الخامسة</option>
```

## إضافة ميزات جديدة

### إضافة تصنيفات إضافية
```javascript
// إضافة تصنيف جديد
const person = {
    id: Date.now() + Math.random(),
    name: name,
    group: parseInt(group),
    points: parseInt(points),
    level: "مبتدئ", // تصنيف جديد
    joinDate: new Date().toISOString() // تاريخ الانضمام
};
```

### إضافة إحصائيات
```javascript
function getGroupStats(groupNumber) {
    const group = groupsData[groupNumber];
    return {
        totalPlayers: group.length,
        totalPoints: group.reduce((sum, person) => sum + person.points, 0),
        averagePoints: group.length > 0 ? Math.round(group.reduce((sum, person) => sum + person.points, 0) / group.length) : 0
    };
}
```

## تخصيص التصميم

### تغيير الخط
```css
body {
    font-family: 'Cairo', 'Arial', sans-serif; /* خط عربي */
}
```

### إضافة خلفية متحركة
```css
body {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

### تغيير شكل البطاقات
```css
.group-card {
    border-radius: 20px; /* زوايا أكثر انحناء */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* ظل أقوى */
}
```

## إضافة ميزات متقدمة

### نظام الجوائز
```javascript
function assignRewards() {
    for (let groupNumber = 1; groupNumber <= 4; groupNumber++) {
        const topPlayer = groupsData[groupNumber][0];
        if (topPlayer) {
            topPlayer.reward = "🏆 ذهبية";
        }
        const secondPlayer = groupsData[groupNumber][1];
        if (secondPlayer) {
            secondPlayer.reward = "🥈 فضية";
        }
        const thirdPlayer = groupsData[groupNumber][2];
        if (thirdPlayer) {
            thirdPlayer.reward = "🥉 برونزية";
        }
    }
}
```

### نظام المستويات
```javascript
function calculateLevel(points) {
    if (points >= 1000) return "محترف";
    if (points >= 500) return "متقدم";
    if (points >= 200) return "متوسط";
    if (points >= 50) return "مبتدئ";
    return "جديد";
}
```

### إضافة صور للأشخاص
```javascript
function addPersonWithImage(name, group, points, imageUrl) {
    const person = {
        id: Date.now() + Math.random(),
        name: name,
        group: parseInt(group),
        points: parseInt(points),
        image: imageUrl || 'default-avatar.png'
    };
    // ... باقي الكود
}
```

## تحسين الأداء

### تحسين التحديثات
```javascript
// استخدام debounce لتقليل التحديثات المتكررة
const debouncedRender = debounce(() => {
    renderAllGroups();
    renderHeroSection();
}, 300);
```

### تحسين التخزين
```javascript
// ضغط البيانات قبل التخزين
function saveData() {
    const compressedData = JSON.stringify(groupsData);
    localStorage.setItem('groupsData', compressedData);
}
```

## إضافة ميزات الأمان

### التحقق من المدخلات
```javascript
function validateInput(name, group, points) {
    if (name.length < 2) {
        throw new Error('الاسم يجب أن يكون أكثر من حرفين');
    }
    if (group < 1 || group > 4) {
        throw new Error('المجموعة غير صحيحة');
    }
    if (points < 0) {
        throw new Error('النقاط يجب أن تكون موجبة');
    }
    return true;
}
```

### حماية من XSS
```javascript
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}
```

## إضافة ميزات التصدير والاستيراد

### تصدير البيانات
```javascript
function exportData() {
    const dataStr = JSON.stringify(groupsData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'groups-data.json';
    link.click();
}
```

### استيراد البيانات
```javascript
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            groupsData = data;
            saveData();
            renderAllGroups();
            renderHeroSection();
            showMessage('تم استيراد البيانات بنجاح!', 'success');
        } catch (error) {
            showMessage('خطأ في استيراد البيانات', 'error');
        }
    };
    reader.readAsText(file);
}
```

## نصائح للتخصيص

1. **احتفظ بنسخة احتياطية** من الملفات الأصلية قبل التعديل
2. **اختبر التغييرات** على نسخة منفصلة أولاً
3. **استخدم أدوات المطور** في المتصفح لاختبار التغييرات
4. **احتفظ بتوثيق** للتغييرات التي تقوم بها
5. **استخدم نظام تحكم بالإصدارات** مثل Git

## الدعم

إذا واجهت أي مشاكل في التخصيص، يمكنك:
- مراجعة console المتصفح للأخطاء
- التأكد من صحة الكود باستخدام أدوات التحقق
- استشارة وثائق HTML/CSS/JavaScript
