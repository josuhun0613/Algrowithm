/**
 * Algrowithm 공통 헤더 컴포넌트
 * 모든 페이지에서 동일한 헤더를 사용하기 위한 JavaScript 모듈
 */

// 햄버거 메뉴 열기
function openMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const btn = document.getElementById('hamburgerBtn');

    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';

    // 햄버거 → X 애니메이션
    const lines = btn.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'translateY(8px) rotate(45deg)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
}

// 햄버거 메뉴 닫기
function closeMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const btn = document.getElementById('hamburgerBtn');

    drawer.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
    document.body.style.overflow = '';

    // X → 햄버거 복원
    const lines = btn.querySelectorAll('.hamburger-line');
    lines[0].style.transform = '';
    lines[1].style.opacity = '';
    lines[2].style.transform = '';
}

// 실습 아코디언 토글
function toggleMobileAccordion() {
    const content = document.getElementById('accordionContent');
    const icon = document.getElementById('accordionIcon');

    content.classList.toggle('hidden');
    icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

// 헤더 HTML 생성 함수
function getHeaderHTML(options = {}) {
    const {
        showStartButton = true,
        startButtonLink = '/workbooks/workbook_1.html'
    } = options;

    const startButton = showStartButton ? `
        <a href="${startButtonLink}"
            class="hidden md:flex px-6 py-2.5 bg-text-dark text-white rounded-full text-sm font-bold hover:bg-soft-gold transition-all duration-300 shadow-lg items-center gap-2">
            <i class="fa-solid fa-pen-nib"></i>
            <span>시작하기</span>
        </a>
    ` : '';

    return `
    <nav class="fixed w-full z-50 header-blur transition-all duration-300" id="navbar">
        <div class="w-full px-5 md:px-[60px] py-3 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 md:gap-3">
                <img src="/assets/logo.svg" alt="Logo" class="w-8 h-8 md:w-10 md:h-10 nav-logo transition-all duration-300">
                <span class="text-xl md:text-2xl font-serif font-bold tracking-tight nav-text">Algrowithm</span>
            </a>

            <div class="flex items-center gap-3 md:gap-10">
                <!-- 데스크탑 내비게이션 -->
                <div class="hidden md:flex items-center gap-12 text-lg font-medium">
                    <a href="/about.html" class="nav-text">About</a>
                    <a href="/program.html" class="nav-text">코칭</a>

                    <div class="dropdown">
                        <button class="nav-text flex items-center gap-1">
                            실습
                            <i class="fa-solid fa-chevron-down text-[12px] ml-1"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/workbooks/workbook_1.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">01</span> 내 안의 빌런을 찾아라
                            </a>
                            <a href="/workbooks/workbook_2.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">02</span> 이미지 아이덴티티
                            </a>
                            <a href="/workbooks/workbook_3.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">03</span> 커리어 브랜딩
                            </a>
                            <a href="/workbooks/workbook_4.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">04</span> 내가 원하는 삶
                            </a>
                            <div class="border-t border-gray-100 my-2"></div>
                            <a href="/tools/prompt-studio.html" class="dropdown-item">
                                <i class="fa-solid fa-wand-magic-sparkles text-soft-gold mr-2"></i> 웹사이트 생성 프롬프트
                            </a>
                            <a href="/tools/ebook-generator.html" class="dropdown-item">
                                <i class="fa-solid fa-pen-fancy text-soft-gold mr-2"></i> E-book 프롬프트
                            </a>
                            <a href="/tools/ebook-pdf-generator.html" class="dropdown-item">
                                <i class="fa-solid fa-file-pdf text-soft-gold mr-2"></i> E-book PDF 생성
                            </a>
                            <a href="/tools/image-studio.html" class="dropdown-item">
                                <i class="fa-solid fa-image text-soft-gold mr-2"></i> AI 이미지 생성
                            </a>
                            <a href="/tools/website-studio.html" class="dropdown-item">
                                <i class="fa-solid fa-code text-soft-gold mr-2"></i> 웹사이트 스튜디오
                            </a>
                        </div>
                    </div>

                    <a href="/lecture.html" class="nav-text">강연</a>
                    <a href="/schedule.html" class="nav-text">일정</a>
                </div>

                ${startButton}

                <!-- 햄버거 버튼 (모바일 전용) -->
                <button id="hamburgerBtn" class="md:hidden w-11 h-11 flex flex-col justify-center items-center gap-[6px] focus:outline-none rounded-xl hover:bg-gray-100 transition-colors" aria-label="메뉴 열기">
                    <span class="hamburger-line block w-6 h-[2px] bg-gray-800 transition-all duration-300 origin-center"></span>
                    <span class="hamburger-line block w-6 h-[2px] bg-gray-800 transition-all duration-300 origin-center"></span>
                    <span class="hamburger-line block w-6 h-[2px] bg-gray-800 transition-all duration-300 origin-center"></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- 모바일 드로어 오버레이 -->
    <div id="mobileDrawerOverlay"
        class="fixed inset-0 bg-black/50 z-[90] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"
        onclick="closeMobileMenu()">
    </div>

    <!-- 모바일 드로어 -->
    <div id="mobileDrawer"
        class="fixed top-0 right-0 h-full w-[280px] bg-white z-[100] transform translate-x-full transition-transform duration-300 ease-in-out md:hidden flex flex-col overflow-y-auto">

        <!-- 드로어 헤더 -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-2">
                <img src="/assets/logo.svg" alt="Logo" class="w-7 h-7">
                <span class="font-serif font-bold text-base">Algrowithm</span>
            </div>
            <button onclick="closeMobileMenu()"
                class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <i class="fa-solid fa-times text-gray-500 text-sm"></i>
            </button>
        </div>

        <!-- 드로어 링크 -->
        <nav class="flex-1 px-3 py-4 space-y-0.5">
            <a href="/about.html"
                class="flex items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-[15px]">
                About
            </a>

            <a href="/program.html"
                class="flex items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-[15px]">
                <i class="fa-solid fa-bookmark text-amber-400 mr-2 text-xs"></i>
                코칭
            </a>

            <!-- 실습 아코디언 -->
            <div>
                <button onclick="toggleMobileAccordion()"
                    class="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-[15px]">
                    <span>실습</span>
                    <i id="accordionIcon" class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300"></i>
                </button>
                <div id="accordionContent" class="hidden mt-0.5 space-y-0.5">
                    <a href="/workbooks/workbook_1.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <span class="text-amber-500 font-bold text-xs shrink-0">01</span>
                        <span>내 안의 빌런을 찾아라</span>
                    </a>
                    <a href="/workbooks/workbook_2.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <span class="text-amber-500 font-bold text-xs shrink-0">02</span>
                        <span>이미지 아이덴티티</span>
                    </a>
                    <a href="/workbooks/workbook_3.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <span class="text-amber-500 font-bold text-xs shrink-0">03</span>
                        <span>커리어 브랜딩</span>
                    </a>
                    <a href="/workbooks/workbook_4.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <span class="text-amber-500 font-bold text-xs shrink-0">04</span>
                        <span>내가 원하는 삶</span>
                    </a>
                    <div class="mx-4 my-1 border-t border-gray-100"></div>
                    <a href="/tools/image-studio.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <i class="fa-solid fa-image text-amber-400 w-3.5 shrink-0"></i>
                        <span>AI 이미지 생성</span>
                    </a>
                    <a href="/tools/prompt-studio.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-400 w-3.5 shrink-0"></i>
                        <span>웹사이트 생성 프롬프트</span>
                    </a>
                    <a href="/tools/ebook-generator.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <i class="fa-solid fa-pen-fancy text-amber-400 w-3.5 shrink-0"></i>
                        <span>E-book 프롬프트</span>
                    </a>
                    <a href="/tools/website-studio.html"
                        class="flex items-center gap-2.5 pl-8 pr-4 py-3 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-sm">
                        <i class="fa-solid fa-code text-amber-400 w-3.5 shrink-0"></i>
                        <span>웹사이트 스튜디오</span>
                    </a>
                </div>
            </div>

            <a href="/lecture.html"
                class="flex items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-[15px]">
                <i class="fa-solid fa-microphone text-amber-400 mr-2 text-xs"></i>
                강연
            </a>

            <a href="/schedule.html"
                class="flex items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-amber-50 hover:text-amber-600 transition-colors text-[15px]">
                일정
            </a>
        </nav>

        <!-- 드로어 CTA -->
        <div class="px-5 py-5 border-t border-gray-100 shrink-0">
            <button
                onclick="closeMobileMenu(); if(typeof openInquiryModal !== 'undefined') openInquiryModal();"
                class="w-full py-4 bg-[#d4af37] text-white rounded-2xl font-bold text-[15px] hover:bg-yellow-600 active:scale-95 transition-all">
                코칭 문의하기 <i class="fa-solid fa-paper-plane ml-1.5 text-sm"></i>
            </button>
        </div>
    </div>
    `;
}

// 헤더 CSS 스타일 (페이지에 없는 경우 추가)
function getHeaderStyles() {
    return `
    /* Header - Glass effect with strong blur */
    .header-blur {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }

    /* 다크 배경 감지 시 헤더 스타일 */
    .header-blur.header-on-dark {
        background: rgba(0, 0, 0, 0.25);
    }

    /* 헤더 텍스트 색상 전환 (기본: 다크 텍스트) */
    #navbar .nav-text { color: #374151; transition: color 0.3s ease; }
    #navbar .nav-text:hover { color: #d4af37; }
    #navbar .hamburger-line { transition: background-color 0.3s ease, transform 0.3s ease; }

    /* 다크 배경 위 헤더 (라이트 텍스트) */
    #navbar.header-on-dark .nav-text { color: rgba(255,255,255,0.9); }
    #navbar.header-on-dark .nav-text:hover { color: #d4af37; }
    #navbar.header-on-dark .hamburger-line { background-color: rgba(255,255,255,0.9); }

    /* Dropdown */
    .dropdown { position: relative; }
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        min-width: 240px;
        padding: 10px 0;
        z-index: 100;
    }
    .dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    .dropdown-item {
        display: block;
        padding: 14px 24px;
        color: #1a1a1a;
        font-size: 15px;
        transition: all 0.2s ease;
    }
    .dropdown-item:hover {
        background: rgba(212, 175, 55, 0.1);
        color: #d4af37;
    }
    `;
}

// 헤더 삽입 함수
function initHeader(options = {}) {
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = getHeaderHTML(options);
    } else {
        document.body.insertAdjacentHTML('afterbegin', getHeaderHTML(options));
    }

    // 스타일이 없으면 추가
    if (!document.querySelector('#header-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'header-styles';
        styleElement.textContent = getHeaderStyles();
        document.head.appendChild(styleElement);
    }

    // 햄버거 버튼 이벤트
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMobileMenu);
    }

    // ESC 키로 드로어 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('mobileDrawer');
            if (drawer && !drawer.classList.contains('translate-x-full')) {
                closeMobileMenu();
            }
        }
    });

    // 배경 밝기 감지 → 헤더 텍스트 색상 자동 전환
    initHeaderBgDetection();
}

