document.addEventListener('DOMContentLoaded', () => {
    // 生成星星背景
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        const numberOfStars = 200;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 随机位置
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // 随机大小
            const size = Math.random() * 3;
            
            // 随机动画持续时间和初始透明度
            const duration = 2 + Math.random() * 3;
            const initialOpacity = 0.2 + Math.random() * 0.8;
            
            star.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                --duration: ${duration}s;
                --initial-opacity: ${initialOpacity};
            `;
            
            starsContainer.appendChild(star);
        }
    }

    // 修改流星��成函数
    function createShootingStars() {
        const decorations = document.querySelector('.decorations');
        
        function createStar() {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            
            // 随机起始位置
            const startY = Math.random() * 50;
            star.style.top = `${startY}%`;
            
            decorations.appendChild(star);
            
            // 动画结束后移除元素
            star.addEventListener('animationend', () => {
                star.remove();
                
                // 随机延迟后创建下一个流星
                setTimeout(createStar, Math.random() * 3000 + 2000); // 2-5秒的随机间隔
            });
        }

        // 创建第一个流星
        createStar();
    }

    // 初始化背景效果
    createStars();
    createShootingStars();

    // 修改这里：将日期字符串解析为 iOS 兼容的格式
    const targetDate = (() => {
        const dateStr = CONFIG.BIRTHDAY.date; // 例如 "2024-11-23 00:00:00"
        // 将日期字符串转换为 iOS 兼容的格式
        const [datePart, timePart] = dateStr.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':');
        
        // 月份需要减1，因为 Date 构造函数中月份是从0开始的
        return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    })();

    let countdownInterval;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // 计算天、时、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 更新显示
        const hoursElement = document.querySelector('.time.hours');
        const minutesElement = document.querySelector('.time.minutes');
        const secondsElement = document.querySelector('.time.seconds');
        
        if (distance < 0) {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            
            // 倒计时结束显示
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            
            // 更新标题
            const titleElement = document.querySelector('.title');
            if (titleElement) {
                titleElement.textContent = '生日快乐！';
            }
            
            // 显示进入按钮
            const enterBtn = document.querySelector('.enter-btn');
            if (enterBtn) {
                enterBtn.style.display = 'block';
                enterBtn.style.animation = 'fade-in 1s ease-out forwards';
                setTimeout(() => {
                    enterBtn.style.animation = 'float 3s ease-in-out infinite';
                }, 1000);
            }
        } else {
            // 正常更新倒计时
            if (hoursElement && minutesElement && secondsElement) {
                const totalHours = days * 24 + hours;
                hoursElement.textContent = totalHours.toString().padStart(2, '0');
                minutesElement.textContent = minutes.toString().padStart(2, '0');
                secondsElement.textContent = seconds.toString().padStart(2, '0');
            }
        }
    }
    
    // 先运行一次更新
    updateCountdown();
    // 然后设置定时器
    countdownInterval = setInterval(updateCountdown, 1000);
    
    // 按钮点击事件
    const enterBtn = document.querySelector('.enter-btn');
    enterBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}); 