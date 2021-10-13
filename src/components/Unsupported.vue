<template>
  <v-dialog v-model="unsupported" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Unsupported browser/device</span>
      </v-card-title>
      <v-card-text>
        Your current browser/device is unsupported by the Bluetooth API, which
        is required for this application to function.
      </v-card-text>
      <v-card-text>
        <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=674737"
          >Why is Mozilla not implementing Web Bluetooth in Firefox?</a
        >
      </v-card-text>
      <v-card-text>
        <a
          href="https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/"
          >Why is Apple not implementing Web Bluetooth in Safari?</a
        >
      </v-card-text>
      <v-card-text>
        Please move to one of the following browsers (or a Blink based browser)
        or try a new device:
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          href="https://play.google.com/store/apps/details?id=com.android.chrome&hl=en&gl=US"
        >
          <v-icon> {{ mdiGoogleChrome }} </v-icon> Chrome
        </v-btn>
        <v-btn
          text
          href="https://play.google.com/store/apps/details?id=com.microsoft.emmx&hl=en&gl=US"
        >
          <v-icon> {{ mdiMicrosoftEdge }} </v-icon> Edge
        </v-btn>
        <v-btn
          text
          href="https://play.google.com/store/apps/details?id=com.opera.browser&hl=en&gl=US"
        >
          <v-icon> {{ mdiOpera }} </v-icon> Opera
        </v-btn>
        <v-btn text href="https://www.bromite.org/">
          <v-icon> {{ mdiWeb }} </v-icon> Bromite
        </v-btn>
        <v-btn text href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055">
          <v-icon> {{ mdiWeb }} </v-icon> Bluefy (iOS)
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiGoogleChrome, mdiMicrosoftEdge, mdiOpera, mdiWeb } from "@mdi/js";

export default {
  props: ["unsupported"],
  data: () => ({
    mdiGoogleChrome,
    mdiMicrosoftEdge,
    mdiWeb,
    mdiOpera,
  }),
};
</script>
