<template>
  <div class="home">

    <!--当前是ai窗口-->
    <div class="ILST" v-if="currentApp === 'ILST'">
      <div class="tools">
        <h1>当前正在开发 / 工具 / Ai页面才能显示</h1>
        <el-button type="primary">导入到Ae中<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary">从Ae传回Ai数据<i class="el-icon-download el-icon--right"></i></el-button>
        <el-button type="primary" @click="ceshi()">测试</el-button>
        <el-button type="primary" @click="copyToAE()">测试1</el-button>
      </div>
    </div>

    <!--当前是ae窗口-->
    <div class="AEFT" v-if="currentApp === 'AEFT'">
      <div class="tools">
        <h1>当前正在开发 / 工具 / Ae页面正常显示</h1>
        <el-button type="primary">导入到Ai中<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary">从Ai传回Ae数据<i class="el-icon-download el-icon--right"></i></el-button>
      </div>
    </div>

    <!--log窗口 测试使用 -->
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
/* global CSInterface */
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
    },
    getLocalIP() {
      const pc = new RTCPeerConnection({iceServers: []});
      pc.createDataChannel('');
      pc.createOffer().then(pc.setLocalDescription.bind(pc));

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return;
        }

        const matches = ice.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}:){7}[a-f0-9]{1,4})/);

        if (matches) {
          this.YouLocaIP = matches[0];
        }
        pc.onicecandidate = null;
      };
    },
    ceshi() {
      const csInterface = new CSInterface();
      const script = `
        if (app.documents.length > 0 && app.activeDocument.selection.length > 0) {
            var selectedItem = app.activeDocument.selection[0];
            if (selectedItem.typename === "PathItem") {
                var pathData = {
                    anchorPoints: selectedItem.pathPoints, // 获取锚点
                    fillColor: (selectedItem.fillColor.red + ", " + selectedItem.fillColor.green + ", " + selectedItem.fillColor.blue),
                    strokeColor: (selectedItem.strokeColor.red + ", " + selectedItem.strokeColor.green + ", " + selectedItem.strokeColor.blue),
                    strokeWidth: selectedItem.strokeWidth,
                    filled: selectedItem.filled,
                    stroked: selectedItem.stroked
                };
                return JSON.stringify(pathData);
            } else {
                return "Not a PathItem";
            }
        } else {
            return "Nothing selected";
        }
    `;

      csInterface.evalScript(script, this.copyToAE);
      // eslint-disable-next-line no-console
      console.log(this.copyToAE())
    },
    copyToAE(result) {
      const pathData = JSON.parse(result);
      if (!pathData || pathData === "Not a PathItem" || pathData === "Nothing selected") {
        return;
      }

      // 使用pathData构建After Effects的ExtendScript脚本来创建新的形状图层
      // 这只是一个基本示例，实际的脚本可能需要更复杂的处理来适应具体情况
      const aescript = `
        var comp = app.project.activeItem;
        if (comp && comp instanceof CompItem) {
            var shapeLayer = comp.layers.addShape();
            // 使用pathData中的锚点、颜色等信息创建新的形状路径
            // 你需要写更多的代码来处理pathData并在AE中创建适当的路径
            // 这需要对After Effects scripting API的深入了解
        }
    `;

      const csInterface = new CSInterface();
      // eslint-disable-next-line no-console
      console.log(aescript)
      csInterface.evalScript(aescript);

    }
  }
}
</script>
