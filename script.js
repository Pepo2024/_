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
                groupsData[group] = Object.values(data[group] || {});
                groupsData[group].sort((a, b) => b.points - a.points);
            }
        }
        renderAllGroups();
        renderHeroSection();
    });
}

// عرض جميع المجاميع (أول 3 أشخاص + زر المزيد)
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
        
        // عرض أول 3 أشخاص فقط
        const topThree = groupsData[groupNumber].slice(0, 3);
        topThree.forEach((person, index) => {
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
            `;
            
            container.appendChild(playerItem);
        });
        
        // إضافة زر "المزيد من الأشخاص" إذا كان هناك أكثر من 3 أشخاص
        if (groupsData[groupNumber].length > 3) {
            const moreButton = document.createElement('button');
            moreButton.className = 'more-btn';
            moreButton.innerHTML = `
                <i class="fas fa-users"></i>
                المزيد من الأشخاص (${groupsData[groupNumber].length - 3} شخص آخر)
            `;
            moreButton.onclick = () => showAllGroupMembers(groupNumber);
            container.appendChild(moreButton);
        }
    }
}

// عرض جميع أعضاء المجموعة في نافذة صغيرة
function showAllGroupMembers(groupNumber) {
    const groupName = `المجموعة ${groupNumber === 1 ? 'الأولى' : groupNumber === 2 ? 'الثانية' : groupNumber === 3 ? 'الثالثة' : 'الرابعة'}`;
    
    // إنشاء النافذة الصغيرة
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'groupMembersModal';
    
    let membersHTML = '';
    groupsData[groupNumber].forEach((person, index) => {
        const isFirst = index === 0;
        membersHTML += `
            <div class="group-member ${isFirst ? 'first' : ''}">
                <div class="member-rank">${index + 1}</div>
                <div class="member-name">${person.name}</div>
                <div class="member-points">${person.points} نقطة</div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content small-modal">
            <div class="modal-header">
                <h3>${groupName} - جميع الأعضاء</h3>
                <button class="close-btn" onclick="closeGroupMembersModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="group-members-list">
                ${membersHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// إغلاق نافذة أعضاء المجموعة
function closeGroupMembersModal() {
    const modal = document.getElementById('groupMembersModal');
    if (modal) {
        modal.remove();
    }
}

// عرض القسم الرئيسي (الأوائل فقط)
function renderHeroSection() {
    for (let groupNumber = 1; groupNumber <= 4; groupNumber++) {
        const container = document.getElementById(`group${groupNumber}-top`);
        container.innerHTML = '';
        
        // عرض أول شخص واحد فقط من كل مجموعة
        const topPlayer = groupsData[groupNumber][0];
        
        if (!topPlayer) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<p>لا يوجد أشخاص في هذه المجموعة</p>';
            container.appendChild(emptyMessage);
            continue;
        }
        
        // عرض الشخص الأول فقط
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card first';
        
        playerCard.innerHTML = `
            <div class="player-info">
                <div class="player-rank">1</div>
                <div class="player-name">${topPlayer.name}</div>
            </div>
            <div class="player-points">${topPlayer.points}</div>
        `;
        
        container.appendChild(playerCard);
    }
}

// إضافة تأثيرات بصرية
function addVisualEffects() {
    // تأثير ظهور تدريجي للعناصر
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مراقبة جميع البطاقات
    document.querySelectorAll('.group-card, .group-section').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// إغلاق النافذة عند النقر خارجها
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeGroupMembersModal();
    }
});

// إغلاق النافذة عند الضغط على ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGroupMembersModal();
    }
});

// تحميل البيانات عند بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromFirebase();
    setTimeout(addVisualEffects, 100);
}); 