<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"
        ><span>Change PV</span> <v-icon>{{ mdiPencil }}</v-icon></v-btn
      >
    </template>

    <v-card>
      <v-card-title> Change PV </v-card-title>
      <v-card-text
        ><v-text-field v-model="pv_name" outline placeholder="PV Name"
      /></v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="change_pv()"> Apply </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiPencil } from "@mdi/js";

export default {
  name: "Edit",
  data: () => ({
    mdiPencil,
    pv_name: "",
    dialog: false,
  }),
  methods: {
    change_pv() {
      this.$emit("change_pv", this.pv_name);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
</style>
