/**
 * Algrowithm 공통 헤더 컴포넌트
 * 모든 페이지에서 동일한 헤더를 사용하기 위한 JavaScript 모듈
 */

// 헤더 HTML 생성 함수
function getHeaderHTML(options = {}) {
    const {
        showStartButton = true,  // 시작하기 버튼 표시 여부
        startButtonLink = 'workbook_1.html'  // 시작하기 버튼 링크
    } = options;

    const startButton = showStartButton ? `
        <a href="${startButtonLink}"
            class="px-6 py-2.5 bg-text-dark text-white rounded-full text-sm font-bold hover:bg-soft-gold transition-all duration-300 shadow-lg flex items-center gap-2">
            <i class="fa-solid fa-pen-nib"></i>
            <span>시작하기</span>
        </a>
    ` : '';

    return `
    <nav class="fixed w-full z-50 header-blur transition-all duration-300" id="navbar">
        <div class="w-full px-[60px] py-3 flex justify-between items-center">
            <a href="/" class="flex items-center gap-3">
                <img src="./assets/logo.svg" alt="Logo" class="w-10 h-10">
                <span class="text-2xl font-serif font-bold tracking-tight">Algrowithm</span>
            </a>

            <div class="flex items-center gap-10">
                <div class="hidden md:flex items-center gap-12 text-lg font-medium text-gray-700">
                    <a href="about.html" class="hover:text-soft-gold transition-colors">About</a>

                    <div class="dropdown">
                        <button class="hover:text-soft-gold transition-colors flex items-center gap-1">
                            실습
                            <i class="fa-solid fa-chevron-down text-[12px] ml-1"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="workbook_1.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">01</span> 나는 누구인가
                            </a>
                            <a href="workbook_2.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">02</span> 이미지 아이덴티티
                            </a>
                            <a href="workbook_3.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">03</span> 커리어 브랜딩
                            </a>
                            <a href="workbook_4.html" class="dropdown-item">
                                <span class="text-soft-gold font-bold mr-2">04</span> 내가 원하는 삶
                            </a>
                            <div class="border-t border-gray-100 my-2"></div>
                            <a href="prompt-studio.html" class="dropdown-item">
                                <i class="fa-solid fa-wand-magic-sparkles text-soft-gold mr-2"></i> 웹사이트 생성 프롬프트
                            </a>
                            <a href="ebook-generator.html" class="dropdown-item">
                                <i class="fa-solid fa-pen-fancy text-soft-gold mr-2"></i> E-book 프롬프트
                            </a>
                            <a href="ebook-pdf-generator.html" class="dropdown-item">
                                <i class="fa-solid fa-file-pdf text-soft-gold mr-2"></i> E-book PDF 생성
                            </a>
                        </div>
                    </div>

                    <a href="schedule.html" class="hover:text-soft-gold transition-colors">일정</a>
                </div>

                ${startButton}
            </div>
        </div>
    </nav>
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
    // 헤더를 삽입할 위치 찾기
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = getHeaderHTML(options);
    } else {
        // placeholder가 없으면 body 맨 앞에 삽입
        document.body.insertAdjacentHTML('afterbegin', getHeaderHTML(options));
    }

    // 스타일이 없으면 추가
    if (!document.querySelector('#header-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'header-styles';
        styleElement.textContent = getHeaderStyles();
        document.head.appendChild(styleElement);
    }
}

// DOM 준비되면 자동 초기화 (data-auto-header 속성이 있는 경우)
document.addEventListener('DOMContentLoaded', () => {
    const autoInit = document.querySelector('[data-auto-header]');
    if (autoInit) {
        const showStartButton = autoInit.dataset.showStartButton !== 'false';
        const startButtonLink = autoInit.dataset.startButtonLink || 'workbook_1.html';
        initHeader({ showStartButton, startButtonLink });
    }
});

// 모듈 내보내기 (ES Module 지원 환경)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getHeaderHTML, getHeaderStyles, initHeader };
}
