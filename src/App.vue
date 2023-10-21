<template>
  <div id="app">
    <Tabs invert :routes="routes"/>
    <Panel>
      <router-view/>
    </Panel>
  </div>
</template>

<script>
export default {
  data: () => ({
    routes: [
      {label: "功能", name: "tools"},
      {label: "多人协同", path: "/modes"},
      {label: "设置", path: "/settings"},
    ],
  }),
};
</script>

<style>
</style>
