<template>
  <v-card color="indigo" flat>
    <v-card-text>{{ this.pv.name }}: {{ this.pv.value }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PV",
  props: ["pv"],
};
</script>

<style scoped>
</style>
