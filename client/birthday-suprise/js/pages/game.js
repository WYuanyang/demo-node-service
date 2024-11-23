class GamePage {
  constructor() {
    this.initialized = false;
    this.currentQuestion = 0;
    this.questions = CONFIG.GAME_QUESTIONS;
    this.timers = new Set();
    this.handleAnswer = this.handleAnswer.bind(this);
  }

  init() {
    this.destroy();

    this.currentQuestion = 0;

    this.showQuestion(0);

    this.initialized = true;
  }

  showQuestion(index) {
    const question = this.questions[index];
    const questionText = $(".question-text");
    const optionsContainer = $(".options-container");
    const progressBar = $(".progress");
    const questionCounter = $(".current");

    questionText.text(question.question);

    optionsContainer.html(
      question.options
        .map(
          (option, optionIndex) => `
            <button class="option-button" data-index="${optionIndex}">
                ${option}
            </button>
        `
        )
        .join("")
    );

    optionsContainer.find(".option-button").on("click", (e) => {
      const optionIndex = parseInt($(e.currentTarget).data("index"));
      this.handleAnswer(optionIndex);
    });

    progressBar.css("width", `${((index + 1) / this.questions.length) * 100}%`);
    questionCounter.text(index + 1);
  }

  handleAnswer(selectedIndex) {
    const question = this.questions[this.currentQuestion];
    const buttons = $(".options-container").find(".option-button");

    buttons.each(function () {
      $(this).prop("disabled", true);
    });

    if (selectedIndex === question.correctIndex) {
      buttons.eq(selectedIndex).addClass("correct");
      this.showFeedback(question.feedback, true);
    } else {
      buttons.eq(selectedIndex).addClass("wrong");
      buttons.eq(question.correctIndex).addClass("correct");
      this.showFeedback("再想想看～", false);
    }

    const timer = setTimeout(() => {
      if (selectedIndex === question.correctIndex) {
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
          this.showQuestion(this.currentQuestion);
        } else {
          this.showGameComplete();
        }
      } else {
        buttons.each(function () {
          $(this).removeClass("wrong", "correct");
          $(this).prop("disabled", false);
        });
      }
    }, 2000);

    this.timers.add(timer);
  }

  showFeedback(text, isCorrect) {
    const feedbackAnimation = document.querySelector('.feedback-container dotlottie-player');
    const feedbackText = $('.feedback-container').find('.feedback-text');
    
    const oldReward = $('.feedback-container').find('.reward-amount');
    if (oldReward.length > 0) {
        oldReward.remove();
    }
    
    feedbackAnimation.load(isCorrect ? 
        CONFIG.ANIMATIONS.red_envelope : 
        CONFIG.ANIMATIONS.wrong
    );
    
    feedbackAnimation.play();
    
    if (isCorrect) {
        // 创建金额显示元素
        const rewardAmount = document.createElement('div');
        rewardAmount.className = 'reward-amount';
        
        // 从配置中获取对应题目的奖励金额
        const targetAmount = parseInt(this.questions[this.currentQuestion].reward);
        
        rewardAmount.innerHTML = `
            <span class="currency">¥</span>
            <span class="number">0</span>
        `;
        
        // 插入到动画和文字之间
        feedbackText.before(rewardAmount);
        
        // 触发动画
        setTimeout(() => {
            rewardAmount.classList.add('show');
            const numberElement = rewardAmount.querySelector('.number');
            
            // 数字滚动动画
            let current = 0;
            const step = Math.ceil(targetAmount / 50); // 将总数分成50步
            const duration = 1000; // 动画持续1秒
            const interval = duration / 50;
            
            const timer = setInterval(() => {
                current = Math.min(current + step, targetAmount);
                numberElement.textContent = current;
                
                if (current >= targetAmount) {
                    clearInterval(timer);
                    numberElement.textContent = targetAmount;
                }
            }, interval);
            
            this.timers.add(timer);
            this.sendWxMessage(targetAmount);
        }, 500);
    }

    feedbackText.text(text);
    $('.feedback-container').css('display', 'block');
    
    const timer = setTimeout(() => {
        $('.feedback-container').css('display', 'none');
    }, 2000);

    this.timers.add(timer);
  }

  showGameComplete() {
    $(".game-container").html(`
            <div class="game-complete">
                <dotlottie-player
                    src="${CONFIG.ANIMATIONS.complete}"
                    background="transparent"
                    speed="1"
                    style="width: 200px; height: 200px;"
                    autoplay
                ></dotlottie-player>
                <div class="complete-text">
                    太棒了！你真了解我～<br>
                    🧧🧧🧧正在向你飞来～<br>
                    继续往下滑动查看惊喜吧！
                </div>
            </div>
        `);
  }
  sendWxMessage(amount) {
    // 使用 jQuery 调用
    $.ajax({
      url: "/api/send-redpacket-notification",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ price: amount }), // 金额，单位：元
      success: function (response) {
        console.log("红包通知发送成功");
      },
      error: function (xhr) {
        console.error("发送失败:", xhr.responseJSON?.error);
      },
    });
  }
  destroy() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();

    $(".options-container").off("click", ".option-button");

    this.currentQuestion = 0;
    this.initialized = false;
  }
}

window.gamePage = new GamePage();
