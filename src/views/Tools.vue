<template>
  <div class="home">

    <!--Ai面板内容-->
    <div v-if="currentApp === 'ILST'" class="ILST">
      <div class="tools">
        <h1>当前正在开发 / 工具 / Ai页面才能显示</h1>
        <el-tooltip content="上传到Ae" placement="top">
          <el-button type="primary" size="small" icon="el-icon-upload2" @click="CopyToAe()"/>
        </el-tooltip>
        <el-button type="primary" size="small" icon="el-icon-upload2" @click="Test()">测试</el-button>
        <el-tooltip content="从Ae从传回" placement="top">
          <el-button type="primary" size="small" icon="el-icon-download" @click="CopyAeToAi()"/>
        </el-tooltip>
      </div>
    </div>

    <!--Ae面板内容-->
    <div v-if="currentApp === 'AEFT'" class="AEFT">
      <div class="tools">
        <h1>当前正在开发 / 工具 / Ae页面正常显示</h1>
        <el-tooltip content="上传到Ai" placement="top">
          <el-button type="primary" size="small" icon="el-icon-upload2"/>
        </el-tooltip>
        <el-tooltip content="从Ai从传回" placement="top">
          <el-button type="primary" size="small" icon="el-icon-download"/>
        </el-tooltip>
      </div>
    </div>

    <!--Log面板内容-->
    <div class="log">
      <span>当前应用: {{ adobeAppName }}</span><br>
      <span>当前ID: {{ adobeAppId }}</span><br>
      <span>当前语言: {{ adobeAppLocale }}</span><br>
      <span>当前版本: {{ adobeAppVersion }}</span><br>
      <span>当前IP: {{ YouLocaIP }}</span><br>
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
      YouLocaIP: '正在获取IP地址.....'
    };
  },
  mounted() {
    this.detectApplication();
    this.getLocalIP();
  },
  methods: {
    // 获取面板属性
    detectApplication() {
      const csInterface = new CSInterface();
      const hostEnv = csInterface.hostEnvironment;
      if (hostEnv) {
        this.adobeAppName = hostEnv.appName === "AEFT" ? "当前应用是 After Effects" : "当前应用是 Illustrator";
        this.currentApp = hostEnv.appName;
        this.adobeAppId = hostEnv.appId || '未知ID';
        this.adobeAppLocale = hostEnv.appLocale || '未知语言';
        this.adobeAppVersion = hostEnv.appVersion || '未知版本';
      }
    },

    // 获取电脑IP
    getLocalIP() {
      const pc = new RTCPeerConnection({iceServers: []});
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate) {
          const matches = ice.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}:){7}[a-f0-9]{1,4})/);
          if (matches) this.YouLocaIP = matches[0];
          pc.onicecandidate = null;
        }
      };
    },

    // 将路径导入到Ae中
    CopyToAe() {
      console.log("CopyToAe()")
    },

    // 将Ae路径导入到Ai中
    CopyAeToAi() {
      console.log("CopyAeToAi()")
    },

    // 测试函数
    Test() {
      console.log(123)
      const csInterface = new CSInterface();
      const script = `(function(){
            const items = app.activeDocument.selection;
            const results = [];
            for (var i = 0; i < items.length; i++) {
                const item = items[i];
                const attributes = {
                    透明度: item.opacity, // 透明度: item.opacity
                    锚点位置: (item.typename === "PathItem" && item.pathPoints.length > 0) ? item.pathPoints[0].anchor.toString() : "N/A", // 锚点位置: 如果是路径项目并且有路径点，则返回第一个路径点的锚点，否则返回"N/A"
                    边框大小: (item.typename === "PathItem") ? item.strokeWidth : "N/A", // 边框大小: 如果是路径项目，则返回边框的宽度，否则返回"N/A"
                    边框颜色: (item.typename === "PathItem" && item.strokeColor.typename === "RGBColor") ? "R: " + item.strokeColor.red + " G: " + item.strokeColor.green + " B: " + item.strokeColor.blue : "N/A", // 边框颜色: 如果是路径项目且边框颜色为RGB颜色，则返回RGB颜色值，否则返回"N/A"
                    路径颜色: (item.typename === "PathItem" && item.fillColor.typename === "RGBColor") ? "R: " + item.fillColor.red + " G: " + item.fillColor.green + " B: " + item.fillColor.blue : "N/A", // 路径颜色: 如果是路径项目且填充颜色为RGB颜色，则返回RGB颜色值，否则返回"N/A"
                    路径大小: (item.typename === "PathItem") ? item.pathPoints.length : "N/A", // 路径大小: 如果是路径项目，则返回路径点的数量，否则返回"N/A"
                    路径名称: item.name || "N/A" // 路径名称: 返回项目名称，如果没有则返回"N/A"
                };
                results.push(attributes);
            }
            return JSON.stringify(results);
      })()`;

      csInterface.evalScript(script, (result) => {
        console.log(result)
        console.log(JSON.parse(result));
      });
    }
  }
}
</script>
