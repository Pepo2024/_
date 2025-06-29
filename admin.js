// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let groupsData = { 1: [], 2: [], 3: [], 4: [] };

// تحميل البيانات من Firebase
function loadDataFromFirebase() {
    database.ref('groups').on('value', (snapshot) => {
        const data = snapshot.val();
        groupsData = { 1: [], 2: [], 3: [], 4: [] };
        if (data) {
            for (let group = 1; group <= 4; group++) {
                if (data[group]) {
                    groupsData[group] = Object.values(data[group]);
                    groupsData[group].sort((a, b) => b.points - a.points);
                }
            }
        }
        renderAllGroups();
    });
}

// إضافة شخص جديد
function addPerson(name, group, points) {
    const person = {
        id: Date.now() + Math.random(),
        name: name,
        group: parseInt(group),
        points: parseInt(points)
    };
    
    database.ref(`groups/${group}`).push(person)
        .then(() => {
            alert('تم إضافة الشخص بنجاح!');
            closeAddPersonModal();
        })
        .catch((error) => {
            alert('خطأ في إضافة الشخص: ' + error.message);
        });
}

// حذف شخص
function deletePerson(personId, groupNumber) {
    if (confirm('هل أنت متأكد من حذف هذا الشخص؟')) {
        database.ref(`groups/${groupNumber}`).orderByChild('id').equalTo(personId).once('value', (snapshot) => {
            snapshot.forEach(child => {
                database.ref(`groups/${groupNumber}/${child.key}`).remove()
                    .then(() => {
                        alert('تم حذف الشخص بنجاح!');
                    })
                    .catch((error) => {
                        alert('خطأ في حذف الشخص: ' + error.message);
                    });
            });
        });
    }
}

// تحديث نقاط شخص
function updatePersonPoints(personId, groupNumber, newPoints) {
    database.ref(`groups/${groupNumber}`).orderByChild('id').equalTo(personId).once('value', (snapshot) => {
        snapshot.forEach(child => {
            database.ref(`groups/${groupNumber}/${child.key}/points`).set(parseInt(newPoints))
                .then(() => {
                    alert('تم تحديث النقاط بنجاح!');
                    closeEditPointsModal();
                })
                .catch((error) => {
                    alert('خطأ في تحديث النقاط: ' + error.message);
                });
        });
    });
}

// عرض جميع المجاميع
function renderAllGroups() {
    for (let groupNumber = 1; groupNumber <= 4; groupNumber++) {
        const container = document.getElementById(`group${groupNumber}-players`);
        container.innerHTML = '';
        
        if (groupsData[groupNumber].length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>لا يوجد أشخاص في هذه المجموعة</p>';
            container.appendChild(emptyMessage);
            continue;
        }
        
        groupsData[groupNumber].forEach((person, index) => {
            const isFirst = index === 0;
            const playerItem = document.createElement('div');
            playerItem.className = `player-item ${isFirst ? 'first' : ''}`;
            
            playerItem.innerHTML = `
                <div class="player-details">
                    <div class="player-rank-large">${index + 1}</div>
                    <div>
                        <div class="player-name">${person.name}</div>
                        <div class="player-points">${person.points} نقطة</div>
                    </div>
                </div>
                <div class="player-actions">
                    <button class="action-btn" onclick="editPoints(${person.id}, ${groupNumber}, '${person.name}', ${person.points})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePerson(${person.id}, ${groupNumber})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            
            container.appendChild(playerItem);
        });
    }
}

// Modal Functions
function showAddPersonModal() {
    document.getElementById('addPersonModal').style.display = 'block';
    document.getElementById('addPersonForm').reset();
    document.getElementById('personName').focus();
}

function closeAddPersonModal() {
    document.getElementById('addPersonModal').style.display = 'none';
}

function showEditPointsModal() {
    document.getElementById('editPointsModal').style.display = 'block';
    document.getElementById('editPersonPoints').focus();
}

function closeEditPointsModal() {
    document.getElementById('editPointsModal').style.display = 'none';
}

// تعديل النقاط
function editPoints(personId, groupNumber, personName, currentPoints) {
    document.getElementById('editPersonName').value = personName;
    document.getElementById('editPersonPoints').value = currentPoints;
    document.getElementById('editPointsForm').setAttribute('data-person-id', personId);
    document.getElementById('editPointsForm').setAttribute('data-group-number', groupNumber);
    showEditPointsModal();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات عند بدء التطبيق
    loadDataFromFirebase();
    
    // إضافة شخص جديد
    document.getElementById('addPersonForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('personName').value.trim();
        const group = document.getElementById('personGroup').value;
        const points = document.getElementById('personPoints').value;
        
        if (!name) {
            alert('يرجى إدخال اسم الشخص');
            return;
        }
        
        if (!group) {
            alert('يرجى اختيار المجموعة');
            return;
        }
        
        if (points === '' || points < 0) {
            alert('يرجى إدخال نقاط صحيحة');
            return;
        }
        
        addPerson(name, group, points);
    });
    
    // تعديل النقاط
    document.getElementById('editPointsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const personId = parseFloat(this.getAttribute('data-person-id'));
        const groupNumber = parseInt(this.getAttribute('data-group-number'));
        const newPoints = document.getElementById('editPersonPoints').value;
        
        if (newPoints === '' || newPoints < 0) {
            alert('يرجى إدخال نقاط صحيحة');
            return;
        }
        
        updatePersonPoints(personId, groupNumber, newPoints);
    });
    
    // إغلاق Modal عند النقر خارجه
    window.addEventListener('click', function(e) {
        const addModal = document.getElementById('addPersonModal');
        const editModal = document.getElementById('editPointsModal');
        
        if (e.target === addModal) {
            closeAddPersonModal();
        }
        if (e.target === editModal) {
            closeEditPointsModal();
        }
    });
    
    // إغلاق Modal عند الضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAddPersonModal();
            closeEditPointsModal();
        }
    });
}); 