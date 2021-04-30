<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>home</h1>
    <h2 @click="goTest">跳转到test</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    goTest() {
      this.$router.push("/test");
    },
  },
};
</script>
<style scoped>
h2 {
  cursor: pointer;
}
</style>
