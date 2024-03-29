<template>
  <v-container>
    <v-card class="mx-auto" max-width="360" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-container fluid>
            <v-row>
              <div class="text-h6 mb-4" style="margin-bottom: 0 !important">
                {{ motor.name }}
              </div>
              <v-spacer />
              <v-icon v-show="motor.movn" color="blue" class="rotate_move">{{
                mdiCogClockwise
              }}</v-icon>
            </v-row>
          </v-container>
          <div class="text-h7 mb-5">{{ motor.pv }}</div>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="1"
                ><v-btn
                  @click="step_motor('-')"
                  color="indigo"
                  dark
                  class="pos_buttons"
                  >-</v-btn
                ></v-col
              >
              <v-col cols="4">
                <v-text-field
                  label="Step (mm)"
                  placeholder="Eg.: 2.00000"
                  v-model="step"
                  dense
                  type="number"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="1"
                ><v-btn
                  @click="step_motor('')"
                  color="indigo"
                  dark
                  class="pos_buttons"
                  style="margin-right: 10px"
                  >+</v-btn
                ></v-col
              >
              <v-spacer />
              <v-col cols="5">
                <v-text-field
                  label="Position (mm)"
                  placeholder="Eg.: 12.00000"
                  v-model="des_pos"
                  :step="parseFloat(step)"
                  outlined
                  dense
                  type="number"
                  hide-details
                  append
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <span class="text-h7" style="text-align: center; padding: 10px 0">
            {{ motor.real_pos ? `${motor.real_pos} mm` : "Unknown" }}
            <v-icon align="center" color="red" v-show="motor.lvio">{{
              mdiAlertOctagon
            }}</v-icon></span
          >
          <v-row style="margin: 12px 0">
            <v-col>
              <v-btn width="100%" dark color="red" @click="stop"> Stop </v-btn>
            </v-col>
            <v-col>
              <v-btn @click="apply_position" width="100%" dark color="indigo">
                Move
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import { mdiCogClockwise, mdiAlertOctagon } from "@mdi/js";

function encode(str) {
  return Uint8Array.from(Array.from(str).map((letter) => letter.charCodeAt(0)));
}
export default {
  name: "Controls",
  props: ["motor"],
  data: () => ({
    step: 1,
    des_pos: 0,
    mdiCogClockwise,
    mdiAlertOctagon,
  }),
  methods: {
    async update_lvio() {
      const d_lvio = await this.motor.characteristic.getDescriptor(10516);
      const lvio = await d_lvio.readValue();
      this.$emit("lvio", this.dataview_to_string(lvio) == "1");
    },
    async apply_position() {
      await this.motor.characteristic.writeValueWithoutResponse(
        encode(this.des_pos)
      );
      this.update_lvio();
    },
    async step_motor(signal) {
      const descriptor = await this.motor.characteristic.getDescriptor(10515);
      await descriptor.writeValue(encode(`${signal}${this.step}`));
      this.update_lvio();
    },
    position_changed(event) {
      this.$emit("position", this.dataview_to_string(event.target.value));
    },
    movn_changed(event) {
      this.$emit("movn", this.dataview_to_string(event.target.value));
    },
    async stop() {
      try {
        const descriptor = await this.motor.characteristic.getDescriptor(10517);
        await descriptor.writeValue(encode("1"));
      } catch (error) {
        alert(error);
      }
    },
  },
  async mounted() {
    this.des_pos = this.motor.desired_pos;
    await this.motor.characteristic.addEventListener(
      "characteristicvaluechanged",
      this.position_changed
    );

    await this.motor.movn_char.addEventListener(
      "characteristicvaluechanged",
      this.movn_changed
    );
  },
};
</script>

<style scoped>
.col {
  padding: 0 3px;
}

.pos_buttons {
  width: 8px !important;
  min-width: 0 !important;
  padding: 0 11px !important;
}

.rotate_move {
  animation: rotation 2s linear infinite;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
