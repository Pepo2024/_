// Firebase Integration Helper
// هذا الملف يحتوي على تكوين Firebase فقط

// تكوين Firebase (استبدل هذه القيم بقيم مشروعك)
const firebaseConfig = {
    apiKey: "AIzaSyAs5cJQ8oRNwNjUledG7LoGBmODM3LN8YE",
    authDomain: "mahragan3-b4c9b.firebaseapp.com",
    databaseURL: "https://mahragan3-b4c9b-default-rtdb.firebaseio.com",
    projectId: "mahragan3-b4c9b",
    storageBucket: "mahragan3-b4c9b.firebasestorage.app",
    messagingSenderId: "721176186962",
    appId: "1:721176186962:web:dc55e41bdfbf95abaa4f8b",
    measurementId: "G-RT4GVB1YZ8"
};

// ملاحظة: تهيئة Firebase تتم في الملفات الأخرى (script.js و admin.js)
// لتجنب التهيئة المكررة

// دالة حفظ البيانات في Firebase
function saveDataToFirebase() {
    if (typeof database !== 'undefined') {
        database.ref('groups').set(groupsData)
            .then(() => {
                console.log('تم حفظ البيانات بنجاح');
            })
            .catch((error) => {
                console.error('خطأ في حفظ البيانات:', error);
            });
    }
}

// دالة تحميل البيانات من Firebase
function loadDataFromFirebase() {
    if (typeof database !== 'undefined') {
        database.ref('groups').once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    groupsData = data;
                    if (typeof renderAllGroups === 'function') {
                        renderAllGroups();
                    }
                    if (typeof renderHeroSection === 'function') {
                        renderHeroSection();
                    }
                }
            })
            .catch((error) => {
                console.error('خطأ في تحميل البيانات:', error);
            });
    }
}

// دالة مراقبة التغييرات في الوقت الفعلي
function watchDataChanges() {
    if (typeof database !== 'undefined') {
        database.ref('groups').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                groupsData = data;
                if (typeof renderAllGroups === 'function') {
                    renderAllGroups();
                }
                if (typeof renderHeroSection === 'function') {
                    renderHeroSection();
                }
            }
        });
    }
}

// مثال على إضافة شخص مع Firebase:
function addPersonWithFirebase(name, group, points) {
    if (typeof database !== 'undefined') {
        const person = {
            id: Date.now() + Math.random(),
            name: name,
            group: parseInt(group),
            points: parseInt(points)
        };
        
        database.ref(`groups/${group}`).push(person)
            .then(() => {
                console.log('تم إضافة الشخص بنجاح');
            })
            .catch((error) => {
                console.error('خطأ في إضافة الشخص:', error);
            });
    }
}

// مثال على تحديث نقاط شخص مع Firebase:
function updatePersonPointsWithFirebase(personId, groupNumber, newPoints) {
    if (typeof database !== 'undefined') {
        database.ref(`groups/${groupNumber}`).orderByChild('id').equalTo(personId).once('value')
            .then((snapshot) => {
                const updates = {};
                snapshot.forEach((childSnapshot) => {
                    updates[`groups/${groupNumber}/${childSnapshot.key}/points`] = parseInt(newPoints);
                });
                return database.ref().update(updates);
            })
            .then(() => {
                console.log('تم تحديث النقاط بنجاح');
            })
            .catch((error) => {
                console.error('خطأ في تحديث النقاط:', error);
            });
    }
}

// مثال على حذف شخص مع Firebase:
function deletePersonWithFirebase(personId, groupNumber) {
    if (typeof database !== 'undefined') {
        database.ref(`groups/${groupNumber}`).orderByChild('id').equalTo(personId).once('value')
            .then((snapshot) => {
                const updates = {};
                snapshot.forEach((childSnapshot) => {
                    updates[`groups/${groupNumber}/${childSnapshot.key}`] = null;
                });
                return database.ref().update(updates);
            })
            .then(() => {
                console.log('تم حذف الشخص بنجاح');
            })
            .catch((error) => {
                console.error('خطأ في حذف الشخص:', error);
            });
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveDataToFirebase,
        loadDataFromFirebase,
        watchDataChanges,
        addPersonWithFirebase,
        updatePersonPointsWithFirebase,
        deletePersonWithFirebase
    };
} 