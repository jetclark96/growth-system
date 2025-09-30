// 统一数据管理系统
class DataManager {
    constructor() {
        this.consultations = this.loadConsultations();
        this.enrollments = this.loadEnrollments();
        this.initializeEventListeners();
    }

    // 加载咨询数据
    loadConsultations() {
        try {
            const saved = localStorage.getItem('consultations');
            if (saved) {
                const data = JSON.parse(saved);
                // 验证数据格式
                if (Array.isArray(data)) {
                    return data.filter(item => item && item.id && item.name); // 过滤无效数据
                }
            }
        } catch (error) {
            console.error('加载咨询数据失败:', error);
        }

        // 返回初始示例数据
        return [
            {
                id: Date.now() - 1000000,
                name: '李女士',
                phone: '138****8888',
                shopType: '餐饮美食',
                city: '成都',
                status: 'new',
                content: '想了解如何提升火锅店的复购率，目前主要依赖美团，成本越来越高。希望能建立自己的私域流量。',
                createdAt: new Date(Date.now() - 300000).toISOString(),
                avatar: '李'
            },
            {
                id: Date.now() - 900000,
                name: '王先生',
                phone: '186****6666',
                shopType: '美容美发',
                city: '杭州',
                status: 'processing',
                content: '美发店开了3年，客户流失严重，想学习如何做客户维护和社群运营。',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                avatar: '王'
            }
        ];
    }

    // 加载报名数据
    loadEnrollments() {
        try {
            const saved = localStorage.getItem('enrollments');
            if (saved) {
                const data = JSON.parse(saved);
                if (Array.isArray(data)) {
                    return data.filter(item => item && item.id && item.name); // 过滤无效数据
                }
            }
        } catch (error) {
            console.error('加载报名数据失败:', error);
        }
        return [];
    }

    // 保存咨询数据
    saveConsultations() {
        try {
            localStorage.setItem('consultations', JSON.stringify(this.consultations));
            this.notifyAdminUpdate('consultations');
        } catch (error) {
            console.error('保存咨询数据失败:', error);
            // 如果存储空间不足，尝试清理旧数据
            this.cleanupOldData();
        }
    }

    // 保存报名数据
    saveEnrollments() {
        try {
            localStorage.setItem('enrollments', JSON.stringify(this.enrollments));
            this.notifyAdminUpdate('enrollments');
        } catch (error) {
            console.error('保存报名数据失败:', error);
            this.cleanupOldData();
        }
    }

    // 清理旧数据
    cleanupOldData() {
        try {
            // 只保留最近1000条咨询记录
            if (this.consultations.length > 1000) {
                this.consultations = this.consultations.slice(0, 1000);
                localStorage.setItem('consultations', JSON.stringify(this.consultations));
            }

            // 只保留最近500条报名记录
            if (this.enrollments.length > 500) {
                this.enrollments = this.enrollments.slice(0, 500);
                localStorage.setItem('enrollments', JSON.stringify(this.enrollments));
            }
        } catch (error) {
            console.error('清理数据失败:', error);
        }
    }

    // 添加新咨询
    addConsultation(data) {
        const consultation = {
            id: Date.now(),
            name: data.name,
            phone: data.phone,
            shopType: data.shopType,
            content: data.content || '',
            city: data.city || this.extractCityFromContent(data.content) || '未填写',
            status: 'new',
            createdAt: new Date().toISOString(),
            avatar: data.name.charAt(0)
        };

        this.consultations.unshift(consultation);
        this.saveConsultations();
        return consultation;
    }

    // 从内容中提取城市信息的辅助方法
    extractCityFromContent(content) {
        if (!content) return null;

        const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都', '重庆', '武汉', '西安', '天津', '青岛', '大连', '厦门', '宁波', '无锡', '长沙', '郑州', '济南', '福州', '合肥', '昆明', '南宁', '贵阳', '石家庄', '太原', '沈阳', '长春', '哈尔滨', '兰州', '西宁', '银川', '乌鲁木齐', '呼和浩特', '拉萨', '海口', '三亚'];

        for (const city of cities) {
            if (content.includes(city)) {
                return city;
            }
        }
        return null;
    }

    // 添加新报名
    addEnrollment(data) {
        const enrollment = {
            id: Date.now(),
            name: data.name,
            phone: data.phone,
            wechat: data.wechat,
            shopType: data.shopType,
            status: 'new',
            createdAt: new Date().toISOString(),
            avatar: data.name.charAt(0)
        };

        this.enrollments.unshift(enrollment);
        this.saveEnrollments();
        return enrollment;
    }

    // 更新咨询状态
    updateConsultationStatus(id, status) {
        const consultation = this.consultations.find(c => c.id === id);
        if (consultation) {
            consultation.status = status;
            this.saveConsultations();
            return true;
        }
        return false;
    }

    // 删除咨询记录
    deleteConsultation(id) {
        const index = this.consultations.findIndex(c => c.id === id);
        if (index > -1) {
            this.consultations.splice(index, 1);
            this.saveConsultations();
            return true;
        }
        return false;
    }

