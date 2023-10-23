<template xmlns="http://www.w3.org/1999/html">
  <div class="home">

    <div class="ILST" v-if="currentApp === 'ILST'">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ai页面才能显示</h2>
      </div>
    </div>

    <div class="AEFT" v-if="currentApp === 'AEFT'">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ae页面正常显示</h2>
      </div>
    </div>

    <div class="NotVersion" v-if="currentApp === '未知版本'">
      <div class="settings">
        <div class="login">
          <div class="userLogin">
            <div class="userLoginIcon">
              <el-avatar :src="userLoginIconImage" alt="用户头像"></el-avatar>
            </div>
          </div>
        </div>
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
import userLoginIconImage from "@/assets/userLoginIcon.jpg";

export default {
  data() {
    return {
      adobeAppName: "未知应用",
      adobeAppId: "未知ID",
      adobeAppLocale: "未知语言",
      adobeAppVersion: "未知版本",
      currentApp: "未知版本",
      userLoginIconImage
    };
  },
  mounted() {
    this.detectApplication();
  },
  methods: {
    detectApplication() {
      const csInterface = new CSInterface();
      const hostEnv = csInterface.hostEnvironment;

      if (hostEnv) {
        // 判断应用名称
        if (hostEnv.appName === "AEFT") {
          this.adobeAppName = "当前应用是 After Effects";
          this.currentApp = "AEFT";
        } else if (hostEnv.appName === "ILST") {
          this.adobeAppName = "当前应用是 Illustrator";
          this.currentApp = "ILST";
        }

        // 赋值AppId
        if (hostEnv.appId) {
          this.adobeAppId = hostEnv.appId;
        }

        // 赋值AppLocale
        if (hostEnv.appLocale) {
          this.adobeAppLocale = hostEnv.appLocale;
        }

        // 赋值AppVersion
        if (hostEnv.appVersion) {
          this.adobeAppVersion = hostEnv.appVersion;
        }
      }
    }
  }
}
</script>
