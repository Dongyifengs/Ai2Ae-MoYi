<template>
  <div id="app">
    <div v-if="!authenticated">
      <el-alert
          title="当前设备未激活"
          type="error"
          center
          show-icon>
      </el-alert>
      <p>电脑序列号: {{ pcuuid }}</p>
      <el-button size="mini" @click="copyuuid">复制序列号</el-button>
      <el-input placeholder="请输入密钥" v-model="inputKey" class="input-with-select"
                style="margin-top: 20px; margin: 20px 0 20px 0">
        <el-button slot="append" icon="el-icon-search" @click="authenticate">验证</el-button>
      </el-input>
      <el-tag type="danger" v-if="error">密钥错误</el-tag>
    </div>

    <div v-if="authenticated">
      <Tabs invert :routes="routes"/>
      <Panel>
        <router-view/>
      </Panel>
    </div>
  </div>
</template>

<script>
import Fingerprint2 from "fingerprintjs2";
import md5 from "md5";

const fs = require("fs");
const path = require("path");

export default {
  data() {
    return {
      routes: [
        {label: "功能", name: "tools"},
        {label: "多人协同", path: "/modes"},
        {label: "设置", path: "/settings"},
      ],
      inputKey: "",
      pcuuid: "没有获取到当前uuid",
      authenticated: false,
      error: false
    };
  },

  mounted() {
    this.fetchDeviceFingerprint();
    this.DataToLoca();
  },

  methods: {
    fetchDeviceFingerprint() {
      if (window.requestIdleCallback) {
        requestIdleCallback(this.getFingerprint);
      } else {
        setTimeout(this.getFingerprint, 500);
      }
    },

    DataToLoca() {
      console.log("开始获取数据")
    },

    async savePcuuidToFile() {
      const tempPath = process.env.TEMP || process.env.TMPDIR || process.env.TMP;
      const targetPath = path.join(tempPath, "Adobe", "CEP", "Ai", "pcuuid.txt");

      fs.promises.mkdir(path.dirname(targetPath), {recursive: true})
          .then(() => {
            // 保存pcuuid到文件
            const data = {
              pcuuid: this.pcuuid
            };
            fs.promises.writeFile(targetPath, JSON.stringify(data, null, 2))
                .catch(error => {
                  console.error("保存pcuuid出错:", error);
                });
          })
          .catch(error => {
            console.error("创建目录出错:", error);
          });
    },

    getFingerprint() {
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        this.pcuuid = Fingerprint2.x64hash128(values.join(""), 31);
        console.log(this.pcuuid);

        // 保存pcuuid到文件
        this.savePcuuidToFile();
      });
    },

    authenticate() {
      const encryptedSerial = md5(this.pcuuid);
      this.authenticated = this.inputKey === encryptedSerial;
      this.error = !this.authenticated;
    },

    copyuuid() {
      const input = document.createElement("input");
      input.value = this.pcuuid;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  }
};
</script>

<style>

</style>
