<template>
  <div class="home">

    <!-- Ai 面板内容 -->
    <div v-if="currentApp === 'ILST'" class="ILST">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ai页面才能显示</h2>
      </div>
    </div>

    <!-- Ae 面板内容 -->
    <div v-if="currentApp === 'AEFT'" class="AEFT">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ae页面正常显示</h2>
      </div>
    </div>

    <!-- 当应用为未知版本时的 UI 页面 -->
    <div v-if="currentApp === '未知版本'" class="NotVersion">
      <div class="settings">
        <div class="login">
          <div class="userLogin">

            <!-- 用户登录图标 -->
            <div class="userLoginIcon">
              <el-avatar :src="userIconImage" alt="用户头像"></el-avatar>
            </div>
          </div>
        </div>

        <!-- 显示应用的日志信息 -->
        <div class="log">
          <span>当前应用: {{ adobeAppName }}</span><br>
          <span>当前ID: {{ adobeAppId }}</span><br>
          <span>当前语言: {{ adobeAppLocale }}</span><br>
          <span>当前版本: {{ adobeAppVersion }}</span><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入用户头像图片
import userIconImage from "@/assets/userIcon.jpg";

export default {
  data() {
    return {
      // 当前Adobe应用的名称
      adobeAppName: "未知应用",
      // 当前Adobe应用的ID
      adobeAppId: "未知ID",
      // 当前Adobe应用的语言设置
      adobeAppLocale: "未知语言",
      // 当前Adobe应用的版本号
      adobeAppVersion: "未知版本",
      // 当前应用的名称或标识
      currentApp: "未知版本",
      // 用户头像图片路径
      userIconImage
    };
  },

  // 当组件挂载完成后，检测当前运行的Adobe应用
  mounted() {
    this.detectApplication();
  },

  methods: {
    // 检测当前运行的Adobe应用并更新相关数据
    detectApplication() {
      // 实例化CSInterface对象
      const csInterface = new CSInterface();
      // 获取宿主环境信息
      const hostEnv = csInterface.hostEnvironment;

      // 如果获取到了宿主环境信息
      if (hostEnv) {
        // 根据应用名称设置adobeAppName和currentApp的值
        this.adobeAppName = hostEnv.appName === "AEFT" ? "当前应用是 After Effects"
            : hostEnv.appName === "ILST" ? "当前应用是 Illustrator"
                : "未知应用";
        this.currentApp = hostEnv.appName;
        // 设置其他应用相关的数据
        this.adobeAppId = hostEnv.appId || "未知ID";
        this.adobeAppLocale = hostEnv.appLocale || "未知语言";
        this.adobeAppVersion = hostEnv.appVersion || "未知版本";
      }
    }
  }
}
</script>
