<template>
  <div id="app">
    <div v-if="!authenticated">
      <input v-model="inputKey" placeholder="请输入密钥"/>
      <button @click="authenticate">验证</button>
      <p>电脑序列号：{{ serialNumber }}</p>
      <p v-if="error" style="color: red;">密钥错误！</p>
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
import md5 from 'md5';

export default {
  data: () => ({
    routes: [
      {label: "功能", name: "tools"},
      {label: "多人协同", path: "/modes"},
      {label: "设置", path: "/settings"},
    ],
    inputKey: '',
    serialNumber: '示例序列号', // 在实际应用中，你需要获取真实的序列号
    authenticated: false,
    error: false
  }),
  methods: {
    authenticate() {
      const encryptedSerial = md5(this.serialNumber);
      if (this.inputKey === encryptedSerial) {
        this.authenticated = true;
        this.error = false;
      } else {
        this.error = true;
      }
    }
  }
};
</script>
