<template>
  <v-snackbar
    v-model="$store.state.snackbar"
    timeout="4000"
    color="white"
    light
  >
    {{ $store.state.message }}

    <template v-slot:action="{ attrs }">
      <v-btn icon text v-bind="attrs" @click="$store.commit('hide_snackbar')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>