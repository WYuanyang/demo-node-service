class WelcomePage {
    constructor() {
        this.initialized = false;
        this.lottiePlayer = null;
        this.loadingComplete = false;
    }

    async init() {
        if (this.initialized) return;

        // 更新欢迎页面的HTML结构
        const welcomePage = $('.welcome-page');

        // 更新文字区域
        const welcomeText = welcomePage.find('.welcome-text');
        welcomeText.html(`
            <div class="welcome-title">${CONFIG.WELCOME_TEXT.title}</div>
            <div class="welcome-subtitle">
                ${CONFIG.WELCOME_TEXT.subtitle.map(line => 
                    `<div class="welcome-subtitle-line">${line}</div>`
                ).join('')}
            </div>
        `);

        // 初始化Lottie动画
        this.lottiePlayer = welcomePage.find('dotlottie-player')[0];
        
        try {
            // 等待加载动画完成
            await this.initLoadingOverlay();
            this.loadingComplete = true;
            
            // 加载完成后再显示欢迎文字
            this.showWelcomeText();
        } catch (error) {
            console.error('Error during initialization:', error);
        }

        this.initialized = true;
    }

    initLoadingOverlay() {
        return new Promise((resolve) => {
            const overlay = $('.loading-overlay');
            const loadingText = overlay.find('.loading-text');
            
            // 将文字拆分成单个字符并添加动画类
            const text = loadingText.text();
            const chars = text.split('');
            loadingText.empty();  // 清空原有文本
            chars.forEach((char, index) => {
                loadingText.append(`<span class="jump-char">${char}</span>`);
            });
            
            // 模拟加载进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        overlay.fadeOut(500, () => {
                            overlay.remove();
                            resolve();
                        });
                    }, 500);
                }
                $('.loading-bar').css('width', `${progress}%`);
            }, 200);
        });
    }

    showWelcomeText() {
        // 确保加载完成后才显示文字
        if (!this.loadingComplete) return;

        const welcomeText = $('.welcome-text');
        const title = welcomeText.find('.welcome-title');
        const subtitleLines = welcomeText.find('.welcome-subtitle-line');

        // 显示文本容器
        welcomeText.addClass('show');

        // 添加打字完成的类
        setTimeout(() => {
            title.addClass('typed shine');
        }, 1000);

        // 为每行副标题设置递增的延迟
        subtitleLines.each((index, line) => {
            setTimeout(() => {
                $(line).addClass('typed shine');
            }, 2000 + (index * 1500)); // 每行间隔1.5秒
        });
    }

    destroy() {
        if (this.lottiePlayer) {
            this.lottiePlayer.destroy();
        }
    }
}

// 注册到全局应用
window.welcomePage = new WelcomePage(); 