<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>home</h1>
    <div @click="addCommit">commit --- {{ $store.state.counter }}</div>
    <div @click="addAction">action --- {{ $store.state.counter }}</div>
    <div>getters --- {{ $store.getters.doubleCounter }}</div>
    <h2 @click="goTest">跳转到test</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld,
  },
  methods: {
    goTest() {
      this.$router.push("/test");
    },
    addCommit() {
      this.$store.commit("add");
      // this.$store.dispatch("add");
    },
    addAction() {
      this.$store.dispatch("add2");
    },
  },
};
</script>
<style scoped>
h2,
div {
  cursor: pointer;
}
</style>
