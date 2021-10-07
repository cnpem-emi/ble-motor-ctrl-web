<template>
  <v-app>
    <Unsupported v-bind:unsupported="unsupported" />
    <v-progress-linear indeterminate :active="loading"></v-progress-linear>
    <v-list v-if="$store.state.bluetooth.motors.length > 0">
      <Controls
        v-for="motor in $store.state.bluetooth.motors"
        :key="motor.name"
        v-bind:motor="motor"
      />
    </v-list>
    <v-bottom-navigation
      style="position: fixed; bottom: 0"
      background-color="indigo"
      dark
    >
      <v-btn v-if="!$store.state.bluetooth.device" @click="toggle_bluetooth">
        <span>Connect</span>
        <v-icon>{{ mdiBluetoothConnect }}</v-icon>
      </v-btn>

      <v-btn v-else @click="toggle_bluetooth">
        <span>Disconnect</span>
        <v-icon>{{ mdiBluetoothOff }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import Controls from "./components/Controls";
import Unsupported from "./components/Unsupported.vue"
import { mdiBluetoothOff, mdiBluetoothConnect, mdiHelpRhombus} from "@mdi/js";

const SERVICE_UUID = "84e7f883-7c80-4b64-88a5-6077ce2e8925";

export default {
  name: "BLEMotorCtrl",
  components: {
    Controls,
    Unsupported
  },
  data: () => ({
    real_positions: [],
    mdiHelpRhombus,
    mdiBluetoothOff,
    mdiBluetoothConnect,
    loading: false,
    unsupported: false,
  }),
  methods: {
    async toggle_bluetooth() {
      if(navigator.bluetooth === undefined) {
        this.unsupported = true;
        return;
      }
      this.loading = true;
        if (this.$store.state.bluetooth.device) {
          await this.$store.state.bluetooth.device.gatt.disconnect();
          this.$store.commit("disconnect_bluetooth");
        } else {
          let manufacturerData = { companyIdentifier: 13 };

          const options = {
            optionalServices: [SERVICE_UUID],
            filters: [{ manufacturerData: [manufacturerData] }],
          };

          let bluetooth = { motors: [] };

          bluetooth.device = await navigator.bluetooth.requestDevice(options);
          bluetooth.server = await bluetooth.device.gatt.connect();

          bluetooth.service = await bluetooth.server.getPrimaryService(
            SERVICE_UUID
          );
          let characteristics = await bluetooth.service.getCharacteristics();

          for (let c of characteristics) {
            if (c.uuid.substring(0, 9) < "00000006") {
              const d_desc = await c.getDescriptor(10512);
              const d_pos = await c.getDescriptor(10513);
              const d_pv = await c.getDescriptor(10514);

              const desc = await d_desc.readValue();
              const position = await d_pos.readValue();
              const des_pos = await c.readValue();
              const pv = await d_pv.readValue();

              bluetooth.motors.push({
                name: this.dataview_to_string(desc),
                pv: this.dataview_to_string(pv),
                characteristic: c,
                real_pos: this.dataview_to_string(position),
                desired_pos: this.dataview_to_string(des_pos),
              });
            }
          }

          this.$store.commit("set_bluetooth", bluetooth);
        }
        this.loading = false;
    },
  },
};
</script>
