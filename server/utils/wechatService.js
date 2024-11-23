const axios = require('axios');
const config = require('../config/wechat');

class WechatService {
    constructor() {
        this.accessToken = null;
        this.accessTokenExpireTime = 0;
    }

    // 获取访问令牌
    async getAccessToken() {
        const now = Date.now();
        if (this.accessToken && now < this.accessTokenExpireTime) {
            return this.accessToken;
        }

        try {
            const response = await axios.get(
                `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
            );

            if (response.data.access_token) {
                this.accessToken = response.data.access_token;
                this.accessTokenExpireTime = now + (response.data.expires_in * 1000) - 60000; // 提前1分钟过期
                return this.accessToken;
            }
            throw new Error('Failed to get access token');
        } catch (error) {
            console.error('获取微信 access_token 失败:', error);
            throw error;
        }
    }

    // 发送验证码模板消息
    async sendVerificationCode(phone, code) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.post(
                `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
                {
                    touser: config.testOpenId,
                    template_id: config.templateId,
                    data: {
                        phone: {
                            value: phone,
                            color: "#173177"
                        },
                        code: {
                            value: code,
                            color: "#173177"
                        },
                        time: {
                            value: new Date().toLocaleString(),
                            color: "#173177"
                        }
                    }
                }
            );

            if (response.data.errcode === 0) {
                console.log('模板消息发送成功');
                return true;
            }
            throw new Error(`发送失败: ${response.data.errmsg}`);
        } catch (error) {
            console.error('发送模板消息失败:', error);
            throw error;
        }
    }

    // 发送红包通知模板消息
    async sendRedPacketNotification(price) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.post(
                `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
                {
                    touser: config.testOpenId,
                    template_id: config.sendRedPacketTemplateId,
                    data: {
                        price: {
                            value: `${price.toFixed(2)}元`,
                            color: "#FF0000"
                        },
                        sendTime: {
                            value: new Date().toLocaleString(),
                            color: "#173177"
                        }
                    }
                }
            );

            if (response.data.errcode === 0) {
                console.log('红包通知发送成功');
                return true;
            }
            throw new Error(`发送失败: ${response.data.errmsg}`);
        } catch (error) {
            console.error('发送红包通知失败:', error);
            throw error;
        }
    }
}

module.exports = new WechatService(); 