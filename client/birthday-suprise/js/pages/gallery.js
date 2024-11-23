class GalleryPage {
    constructor() {
        this.initialized = false;
        this.switching = false;
        this.currentMainIndex = 0;
    }

    init() {
        this.destroy();

        const galleryPage = $('.gallery-page');
        galleryPage.html(`
            <div class="gallery-container">
                <div class="main-photo-container">
                    ${this.createMainPhoto(0)}
                </div>
                <div class="thumb-photos-container">
                    ${this.createThumbPhotos()}
                </div>
            </div>
            <div class="scroll-hint"></div>
        `);

        this.bindEvents();
        this.loadImages();
        this.animateItemsIn();

        this.initialized = true;
    }

    createMainPhoto(index) {
        const image = CONFIG.GALLERY_IMAGES[index];
        return `
            <div class="gallery-item loading">
                <img src="${image.url}" alt="${image.title}">
                <div class="photo-title">${image.title}</div>
            </div>
        `;
    }

    createThumbPhotos() {
        return CONFIG.GALLERY_IMAGES.map((image, index) => {
            if (index === 0) return ''; // 跳过第一张，因为它在主图位置
            return `
                <div class="gallery-item loading" data-index="${index}">
                    <img src="${image.url}" alt="${image.title}">
                </div>
            `;
        }).join('');
    }

    switchPhotos(thumbElement) {
        if (this.switching) return;
        this.switching = true;

        const thumbIndex = $(thumbElement).data('index');
        const mainContainer = $('.main-photo-container');
        const thumbContainer = $(thumbElement);

        // 创建动画克隆
        const mainClone = mainContainer.find('.gallery-item').clone();
        const thumbClone = thumbContainer.clone();

        // 获取位置信息
        const mainRect = mainContainer[0].getBoundingClientRect();
        const thumbRect = thumbContainer[0].getBoundingClientRect();

        // 设置克隆元素样式
        [mainClone, thumbClone].forEach(clone => {
            clone.css({
                position: 'fixed',
                width: clone.width(),
                height: clone.height(),
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 100
            });
        });

        mainClone.css({
            top: mainRect.top,
            left: mainRect.left
        });

        thumbClone.css({
            top: thumbRect.top,
            left: thumbRect.left
        });

        // 添加克隆元素到页面
        $('body').append(mainClone).append(thumbClone);

        // 隐藏原始元素
        mainContainer.find('.gallery-item').css('opacity', 0);
        thumbContainer.css('opacity', 0);

        // 执行切换动画
        requestAnimationFrame(() => {
            mainClone.css({
                top: thumbRect.top,
                left: thumbRect.left,
                width: thumbRect.width,
                height: thumbRect.height
            });

            thumbClone.css({
                top: mainRect.top,
                left: mainRect.left,
                width: mainRect.width,
                height: mainRect.height
            });

            // 动画完成后更新内容
            setTimeout(() => {
                // 更新主图
                mainContainer.html(this.createMainPhoto(thumbIndex));
                
                // 更新缩略图（完全替换，而不是只更新src）
                const oldMainImage = CONFIG.GALLERY_IMAGES[this.currentMainIndex];
                thumbContainer.replaceWith(`
                    <div class="gallery-item loading" data-index="${this.currentMainIndex}">
                        <img src="${oldMainImage.url}" alt="${oldMainImage.title}">
                    </div>
                `);

                // 更新索引
                this.currentMainIndex = thumbIndex;

                // 显示原始元素
                mainContainer.find('.gallery-item').css('opacity', 1);
                $('.thumb-photos-container .gallery-item').css('opacity', 1);

                // 移除克隆元素
                mainClone.remove();
                thumbClone.remove();

                this.switching = false;
            }, 800);
        });
    }

    bindEvents() {
        $('.thumb-photos-container').on('click', '.gallery-item', (e) => {
            if (!this.switching) {
                this.switchPhotos(e.currentTarget);
            }
        });
    }

    loadImages() {
        $('.gallery-item img').each((index, img) => {
            img.onload = () => {
                $(img).parent().removeClass('loading');
            };
        });
    }

    animateItemsIn() {
        $('.gallery-item').each((index, item) => {
            const $item = $(item);
            // 添加初始动画类
            $item.addClass('init-animate');
            
            setTimeout(() => {
                $item.addClass('animate-in');
                // 动画完成后移除初始动画类
                setTimeout(() => {
                    $item.removeClass('init-animate');
                }, 300);
            }, index * 200);
        });
    }

    destroy() {
        $('.thumb-photos-container').off('click');
        this.switching = false;
        this.currentMainIndex = 0;
        this.initialized = false;
    }
}

window.galleryPage = new GalleryPage(); 