<template>
  <div class="voice-bottom">
    <div class="voice-change" :class="{'begin-shrink': isRecord}">
      <div class="voice-outer"
        @touchstart.prevent="startRecord"
        @touchend.prevent="stopRecord">
        <div class="svg-voice">
          <VoiceIcon></VoiceIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VoiceIcon from "./voice-icon.vue";
export default {
  components: {
    VoiceIcon
  },
  props: ['minTime'],
  data() {
    return {
      isRecord: false,
      beginTime: 0,
      endTime: 0,
      time: this.minTime || 1000
    }
  },
  methods: {
    startRecord() {
      this.isRecord = true;
      this.beginTime = Date.now();
      this.$emit('startRecord');
    },
    stopRecord() {
      this.endTime = Date.now();
      if (this.endTime - this.beginTime < this.time) {
        this.$emit('lowRecord');
      } else {
        this.$emit('stopRecord');
      }
      this.isRecord = false;

    }
  }
};
</script>
<style>
.voice-bottom {
  height: 4.5rem;
  font-size: 0.16rem;
  text-align: center;
  background: #fff;
  position: absolute;
  bottom: 0rem;
  left: 0;
  width: 100%;
}

.voice-change {
  box-sizing: border-box;
  margin: 0 auto;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background-color: #fff;
  border: 0rem solid #fff;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 1.25rem;
  display: flex;
}

.voice-outer {
  position: relative;
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 2rem;
  background-color: #2ca244;
  justify-content: center;
  align-items: center;
}

.svg-voice {
  transform: rotate(19deg);
  -webkit-transform: rotate(19deg);
}

.begin-shrink {
  -webkit-animation-name: circle_shrink;
  -webkit-animation-duration: 1s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  background-color: #cfecd0;
}
@keyframes circle_shrink {
  0% {
    border: 0rem solid #ffffff;
  }
  10% {
    border: 0.3rem solid #cfecd0;
  }
  100% {
    border: 0rem solid #ffffff;
  }
}
</style>
