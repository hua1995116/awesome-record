<template>
<div class="simple-audio">
  <div class="audio-container" @click="handleStatus">
    <audio width="1" height="1" preload="metadata" data-src="http://createjs.com/gs_tuts/assets/thunder.mp3" data-type="audio/mpeg">
      您的浏览器不支持audio标签
    </audio>
    <span class="audio-status" :class="[status]"></span>
  </div>
  <span class="audio-time">{{initTime}}</span>
</div>
</template>
<script>
export default {
  props: ["time"],
  data() {
    return {
      status: ""
    };
  },
  mounted() {
    setTimeout(() => {
      this.status = "";
    }, this.time * 1000);
  },
  computed: {
    initTime() {
      const initTime = +this.time || 5;
      const resultTime = "";
      if (initTime > 60) {
        return initTime / 60 + '"' + (initTime % 60) + "'";
      }
      return initTime + "'";
    }
  },
  methods: {
    handleStatus() {
      if (!this.status) {
        this.status = "playing";
      } else {
        this.status = "";
      }
    }
  }
};
</script>
<style>
.simple-audio {
  display: block;
}
.simple-audio:after {
  content: "";
  clear: both;
  display: block;
}
.audio-container {
  float: left;
  position: relative;
  width: 150px;
  height: 32px;
  background-color: #f8f8f8;
  background-image: -webkit-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: -moz-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: -o-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  border: 1px solid rgba(0, 0, 0, 0.12);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  margin: 0 5px;
}

.audio-container:before {
  content: "";
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  -moz-transform: rotate(45deg); /* Firefox */
  -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
  -o-transform: rotate(45deg); /* Opera */
  transform: rotate(45deg);
  left: -5px;
  top: 11px;
  background-color: #f8f8f8;
  background-image: -webkit-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: -moz-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: -o-linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  background-image: linear-gradient(-180deg, #f8f8f8 0%, #efefef 100%);
  border-top: none;
  border-right: none;
}

.audio-status {
  float: left;
  margin-top: 8px;
  margin-left: 15px;
  width: 13px;
  height: 15px;
  background: url(//p1.ssl.qhimg.com/t01154d8bfabb0b30aa.png) no-repeat top left;
  -webkit-background-size: 100%;
  background-size: 100%;
}

.audio-status.playing {
  -webkit-animation: audio_playing 1s infinite;
  -o-animation: audio_playing 1s infinite;
  animation: audio_playing 1s infinite;
}

.audio-status.error:after {
  content: "!";
  font-size: 12px;
  color: #aaa;
  margin-left: 16px;
  vertical-align: top;
}
@keyframes audio_playing {
  0% {
    background-position: 0 -15px;
  }
  30% {
    background-position: 0 -15px;
  }
  30.1% {
    background-position: 0 -30px;
  }
  61% {
    background-position: 0 -30px;
  }
  61.1% {
    background-position: 0 -45px;
  }
  100% {
    background-position: 0 -45px;
  }
}

.audio-time {
  float: left;
  line-height: 32px;
  color: #999;
  font-size: 13px;
  font-family: SFUIDisplay-Regular, Arial;
}
</style>
