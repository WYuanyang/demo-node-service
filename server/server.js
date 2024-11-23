const express = require("express");
const app = express();
const path = require("path");
const wechatService = require("./utils/wechatService");
// const cors = require('cors');
const PORT = 8888;
const http = require("http");
const server = http.createServer(app);
// 手动添加 CORS 头
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://demo.jsh5css.cn");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // 处理 OPTIONS 请求
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 添加 body-parser 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 内存存储
const memoryStore = {
  verificationCodes: new Map(), // 存储验证码
  users: new Map(), // 存储用户
};

// 定义客户端根目录
const CLIENT_DIR = path.join(__dirname, "..", "client");

// 路由配置
const routes = {
  "/": "index.html",
  "/birthday/": "birthday-suprise/index.html",
  "/birthday/suprise": "birthday-suprise/main.html",
};

// 先注册具体路由
Object.entries(routes).forEach(([route, filePath]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(CLIENT_DIR, filePath));
  });
});

// 然后配置静态文件服务
app.use(
  "/birthday",
  express.static(path.join(CLIENT_DIR, "birthday-suprise"))
);

// 主静态文件服务
app.use(express.static(CLIENT_DIR));

// 发送红包通知
app.post("/api/send-redpacket-notification", async (req, res) => {
  try {
    const { price } = req.body;

    // 验证金额格式
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "无效的金额" });
    }

    // 发送微信模板消息
    await wechatService.sendRedPacketNotification(price);

    res.json({ message: "红包通知已发送" });
  } catch (error) {
    console.error("发送红包通知错误:", error);
    res.status(500).json({ error: "发送红包通知失败" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
