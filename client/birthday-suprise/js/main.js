class BirthdayApp {
    constructor() {
        this.swiper = null;
        this.audioInitialized = false;
        this.currentPage = null;
        this.bgMusic = document.getElementById('bgMusic');
    }

    async init() {
        // 先初始化欢迎页
        await window.welcomePage.init();
        
        // 初始化 Swiper
        this.initSwiper();
        
        // 预加载资源
        await this.preloadResources();

        // 添加音乐控制
        this.initAudioControl();
    }

    initSwiper() {
        this.swiper = new Swiper('.swiper', {
            // 垂直方向
            direction: 'vertical',
            
            // 鼠标滚轮
            mousewheel: true,
            
            // 触摸移动
            touchRatio: 1,
            touchAngle: 45,
            
            // 动画效果
            speed: 700,
            effect: 'slide',
            
            // 页面切换回调
            on: {
                slideChange: () => {
                    this.handlePageChange();
                },
                slideChangeTransitionEnd: () => {
                    this.handlePageChangeComplete();
                }
            }
        });
    }

    handlePageChange() {
        const index = this.swiper.activeIndex;
        const pageType = $(this.swiper.slides[index]).data('anchor');
        
        // 清理前一个页面
        if (this.currentPage) {
            switch(this.currentPage) {
                case 'card':
                    window.cardPage.destroy?.();
                    break;
                case 'gallery':
                    window.galleryPage.destroy?.();
                    break;
                case 'game':
                    window.gamePage.destroy?.();
                    break;
                case 'gift':
                    window.giftPage.destroy?.();
                    break;
            }
        }
        
        // 初始化新页面
        switch(pageType) {
            case 'card':
                window.cardPage.init();
                break;
            case 'gallery':
                window.galleryPage.init();
                break;
            case 'game':
                window.gamePage.init();
                break;
            case 'gift':
                window.giftPage.init();
                break;
        }
        
        this.currentPage = pageType;
    }

    handlePageChangeComplete() {
        // 页面切换完成后的处理
    }

    // 添加预加载资源方法
    async preloadResources() {
        try {
            // 预加载 Lottie 动画
            for (const [key, path] of Object.entries(CONFIG.ANIMATIONS)) {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Failed to load animation: ${path}`);
                }
                // 对于 .lottie 文件，我们只需要确保它可以被加载
                await response.blob();
            }

            // 预加载图片
            const imageUrls = [
                // 添加需要预加载的图片URL
                ...CONFIG.GALLERY_IMAGES.map(image => image.url)
            ];

            const imagePromises = imageUrls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
            });

            await Promise.all(imagePromises);
            console.log('资源预加载完成');

        } catch (error) {
            console.error('Resource preloading failed:', error);
        }
    }

    initAudioControl() {
        // 使用 SVG 图标
        const musicControl = $(`
            <div class="music-control">
                <div class="music-icon">
                    <svg class="mute-icon" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    <div class="playing-notes">
                        <svg class="note-1" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                        <svg class="note-2" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                        <svg class="note-3" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                    </div>
                </div>
            </div>
        `);

        $('body').append(musicControl);

        // 点击事件处理
        $('.music-control').on('click', () => {
            if (this.bgMusic.paused) {
                this.bgMusic.play();
                $('.music-icon').addClass('playing');
                this.audioInitialized = true;  // 标记音频已初始化
            } else {
                this.bgMusic.pause();
                $('.music-icon').removeClass('playing');
            }
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.bgMusic.pause();
                $('.music-icon').removeClass('playing');
            } else if ($('.music-icon').hasClass('playing')) {
                this.bgMusic.play();
            }
        });

        // 移除全局点击事件
        // document.addEventListener('click', () => {
        //     if (!this.audioInitialized) {
        //         this.bgMusic.play();
        //         this.audioInitialized = true;
        //     }
        // }, { once: true });
    }
}

// 当文档加载完成后初始化应用
$(document).ready(async () => {
    window.app = new BirthdayApp();
    await window.app.init();
}); 