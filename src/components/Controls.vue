<template>
  <v-container>
    <v-card class="mx-auto" max-width="360" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-h5 mb-4">{{ motor.pv }}</div>
          <div class="text-overline mb-5">{{ motor.name }}</div>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="4" style="padding-right: 10px">
                <v-text-field
                  label="Step"
                  placeholder="Eg.: 2.00000"
                  v-model="step"
                  outlined
                  dense
                  type="number"
                  hide-details=""
                ></v-text-field>
              </v-col>
              <v-col cols="1"
                ><v-btn @click="decrement" icon class="pos_buttons"
                  >-</v-btn
                ></v-col
              >
              <v-col cols="6">
                <v-text-field
                  label="Position"
                  placeholder="Eg.: 12.00000"
                  v-model="des_pos"
                  :step="parseFloat(step)"
                  outlined
                  dense
                  type="number"
                  hide-details=""
                ></v-text-field>
              </v-col>
              <v-col cols="1"
                ><v-btn @click="increment" icon class="pos_buttons"
                  >+</v-btn
                ></v-col
              >
            </v-row>
          </v-container>
          <v-list-item-subtitle style="text-align: center; padding: 10px 0"
            >CURRENT POSITION:
            {{
              motor.real_pos ? `${motor.real_pos} mm` : "Unknown"
            }}</v-list-item-subtitle
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
export default {
  name: "Controls",
  props: ["motor"],
  data: () => ({
    step: 1,
    des_pos: 0,
  }),
  methods: {
    async apply_position() {
      try {
        await this.motor.characteristic.writeValueWithoutResponse(
          Uint8Array.from(
            Array.from(this.des_pos).map((letter) => letter.charCodeAt(0))
          )
        );
      } catch (error) {
        alert(error);
      }
    },
    increment() {
      this.des_pos = (parseFloat(this.des_pos) + parseFloat(this.step)).toFixed(
        5
      );
      this.apply_position();
    },
    decrement() {
      this.des_pos = (parseFloat(this.des_pos) - parseFloat(this.step)).toFixed(
        5
      );
      this.apply_position();
    },
  },
  mounted() {
    this.des_pos = this.motor.desired_pos;
  },
};
</script>

<style scoped>
.col {
  padding: 0 1px;
}

.pos_buttons {
  width: 10px !important;
  min-width: 0 !important;
  padding: 0 13px !important;
}
</style>
