class GiftPage {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        const giftMessage = document.querySelector('.gift-message');
        if (giftMessage) {
            const messages = CONFIG.THANK_TEXT;

            giftMessage.innerHTML = messages
                .map(text => `<span class="message-line">${text}</span>`)
                .join('');
            const st = setTimeout(() => {
                this.showLottie();
                clearTimeout(st);
            }, 7000);
        }

        this.initialized = true;
    }
    showLottie() {
        $('.gift-box dotlottie-player').css('visibility', 'visible');
        $('.gift-box dotlottie-player')[0].play();
    }
    destroy() {
        // 清理工作
    }
}

window.giftPage = new GiftPage(); 