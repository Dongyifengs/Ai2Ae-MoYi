<template>
  <div class="home">

    <div class="ILST" v-if="currentApp === 'ILST'">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ai页面才能显示</h2>
        <div class="youIP">
          <span>当前设备IP：{{ YouLocaIP }}</span><br>
          <div style="margin-top: 5px;">
            <el-input placeholder="请输入IP地址" class="input-with-select" v-model="YouToIP">
              <el-button slot="append" @click="LianJie()">连接</el-button>
            </el-input>
          </div>
        </div>
        <div class="btn" style="margin-top: 5px">
          <el-tooltip content="上传到对方Ae" placement="top">
            <el-button type="primary" size="small" icon="el-icon-upload2"/>
          </el-tooltip>
          <el-button type="primary" size="small" icon="el-icon-upload2">测试</el-button>
          <el-tooltip content="从对方Ae从传回" placement="top">
            <el-button type="primary" size="small" icon="el-icon-download"/>
          </el-tooltip>
          <el-tooltip content="导入设置" placement="top">
            <el-button type="primary" size="small" icon="el-icon-setting"/>
          </el-tooltip>
        </div>
      </div>

    </div>
    <div class="AEFT" v-if="currentApp === 'AEFT'">
      <div class="tools">
        <h2>当前正在开发 / 多人协同 / Ae页面正常显示</h2>
        <div class="youIP">
          <span>当前设备IP：{{ YouLocaIP }}</span><br>
          <div style="margin-top: 5px;">
            <el-input placeholder="请输入IP地址" class="input-with-select" v-model="YouToIP">
              <el-button slot="append" @click="LianJie()">连接</el-button>
            </el-input>
          </div>
        </div>
        <div class="btn" style="margin-top: 5px">
          <el-tooltip content="上传到对方Ai" placement="top">
            <el-button type="primary" size="small" icon="el-icon-upload2"/>
          </el-tooltip>
          <el-button type="primary" size="small" icon="el-icon-upload2">测试</el-button>
          <el-tooltip content="从对方Ai从传回" placement="top">
            <el-button type="primary" size="small" icon="el-icon-download"/>
          </el-tooltip>
          <el-tooltip content="导入设置" placement="top">
            <el-button type="primary" size="small" icon="el-icon-setting"/>
          </el-tooltip>
        </div>
      </div>


    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      adobeAppName: "未知应用",
      adobeAppId: "未知ID",
      adobeAppLocale: "未知语言",
      adobeAppVersion: "未知版本",
      currentApp: "未知版本",
      YouLocaIP: "正在获取IP地址.....",
      YouToIP: ""
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
      pc.createDataChannel("");
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
    LianJie() {
      console.log("连接到：" + this.YouToIP);
    }
  }
}
</script>
