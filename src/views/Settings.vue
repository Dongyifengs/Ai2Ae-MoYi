<template>
  <div class="about-container">
    <h1>当前正在开发 / Settings</h1>
    <div class="ai"></div>
    <div class="ae"></div>
    <div id="ua-display">User Agent: {{ userAgent }}</div>
    <div id="ua-display-moyi">当前应用是：{{ adobeCepVersion }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userAgent: '',
      adobeCepVersion: ''
    };
  },
  mounted() {
    this.userAgent = navigator.userAgent;
    this.detectApplication();
  },
  methods: {
    detectApplication() {
      const csInterface = new CSInterface();
      if (csInterface.hostEnvironment !== null) {
        const currentApplication = csInterface.hostEnvironment.appName;

        if (currentApplication === "AEFT") {
          this.adobeCepVersion = "当前应用是 After Effects";
        } else if (currentApplication === "ILST") {
          this.adobeCepVersion = "当前应用是 Illustrator";
        } else {
          this.adobeCepVersion = "未知应用";
        }
      } else {
        this.adobeCepVersion = "未知应用";
      }
    }
  }
}
</script>

<style>
#ua-display {
  margin-top: 20px;
}
</style>