    // 更新报名状态
    updateEnrollmentStatus(id, status) {
        const enrollment = this.enrollments.find(e => e.id === id);
        if (enrollment) {
            enrollment.status = status;
            this.saveEnrollments();
            return true;
        }
        return false;
    }

    // 删除报名
    deleteEnrollment(id) {
        const index = this.enrollments.findIndex(e => e.id === id);
        if (index > -1) {
            this.enrollments.splice(index, 1);
            this.saveEnrollments();
            return true;
        }
        return false;
    }

    // 获取统计数据
    getStats() {
        const totalConsultations = this.consultations.length;
        const totalEnrollments = this.enrollments.length;
        const newConsultations = this.consultations.filter(c => c.status === 'new').length;
        const processingConsultations = this.consultations.filter(c => c.status === 'processing').length;
        const completedConsultations = this.consultations.filter(c => c.status === 'completed').length;

        const conversionRate = totalConsultations > 0 ?
            ((totalEnrollments / totalConsultations) * 100).toFixed(1) : '0.0';

        return {
            totalConsultations,
            totalEnrollments,
            newConsultations,
            processingConsultations,
            completedConsultations,
            conversionRate
        };
    }

    // 通知后端管理页面更新
    notifyAdminUpdate(type) {
        // 使用 localStorage 事件通知其他标签页
        localStorage.setItem('admin_update', JSON.stringify({
            type: type,
            timestamp: Date.now()
        }));
        // 立即清除，这样会触发 storage 事件
        localStorage.removeItem('admin_update');
    }

    // 初始化事件监听
    initializeEventListeners() {
        // 监听 storage 事件以实现页面间通信
        window.addEventListener('storage', (e) => {
            if (e.key === 'admin_update') {
                // 重新加载数据
                this.consultations = this.loadConsultations();
                this.enrollments = this.loadEnrollments();

                // 如果当前页面是管理页面，更新显示
                if (typeof window.updateAdminDisplay === 'function') {
                    window.updateAdminDisplay();
                }
            }
        });
    }

    // 搜索咨询记录
    searchConsultations(query, statusFilter, typeFilter) {
        let results = [...this.consultations];

        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(c =>
                c.name.toLowerCase().includes(searchTerm) ||
                c.phone.includes(searchTerm) ||
                c.content.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter) {
            results = results.filter(c => c.status === statusFilter);
        }

        if (typeFilter) {
            results = results.filter(c => c.shopType === typeFilter);
        }

        return results;
    }

    // 导出报名数据为Excel格式的数组
    exportEnrollments() {
        return this.enrollments.map(e => ({
            姓名: e.name,
            电话: e.phone,
            微信号: e.wechat,
            店铺类型: e.shopType,
            状态: this.getEnrollmentStatusText(e.status),
            报名时间: new Date(e.createdAt).toLocaleString('zh-CN')
        }));
    }

    // 获取报名状态文本
    getEnrollmentStatusText(status) {
        const statusMap = {
            'new': '新报名',
            'confirmed': '已确认',
            'completed': '已完成'
        };
        return statusMap[status] || status;
    }

    // 批量更新状态
    batchUpdateStatus(ids, status) {
        let updated = 0;
        ids.forEach(id => {
            if (this.updateConsultationStatus(id, status)) {
                updated++;
            }
        });
        return updated;
    }

    // 创建或获取聊天会话
    createOrGetChatSession(userInfo) {
        // 首先尝试通过手机号匹配现有咨询或报名记录
        let existingRecord = this.consultations.find(c => c.phone === userInfo.phone) ||
                            this.enrollments.find(e => e.phone === userInfo.phone);

        const userId = existingRecord ?
                      `user_${existingRecord.phone.replace(/\D/g, '')}` :
                      `temp_${Date.now()}`;

        const userName = existingRecord ? existingRecord.name : userInfo.name;

        return {
            userId,
            userName,
            userInfo: {
                ...userInfo,
                name: userName
            },
            linkedConsultation: this.consultations.find(c => c.phone === userInfo.phone),
            linkedEnrollment: this.enrollments.find(e => e.phone === userInfo.phone)
        };
    }

    // 根据用户ID获取关联的咨询和报名记录
    getUserLinkedRecords(userId) {
        const phone = this.extractPhoneFromUserId(userId);
        if (!phone) return { consultation: null, enrollment: null };

        return {
            consultation: this.consultations.find(c => c.phone.includes(phone)),
            enrollment: this.enrollments.find(e => e.phone.includes(phone))
        };
    }

    // 从用户ID提取手机号
    extractPhoneFromUserId(userId) {
        if (userId.startsWith('user_')) {
            return userId.replace('user_', '');
        }
        return null;
    }

    // 获取用户显示名称
    getUserDisplayName(userId, defaultName = '访客') {
        const linkedRecords = this.getUserLinkedRecords(userId);
        return linkedRecords.consultation?.name ||
               linkedRecords.enrollment?.name ||
               defaultName;
    }

    // 批量删除
    batchDelete(ids) {
        let deleted = 0;
        ids.forEach(id => {
            if (this.deleteConsultation(id)) {
                deleted++;
            }
        });
        return deleted;
    }
}

// 创建全局数据管理实例
window.dataManager = new DataManager();