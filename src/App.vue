<!-- App.vue
  This component is the root component for our Vue application. It is rendered
  in the project root's index.html file with the <div id="app"> tag. The firebase
  instance exists only within this component.
-->

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style>
  @import './assets/styles/toastr.css';
  @import './assets/styles/main.css';

</style>
