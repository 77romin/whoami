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