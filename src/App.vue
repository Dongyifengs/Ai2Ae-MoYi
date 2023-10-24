<template>
  <div id="app">
    <!-- 显示未认证时的界面 -->
    <div v-if="!isAuthenticated">
      <el-alert
          title="当前设备未激活"
          type="error"
          center
          show-icon>
      </el-alert>
      <p>电脑序列号: {{ pcUUID }}</p>
      <el-button size="mini" @click="copyUUID">复制序列号</el-button>
      <el-input
          placeholder="请输入密钥" v-model="inputKey" class="input-with-select" style="margin: 20px 0 20px 0">
        <template v-slot:append>
          <el-button icon="el-icon-search" @click="verifyKey">验证</el-button>
        </template>
      </el-input>
      <el-tag v-if="hasError" type="TAG_ARTIFACT">密钥错误</el-tag>
    </div>

    <!-- 已认证时显示的界面 -->
    <div v-if="isAuthenticated">
      <Tabs :invert="true" :routes="routes"/>
      <Panel>
        <router-view/>
      </Panel>
    </div>
  </div>
</template>


<script>
import Fingerprint2 from "fingerprintjs2";  // 导入 Fingerprint2 用于生成设备唯一指纹
import md5 from "md5";                      // 导入 md5 用于加密操作

export default {
  data() {
    return {
      // 定义路由列表
      routes: [
        {label: "功能", name: "tools"},
        {label: "多人协同", path: "/modes"},
        {label: "设置", path: "/settings"},
      ],
      inputKey: "", // 用户输入的密钥
      pcUUID: "没有获取到当前uuid", // 存储计算机的 UUID
      isAuthenticated: false, // 是否通过身份验证
      hasError: false  // 密钥验证是否出现错误
    };
  },

  mounted() {
    // 获取设备 UUID
    this.fetchDeviceUUID();
    // 获取其他数据（方法尚未完全实现）
    this.getData()
  },

  methods: {
    // 获取用户UUID
    async fetchDeviceUUID() {
      if (window.requestIdleCallback) {
        await new Promise(resolve => {
          requestIdleCallback(() => {
            this.generateUUID();
            resolve();
          });
        });
      } else {
        setTimeout(this.generateUUID, 500);
      }
    },

    getData() {
      // 用于获取数据的方法，当前只是一个占位函数
      console.log("开始获取数据");
    },

    generateUUID() {
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        // 计算并设置设备的 UUID
        this.pcUUID = Fingerprint2.x64hash128(values.join(""), 31);
        console.log("当前设备UUID", this.pcUUID);
        console.log("当前设备解锁码", md5(this.pcUUID));

      });
    },

    // 验证用户输入的密钥
    verifyKey() {
      // 使用 md5 加密 UUID
      const encryptedUUID = md5(this.pcUUID);
      // 检查输入的密钥是否与加密的 UUID 匹配
      this.isAuthenticated = this.inputKey === encryptedUUID;
      // 如果不匹配，设置错误标识
      this.hasError = !this.isAuthenticated;
    },

    // 将设备的 UUID 复制到剪贴板
    copyUUID() {
      // 创建一个 input 元素
      const inputElement = document.createElement("input");
      // 设置其值为 UUID
      inputElement.value = this.pcUUID;
      // 将 input 元素添加到文档中
      document.body.appendChild(inputElement);
      // 选中其内容
      inputElement.select();
      // 执行复制命令
      document.execCommand("copy");
      // 从文档中删除 input 元素
      document.body.removeChild(inputElement);
    }
  }
};
</script>


<style scoped>

</style>
