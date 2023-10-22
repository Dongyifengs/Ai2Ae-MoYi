<template xmlns="http://www.w3.org/1999/html">
  <div class="home">

    <div class="ILST" v-if="currentApp === 'ILST'">
      <div class="tools">
        <h1>当前正在开发 / 多人协同 / Ai页面才能显示</h1>
        <el-button @click="showValues">显示值</el-button><br>
        <el-input v-model="translateX" placeholder="请输入宽度" style="width: 200px"></el-input><br>
        <el-input v-model="translateY" placeholder="请输入高度" style="width: 200px"></el-input><br>
      </div>
    </div>

    <div class="AEFT" v-if="currentApp === 'AEFT'">
      <div class="tools">
        <h1>当前正在开发 / 多人协同 / Ae页面正常显示</h1>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      adobeAppName: '未知应用',
      adobeAppId: '未知ID',
      adobeAppLocale: '未知语言',
      adobeAppVersion: '未知版本',
      currentApp: '未知版本',
      translateX: 0,
      translateY: -100
    };
  },
  mounted() {
    this.detectApplication();
  },
  methods: {
    showValues() {
      alert(`translateX: ${this.translateX}, translateY: ${this.translateY}`);
    },
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