/**
 * 헤더 아래 배경의 밝기를 감지하여 header-on-dark 클래스를 토글
 * - 스크롤/리사이즈 시 재계산
 * - elementFromPoint로 헤더 바로 아래 요소의 배경색을 추출
 */
function initHeaderBgDetection() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function getEffectiveBgColor(el) {
        while (el && el !== document.documentElement) {
            const style = getComputedStyle(el);
            const bg = style.backgroundColor;
            const bgImage = style.backgroundImage;

            // 그라데이션이 있으면 첫 번째 색상 추출
            if (bgImage && bgImage !== 'none') {
                const gradientMatch = bgImage.match(/rgba?\(\d+,\s*\d+,\s*\d+/);
                if (gradientMatch) return gradientMatch[0] + ')';
            }

            // 배경색이 투명이 아니면 반환
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                return bg;
            }
            el = el.parentElement;
        }
        // 최종 fallback: html/body 배경
        return getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';
    }

    function getLuminance(colorStr) {
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return 255; // 파싱 실패 시 밝은 것으로 간주
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // 상대 밝기 (perceived luminance)
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    function updateHeaderMode() {
        const rect = navbar.getBoundingClientRect();
        const sampleX = rect.left + rect.width / 2;
        const sampleY = rect.bottom + 2; // 헤더 바로 아래 지점

        // navbar를 잠시 숨겨서 아래 요소를 감지
        navbar.style.pointerEvents = 'none';
        navbar.style.visibility = 'hidden';
        const elBelow = document.elementFromPoint(sampleX, sampleY);
        navbar.style.visibility = '';
        navbar.style.pointerEvents = '';

        if (!elBelow) return;

        const bgColor = getEffectiveBgColor(elBelow);
        const luminance = getLuminance(bgColor);

        // 밝기 128 이하 → 어두운 배경
        if (luminance < 128) {
            navbar.classList.add('header-on-dark');
        } else {
            navbar.classList.remove('header-on-dark');
        }
    }

    // 초기 실행 + 스크롤/리사이즈 이벤트
    updateHeaderMode();
    let ticking = false;
    function onScrollOrResize() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeaderMode();
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
}

// DOM 준비되면 자동 초기화 (data-auto-header 속성이 있는 경우)
document.addEventListener('DOMContentLoaded', () => {
    const autoInit = document.querySelector('[data-auto-header]');
    if (autoInit) {
        const showStartButton = autoInit.dataset.showStartButton !== 'false';
        const startButtonLink = autoInit.dataset.startButtonLink || '/workbooks/workbook_1.html';
        initHeader({ showStartButton, startButtonLink });
    }
});

// 모듈 내보내기 (ES Module 지원 환경)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getHeaderHTML, getHeaderStyles, initHeader, openMobileMenu, closeMobileMenu, toggleMobileAccordion };
}
