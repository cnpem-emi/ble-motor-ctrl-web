<template>
  <v-card>
      <v-card-text>{{this.pv.name}}: {{this.value}}</v-card-text>
  </v-card>
</template>

<script>
/*function encode(str) {
  return Uint8Array.from(Array.from(str).map((letter) => letter.charCodeAt(0)));
}*/
export default {
  name: "PV",
  props: ["pv"],
  data: () => ({
      value,
  }),
  methods: {
    pv_changed(event) {
        this.value = event.target.value;
    },
  },
  async mounted() {
    await this.pv.characteristic.addEventListener(
      "characteristicvaluechanged",
      this.pv_changed
    );
  },
};
</script>

<style scoped>
</style>
