const CONFIG = {
  // 生日日期配置
  BIRTHDAY: {
    date: "2024-11-23 00:00:00", // 生日日期
    format: "YYYY-MM-DD HH:mm:ss", // 日期格式
  },

  // 页面配置
  PAGES: ["welcome", "card", "gallery", "game", "gift"],

  // 动画配置
  ANIMATIONS: {
    welcome: "assets/lottie/welcome.lottie",
    loading: "assets/lottie/loading.lottie",
    red_envelope: "assets/lottie/red_envelope.lottie",
    wrong: "assets/lottie/wrong.lottie",
    complete: "assets/lottie/complete.lottie",
    balloon: "assets/lottie/balloon.lottie",
    kiss: "assets/lottie/kiss.lottie",
  },

  // 欢迎页文字配置
  WELCOME_TEXT: {
    title: "亲爱的老婆",
    subtitle: ["今天是你的生日", "让我们一起开启这段浪漫旅程"],
  },

  // 游戏配置
  GAME_QUESTIONS: [
    {
      question: "我们第一次见面是在哪里？",
      options: ["二七塔", "公园", "图书馆", "电影院"],
      correctIndex: 0,
      feedback: "对啦！那天的天空真的很美，就像你一样～",
      reward: "520",
    },
    {
      question: "我最喜欢的颜色是什么？",
      options: ["蓝色", "粉色", "紫色", "红色"],
      correctIndex: 2,
      feedback: "就知道你记得！这就是我们心有灵犀～",
      reward: "1314",
    },
    {
      question: "我们的第一次约会去了哪里？",
      options: ["游乐园", "咖啡厅", "动物园", "植物园"],
      correctIndex: 1,
      feedback: "没错！那天的咖啡香依然记忆犹新～",
      reward: "888",
    },
  ],

  // 卡片文字配置
  CARD_TEXT: [
    "亲爱的老婆",
    "生日快乐！",
    "这是我们在一起后的第12个生日",
    "也是我们认识的第4191天",
    "感谢你一直以来的陪伴和支持",
    "愿你永远快乐、永远美丽",
    "我爱你！",
  ],

  // 图片配置
  GALLERY_IMAGES: [
    {
      url: "assets/images/1.jpg",
      title: "我们的第一张合照",
    },
    {
      url: "assets/images/2.jpg",
      title: "一起看的第一场电影",
    },
    {
      url: "assets/images/3.jpg",
      title: "第一次旅行",
    },
    {
      url: "assets/images/4.jpg",
      title: "最难忘的生日",
    },
    {
      url: "assets/images/5.jpg",
      title: "最浪漫的时刻",
    },
  ],
  // 最后的感谢
  THANK_TEXT: [
    "亲爱的老婆：",
    "感谢你完成了所有的小测验",
    "这些都是我们一起创造的珍贵回忆",
    "每一个瞬间都让我感恩有你在身边",
    "谢谢你选择了我",
    "让我的生活充满色彩",
    "未来的日子，我会更加珍惜",
    "生日快乐，我最爱的人",
  ],
};
