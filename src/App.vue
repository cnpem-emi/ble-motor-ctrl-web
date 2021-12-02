<template>
  <v-app>
    <Unsupported v-bind:unsupported="unsupported" />
    <v-progress-linear
      :color="loading_color"
      indeterminate
      :active="loading"
    ></v-progress-linear>
    <v-list
      v-if="$store.state.bluetooth.motors.length > 0"
      style="padding-bottom: 60px"
    >
      <Controls
        v-for="motor in $store.state.bluetooth.motors"
        :key="motor.name"
        v-bind:motor="motor"
        @position="update_position(motor, $event)"
        @movn="update_moving(motor, $event)"
        @lvio="update_lvio(motor, $event)"
      />
    </v-list>
    <v-bottom-navigation
      style="position: fixed; bottom: 0"
      background-color="indigo"
      dark
    >
      <PV v-bind:pv="pv"/>
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
import Unsupported from "./components/Unsupported.vue";
import { mdiBluetoothOff, mdiBluetoothConnect, mdiHelpRhombus } from "@mdi/js";

const SERVICE_UUID = "84e7f883-7c80-4b64-88a5-6077ce2e8925";

export default {
  name: "BLEMotorCtrl",
  components: {
    Controls,
    Unsupported,
  },
  data: () => ({
    real_positions: [],
    mdiHelpRhombus,
    mdiBluetoothOff,
    mdiBluetoothConnect,
    loading: false,
    loading_color: "blue",
    unsupported: false,
    lock: true,
    pv: {}
  }),
  methods: {
    async toggle_bluetooth() {
      if (navigator.bluetooth === undefined) {
        this.unsupported = true;
        return;
      }
      this.loading_color = "blue";
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

        try {
          bluetooth.device = await navigator.bluetooth.requestDevice(options);
          bluetooth.server = await bluetooth.device.gatt.connect();

          bluetooth.service = await bluetooth.server.getPrimaryService(
            SERVICE_UUID
          );
        } catch (error) {
          this.$store.commit(
            "show_snackbar",
            "Could not connect to device, refresh the page and try again."
          );
          return;
        }
        this.loading_color = "green";

        let characteristics = await bluetooth.service.getCharacteristics();

        for (let c of characteristics) {
          const char_type = c.uuid.substring(9, 13);
          if (char_type !== "710e" && char_type !== "710f") continue;
          if (char_type === "710e") {
            const d_desc = await c.getDescriptor(10512);
            const d_pos = await c.getDescriptor(10513);
            const d_pv = await c.getDescriptor(10514);
            const d_lvio = await c.getDescriptor(10516);

            const desc = await d_desc.readValue();
            const position = await c.readValue();
            const des_pos = await d_pos.readValue();
            const lvio = await d_lvio.readValue();
            const pv = await d_pv.readValue();

            bluetooth.motors.push({
              name: this.dataview_to_string(desc),
              pv: this.dataview_to_string(pv),
              characteristic: c,
              real_pos: this.dataview_to_string(position),
              desired_pos: this.dataview_to_string(des_pos),
              lvio: this.dataview_to_string(lvio) === "1",
            });
          } else if (char_type === "710f") {
            const movn = await c.readValue();
            const index = parseInt(c.uuid.charAt(7))-2;

            bluetooth.motors[index]["movn"] =
              this.dataview_to_string(movn) === "1";
            bluetooth.motors[index]["movn_char"] = c;
          } else if (char_type === "7110") { 
            this.pv = {
              characteristic: c,
              name: await c.readValue(),
              value: "Waiting..."
            }
          }
          await c.startNotifications();
        }

        this.$store.commit("set_bluetooth", bluetooth);
      }
      this.loading = false;
    },
    update_position(motor, value) {
      motor.real_pos = value;
    },
    update_moving(motor, value) {
      motor.movn = value === "1";
    },
    update_lvio(motor, value) {
      motor.lvio = value;
    },
  },
};
</script>
