<template>
  <v-container>
    <v-card class="mx-auto" max-width="360" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-container fluid>
            <v-row>
              <div class="text-h5 mb-4" style="margin-bottom: 0 !important">
                {{ motor.pv }}
              </div>
              <v-spacer />
              <v-icon v-show="motor.movn" color="blue" class="rotate_move">{{
                mdiCogClockwise
              }}</v-icon>
            </v-row>
          </v-container>
          <div class="text-overline mb-5">{{ motor.name }}</div>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="1"
                ><v-btn @click="step_motor('-')" icon class="pos_buttons"
                  >-</v-btn
                ></v-col
              >
              <v-col cols="4">
                <v-text-field
                  label="Step"
                  placeholder="Eg.: 2.00000"
                  v-model="step"
                  outlined
                  dense
                  type="number"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="1"
                ><v-btn
                  @click="step_motor('')"
                  icon
                  class="pos_buttons"
                  style="margin-right: 10px"
                  >+</v-btn
                ></v-col
              >
              <v-spacer />
              <v-col cols="5">
                <v-text-field
                  label="Position"
                  placeholder="Eg.: 12.00000"
                  v-model="des_pos"
                  :step="parseFloat(step)"
                  outlined
                  dense
                  type="number"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-list-item-subtitle style="text-align: center; padding: 10px 0"
            >CURRENT POSITION:
            {{ motor.real_pos ? `${motor.real_pos} mm` : "Unknown" }}
            <v-icon align="center" color="red">{{
              mdiAlertOctagon
            }}</v-icon></v-list-item-subtitle
          >
          <v-row style="margin: 12px 0">
            <v-col>
              <v-btn outlined width="100%" color="red"> Stop </v-btn>
            </v-col>
            <v-col>
              <v-btn
                @click="apply_position"
                width="100%"
                outlined
                color="indigo"
              >
                Apply
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
    async apply_position() {
      await this.motor.characteristic.writeValueWithoutResponse(
        encode(this.des_pos)
      );
    },
    async step_motor(signal) {
      const descriptor = await this.motor.characteristic.getDescriptor(10515);
      await descriptor.writeValue(encode(`${signal}${this.step}`));
    },
    async position_changed(event) {
      this.$emit("position", this.dataview_to_string(event.target.value));
    },
    async movn_changed(event) {
      this.$emit("movn", this.dataview_to_string(event.target.value));
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
