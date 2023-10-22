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
        <el-button type="primary" size="small" icon="el-icon-upload2" @click="Test2()">复制</el-button>
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
    // TODO 获取面板属性
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

    // TODO 获取电脑IP地址
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

    // TODO 将路径导入到Ae中
    CopyToAe() {
      console.log("CopyToAe()")
    },

    // TODO 将Ae路径导入到Ai中
    CopyAeToAi() {
      console.log("CopyAeToAi()")
    },


    // TODO 测试函数
    Test() {
      const csInterface = new CSInterface();
      const script = `(function(){

            // TODO 获取颜色
            function colorToString(color) {
                if (color.typename === "CMYKColor") {
                    var r = 255 * (1 - color.cyan / 100) * (1 - color.black / 100);
                    var g = 255 * (1 - color.magenta / 100) * (1 - color.black / 100);
                    var b = 255 * (1 - color.yellow / 100) * (1 - color.black / 100);
                    return "R: " + Math.round(r) + ", G: " + Math.round(g) + ", B: " + Math.round(b);
                } else if (color.typename === "GrayColor") {
                    var rgbVal = 255 * (1 - color.gray / 100);
                    return "R: " + Math.round(rgbVal) + ", G: " + Math.round(rgbVal) + ", B: " + Math.round(rgbVal);
                } else if (color.typename === "SpotColor") {
                    return colorToString(color.spot.color);
                } else if (color.typename === "GradientColor") {
                    return "Gradient";
                } else if (color.typename === "RGBColor") {
                    return "R: " + Math.round(color.red) + ", G: " + Math.round(color.green) + ", B: " + Math.round(color.blue);
                } else {
                    return "N/A";
                }
            }

            // TODO 获取渐变
            function gradientToString(gradientColor) {
                var stops = [];
                for (var j = 0; j < gradientColor.gradient.gradientStops.length; j++) {
                    var stop = gradientColor.gradient.gradientStops[j];
                    stops.push(colorToString(stop.color) + " (" + stop.rampPoint + "%)");
                }
                return stops.join(", ");
            }

            // TODO 获取路径各个属性
            const items = app.activeDocument.selection;
            const results = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var attributes = {
                    透明度: item.opacity,
                    锚点位置: (item.typename === "PathItem" && item.pathPoints.length > 0) ? item.pathPoints[0].anchor.toString() : "N/A",
                    边框大小: (item.typename === "PathItem") ? item.strokeWidth : "N/A",
                    边框颜色: (item.typename === "PathItem") ? colorToString(item.strokeColor) : "N/A",
                    路径颜色: (item.typename === "PathItem") ? (item.fillColor.typename === "GradientColor" ? gradientToString(item.fillColor) : colorToString(item.fillColor)) : "N/A",
                    路径大小: (item.typename === "PathItem") ? item.pathPoints.length : "N/A",
                    路径名称: item.name || "N/A"
                };
                results.push(attributes);
            }
            return JSON.stringify(results);
      })()`;

      // TODO 执行脚本
      csInterface.evalScript(script, (result) => {
        console.log(JSON.parse(result));
        if (JSON.parse((result)).length === 0) {
          this.$message({
            showClose: true,
            message: '没有选中路径.',
            type: 'error',
            center: true
          });
        } else {
          this.$message({
            showClose: true,
            message: '选中了路径.',
            type: 'success',
            center: true
          });
        }
      });
    },

    // TODO 测试2
    Test2() {
      const csInterface = new CSInterface();
      const script = `(function(){
      var selection = app.activeDocument.selection;
      if (selection.length === 0) {
          return "没有路径";
      }
      for (var i = 0; i < selection.length; i++) {
          var item = selection[i];
          if (item.typename === "PathItem") {
              var duplicatedItem = item.duplicate();
              duplicatedItem.translate(10, 10);
          }
      }
        return "已复制路径";
      })()`;

      csInterface.evalScript(script, (result) => {
        console.log(result);

        if (result === "已复制路径") {
          this.$message({
            showClose: true,
            message: '复制成功',
            type: 'success',
            center: true
          });
        } else if (result === "没有路径") {
          this.$message({
            showClose: true,
            message: '没有选中的路径.',
            type: 'warning',
            center: true
          });
        } else {
          this.$message({
            showClose: true,
            message: '操作失败',
            type: 'error',
            center: true
          });
        }
      });
    }
  }
}
</script>

<style scoped>

</style>