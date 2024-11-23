class CardPage {
    constructor() {
        this.initialized = false;
        this.handleCardClick = this.handleCardClick.bind(this);
    }

    init() {
        this.destroy();

        const cardPage = $('.card-page');
        cardPage.html(`
            <div class="card-container">
                <div class="card-front">
                    <div class="card-decoration">
                        ${this.createSparkles()}
                    </div>
                    <h2 class="card-title">生日快乐</h2>
                    <p class="card-hint">点击翻转卡片</p>
                </div>
                <div class="card-back">
                    <div class="card-back-decoration">
                        ${this.createBackDecorations()}
                    </div>
                    <div class="card-content">
                        ${this.createTextLines(CONFIG.CARD_TEXT)}
                    </div>
                </div>
            </div>
            <div class="scroll-hint"></div>
        `);

        this.bindEvents();

        this.initialized = true;
    }

    handleCardClick() {
        const cardContainer = $('.card-container');
        const cardPage = $('.card-page');
        
        cardContainer.toggleClass('flipped');
        if (cardContainer.hasClass('flipped')) {
            const textLines = cardContainer.find('.text-line');
             
            textLines.each((index, line) => {
                const $line = $(line);
                const typingDelay = 500 + index * 1500;
                const typingDuration = 1500;
                
                let st = setTimeout(() => {
                    $line.addClass('typing');
                    clearTimeout(st);
                }, typingDelay);
                
                let st2 = setTimeout(() => {
                    $line.removeClass('typing');
                    clearTimeout(st2);
                    
                    if (index === textLines.length - 1) {
                    
                    }
                }, typingDelay + typingDuration);
            });

            // 创建气球动画元素
            const balloonAnimation = $(`
                <div class="balloon-animation">
                    <dotlottie-player
                        src="${CONFIG.ANIMATIONS.balloon}"
                        background="transparent"
                        speed="1"
                        autoplay
                    ></dotlottie-player>
                </div>
            `);

            let st3 = setTimeout(() => {
                cardPage.prepend(balloonAnimation);
                clearTimeout(st3);
            }, 500);
        } else {
            const balloonAnimation = cardPage.find('.balloon-animation');
            if (balloonAnimation.length) {
                balloonAnimation.remove();
            }
        }
    }

    bindEvents() {
        const cardContainer = $('.card-container');
        $('.card-page').on('click', '.card-container', this.handleCardClick);
    }

    destroy() {
        $('.card-page').off('click', '.card-container', this.handleCardClick);
        this.initialized = false;
    }

    createBackDecorations() {
        let decorations = '';
        
        for (let i = 0; i < 5; i++) {
            const left = Math.random() * 60 + 20;
            const top = Math.random() * 60 + 20;
            decorations += `
                <div class="floating-heart" style="--delay: ${i * 1.5}s; left: ${left}%; top: ${top}%;">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>`;
        }
        
        for (let i = 0; i < 5; i++) {
            const left = Math.random() * 60 + 20;
            const top = Math.random() * 60 + 20;
            decorations += `<div class="floating-star" style="--delay: ${i * 1.2}s; left: ${left}%; top: ${top}%;"></div>`;
        }
        
        for (let i = 0; i < 8; i++) {
            const left = Math.random() * 60 + 20;
            const top = Math.random() * 60 + 20;
            decorations += `<div class="floating-circle" style="--delay: ${i * 1}s; left: ${left}%; top: ${top}%;"></div>`;
        }
        
        return decorations;
    }

    createTextLines(texts) {
        return texts.map(text => `<div class="text-line">${text}</div>`).join('');
    }

    createSparkles() {
        let sparkles = '';
        for (let i = 0; i < 20; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 2;
            sparkles += `<div class="card-sparkle" style="left: ${left}%; top: ${top}%; animation-delay: ${delay}s"></div>`;
        }
        return sparkles;
    }
}

window.cardPage = new CardPage(); 