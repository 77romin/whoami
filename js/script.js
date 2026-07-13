/**
 * 프로필 인터랙티브 콘솔창 탭 제어 함수
 */
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.console-tab');
    const contents = document.querySelectorAll('.console-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    const activeTab = Array.from(tabs).find(tab => tab.getAttribute('onclick').includes(tabName));
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    const activeContent = document.getElementById(`tab-${tabName}`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

/**
 * 하단 CTA 버튼 액션: 오아시스 스타일 가상 토스트 출력
 */
function showToast() {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span style="color: #06b6d4; font-weight: bold;">🌴 OASIS_LOG:</span>
        <span> 💪Go for It Together!💪 </span>
    `;
    
    container.appendChild(toast);
    
    // 토스트 애니메이션 작동 (나타나기)
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    // 2. [★핵심] 1초(1000ms) 후에 깃허브 새 탭을 띄우는 타이머 작동
    setTimeout(() => {
        const instagramUrl = "https://github.com/77romin"; 
        window.open(instagramUrl, '_blank');
    }, 1000); 

    // 3. 5.5초 후에 토스트 알림창 사라지게 하기 (이동 타이머와 싱크 조절)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 5500);
}

/**
 * [신설] 동적 스크롤에 따른 루트 시스템 변수 교체 기능
 * 스크롤 깊이에 따라 글로벌 `--accent` 컬러를 사막 오렌지에서 오아시스 시안으로 부드럽게 스위칭합니다.
 */
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const root = document.documentElement;

    if (scrollPercent > 0.4) {
        // 스크롤이 중간 이하(오아시스 영역 진입)로 내려갈 때 변수 전환
        root.style.setProperty('--accent', 'var(--oasis-accent)');
        root.style.setProperty('--bg-card', 'var(--oasis-card)');
        root.style.setProperty('--border-color', 'var(--oasis-border)');
        root.style.setProperty('--accent-glow', 'rgba(6, 182, 212, 0.15)');
    } else {
        // 상단 사막 영역일 때 변수 유지
        root.style.setProperty('--accent', 'var(--desert-accent)');
        root.style.setProperty('--bg-card', 'var(--desert-card)');
        root.style.setProperty('--border-color', 'var(--desert-border)');
        root.style.setProperty('--accent-glow', 'rgba(245, 158, 11, 0.15)');
    }
});

/**
 * [신설] 사막 모래바람 -> 오아시스 맑은 물방울 동적 파티클 시스템
 */
const canvas = document.getElementById('ambient-particles');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let currentTheme = 'desert'; // 'desert' or 'oasis'

// 리사이징 대응
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 개별 입자 객체 정의
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        // 사막일 때는 위에서 아래/옆으로 모래가 날림, 오아시스일 때는 바닥에서 물방울이 솟구침
        if (currentTheme === 'desert') {
            this.y = Math.random() * (canvas.height * 0.7);
            this.vx = Math.random() * 2 + 1.5; // 우측으로 휘날리는 사막바람 속도
            this.vy = Math.random() * 0.5 - 0.2;
            this.size = Math.random() * 1.5 + 0.5; // 작고 고운 모래알
            this.alpha = Math.random() * 0.6 + 0.2;
            // 따뜻한 모래/황금빛 색상 스펙트럼
            const colors = ['#f59e0b', '#fbbf24', '#d97706', '#78350f'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
            this.y = canvas.height + Math.random() * 20;
            this.vx = Math.random() * 0.6 - 0.3;
            this.vy = -(Math.random() * 1.2 + 0.5); // 위로 떠오르는 성질
            this.size = Math.random() * 3 + 1; // 맑은 수면의 영롱한 물방울 크기
            this.alpha = Math.random() * 0.5 + 0.1;
            // 시안/에메랄드/푸른 물빛 색상 스펙트럼
            const colors = ['#06b6d4', '#22d3ee', '#14b8a6', '#38bdf8'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
    }

    update(scrollPercent) {
        this.x += this.vx;
        this.y += this.vy;

        // 경계 이탈 시 리셋 보정
        if (currentTheme === 'desert') {
            if (this.x > canvas.width || this.y > canvas.height) {
                this.x = 0;
                this.y = Math.random() * (canvas.height * 0.8);
            }
        } else {
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = currentTheme === 'oasis' ? 8 : 0; // 물방울일 때만 영롱하게 발광 효과
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// 초기 파티클 생성 풀 구성
function initParticles() {
    particlesArray = [];
    const particleCount = Math.min(window.innerWidth / 7, 120); // 기기 성능별 개수 최적화
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

// 애니메이션 루프 구동
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

/**
 * 스크롤 심도 실시간 계측 및 사막 언덕 페러랙스/오아시스 변이 이벤트 핸들러
 */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / totalHeight;
    const root = document.documentElement;

    // 1. 사막 언덕 입체적 페러랙스(시차) 효과 구현 (스크롤 시 자연스럽게 아래로 묻힘)
    const hill1 = document.querySelector('.hill-1');
    const hill2 = document.querySelector('.hill-2');
    if (hill1 && hill2) {
        hill1.style.transform = `translateY(${50 + scrollY * 0.25}px)`;
        hill2.style.transform = `translateY(${120 + scrollY * 0.15}px)`;
    }

    // 2. 임계값(40%) 기준으로 사막 모래 테마 -> 푸른 오아시스 테마 환경 전환
    if (scrollPercent > 0.4) {
        if (currentTheme !== 'oasis') {
            currentTheme = 'oasis';
            document.body.classList.add('oasis-active');
            // 파티클들을 오아시스 물방울 속성으로 점진적 리셋
            particlesArray.forEach(p => p.reset());
        }
        root.style.setProperty('--accent', 'var(--oasis-accent)');
        root.style.setProperty('--bg-card', 'var(--oasis-card)');
        root.style.setProperty('--border-color', 'var(--oasis-border)');
        root.style.setProperty('--accent-glow', 'rgba(6, 182, 212, 0.15)');
    } else {
        if (currentTheme !== 'desert') {
            currentTheme = 'desert';
            document.body.classList.remove('oasis-active');
            particlesArray.forEach(p => p.reset());
        }
        root.style.setProperty('--accent', 'var(--desert-accent)');
        root.style.setProperty('--bg-card', 'var(--desert-card)');
        root.style.setProperty('--border-color', 'var(--desert-border)');
        root.style.setProperty('--accent-glow', 'rgba(245, 158, 11, 0.15)');
    }
});

/* ==========================================
   ⚡ 2일차 미션: 게이미피케이션 비즈니스 로직
   ========================================== */

// 퀴즈 데이터셋 문항 구성
const quizData = [
    {
        question: "Q1. 개발자 김강민이 추구하는 아키텍처 상상과 시뮬레이션이 가장 극대화되는 무아지경의 장소는 어디일까요?",
        options: ["A. 싸피 멀티캠퍼스 강의실", "B. 물줄기 아래 서 있는 샤워실", "C. 강남역 KFC 매장 안", "D. 매일 아침 지하철 지옥철 안"],
        answer: 1 // B. 물줄기 아래 서 있는 샤워실
    },
    {
        question: "Q2. 김강민 개발자가 지치거나 공부가 막힐 때 회복 탄력성을 얻기 위해 가동하는 신체 제어 동력은 무엇일까요?",
        options: ["A. 방울토마토 샐러드 먹기", "B. 침대에 누워서 유튜브 보기", "C. 플레이리스트 음악 감상 및 런닝", "D. 밤새워 알고리즘 문제 풀기"],
        answer: 2 // C. 플레이리스트 음악 감상 및 런닝
    },
    {
        question: "Q3. 김강민 개발자가 SSAFY 동기들과 함께 맞이하고 싶다고 밝힌 가장 이상적이고 영광스러운 최고의 엔딩 아웃풋은?",
        options: ["A. 낙오 없는 전원 무사 수료증 수령", "B. 원하는 드림 컴퍼니로 '조기 취업' 퇴소", "C. 싸피 자율 프로젝트 전국 1등 상장", "D. 백엔드 아키텍처 특허 출원"],
        answer: 1 // B. 원하는 드림 컴퍼니로 '조기 취업' 퇴소
    }
];

let currentQuizIndex = 0;
let userPoints = 0;

// 게이미피케이션 상태 업데이트 렌더러
function updateGamificationUI() {
    // 1. 포인트 텍스트 업데이트
    const pointsElem = document.getElementById('current-points');
    if (pointsElem) pointsElem.innerText = String(userPoints).padStart(3, '0');

    // 2. 진행률 바 계산 및 반영 (총 3문제 기준 비율 계산)
    const totalQuizzes = quizData.length;
    const progressPercent = Math.min(Math.round((currentQuizIndex / totalQuizzes) * 100), 100);
    
    const barElem = document.getElementById('quest-progress');
    const textElem = document.getElementById('progress-text');
    if (barElem) barElem.style.width = `${progressPercent}%`;
    if (textElem) textElem.innerText = `${progressPercent}%`;

    // 3. 점수 조건에 따른 뱃지 해제 검증 및 잠금 스위칭
    if (userPoints >= 30) document.getElementById('badge-1')?.classList.add('unlocked');
    if (userPoints >= 60) document.getElementById('badge-2')?.classList.add('unlocked');
    if (userPoints >= 90) {
        document.getElementById('badge-3')?.classList.add('unlocked');
        // 올클리어 보너스 최종 히든 뱃지 개방
        document.getElementById('badge-4')?.classList.add('unlocked');
    }
}

// 개별 퀴즈 화면 드로잉 함수
function loadQuizQuestion() {
    const quizBox = document.getElementById('quiz-box');
    if (!quizBox) return; // 해당 페이지(gamification.html)가 아니면 함수 이탈

    // 모든 문제를 다 푼 상태 검기
    if (currentQuizIndex >= quizData.length) {
        quizBox.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
                <h3 style="color: var(--oasis-accent); font-size: 1.5rem; margin-bottom: 12px;">🎉 QUEST CLEAR! 🎉</h3>
                <p style="color: var(--text-sub); line-height: 1.6;">
                    김강민 개발자에 대한 분석 동기화 퀘스트를 성공적으로 완료하셨습니다.<br>
                    획득한 뱃지와 포인트 특전은 연동된 시스템에 영구히 귀속 보존됩니다.
                </p>
            </div>
        `;
        return;
    }

    const currentQuiz = quizData[currentQuizIndex];
    
    // 구조적 HTML 문자열 동적 조립
    let optionsHtml = '';
    currentQuiz.options.forEach((option, idx) => {
        optionsHtml += `<button class="option-btn" onclick="handleQuizAnswer(${idx})">${option}</button>`;
    });

    quizBox.innerHTML = `
        <div class="quiz-question">${currentQuiz.question}</div>
        <div class="quiz-options">
            ${optionsHtml}
        </div>
    `;
}

// 답안 선택 핸들러 액션
function handleQuizAnswer(selectedIndex) {
    const currentQuiz = quizData[currentQuizIndex];

    if (selectedIndex === currentQuiz.answer) {
        userPoints += 30; // 정답 시 30 포인트 누적
        alert("🟢 정답입니다! 시스템 동기화 데이터 로그 (+30 EXP)");
    } else {
        alert("❌ 오답입니다! 시스템 핵심 코어 분석을 다시 읽어보세요.");
    }

    currentQuizIndex++; // 다음 문항 인덱스로 시프트
    updateGamificationUI();
    loadQuizQuestion();
}

// DOM 생성이 완료된 후 초기 시동 트리거 바인딩
document.addEventListener('DOMContentLoaded', () => {
    // 게이미피케이션 시스템 리셋 및 첫 문항 로드
    updateGamificationUI();
    loadQuizQuestion();
});