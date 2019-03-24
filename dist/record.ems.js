function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function createWavFile(audioData) {
  var WAV_HEAD_SIZE = 44;
  var buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
      // 需要用一个view来操控buffer
  view = new DataView(buffer); // 写入wav头部信息
  // RIFF chunk descriptor/identifier

  writeUTFBytes(view, 0, 'RIFF'); // RIFF chunk length

  view.setUint32(4, 44 + audioData.length * 2, true); // RIFF type

  writeUTFBytes(view, 8, 'WAVE'); // format chunk identifier
  // FMT sub-chunk

  writeUTFBytes(view, 12, 'fmt '); // format chunk length

  view.setUint32(16, 16, true); // sample format (raw)

  view.setUint16(20, 1, true); // stereo (2 channels)

  view.setUint16(22, 2, true); // sample rate

  view.setUint32(24, 44100, true); // byte rate (sample rate * block align)

  view.setUint32(28, 44100 * 2, true); // block align (channel count * bytes per sample)

  view.setUint16(32, 2 * 2, true); // bits per sample

  view.setUint16(34, 16, true); // data sub-chunk
  // data chunk identifier

  writeUTFBytes(view, 36, 'data'); // data chunk length

  view.setUint32(40, audioData.length * 2, true);
  var length = audioData.length;
  var index = 44;
  var volume = 1;

  for (var i = 0; i < length; i++) {
    view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
    index += 2;
  }

  return buffer;
}

function writeUTFBytes(view, offset, string) {
  var lng = string.length;

  for (var i = 0; i < lng; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function createJSNode(audioContext) {
  var BUFFER_SIZE = 4096;
  var INPUT_CHANNEL_COUNT = 2;
  var OUTPUT_CHANNEL_COUNT = 2; // createJavaScriptNode已被废弃

  var creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
  creator = creator.bind(audioContext);
  return creator(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
}
function mergeArray(list) {
  var length = list.length * list[0].length;
  var data = new Float32Array(length),
      offset = 0;

  for (var i = 0; i < list.length; i++) {
    data.set(list[i], offset);
    offset += list[i].length;
  }

  return data;
} // 交叉合并左右声道的数据

function interleaveLeftAndRight(left, right) {
  var totalLength = left.length + right.length;
  var data = new Float32Array(totalLength);

  for (var i = 0; i < left.length; i++) {
    var k = i * 2;
    data[k] = left[i];
    data[k + 1] = right[i];
  }

  return data;
}

window.URL = window.URL || window.webkitURL; //获取计算机的设备：摄像头或者录音设备

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var Recorder =
/*#__PURE__*/
function () {
  function Recorder(options) {
    var _this = this;

    _classCallCheck(this, Recorder);

    this.leftDataList = [];
    this.rightDataList = [];
    this.canuse = true;
    this.mineType = options.mineType || 'audio/mp3';
    this.timeout = options.timeout;
    this.timeoutCallback = options.timeoutCallback;

    if (this.timeout && this.timeoutCallback) {
      setTimeout(function () {
        var blob = _this.startRecord();

        _this.timeoutCallback(blob);
      }, this.timeout);
    }
  }

  _createClass(Recorder, [{
    key: "canIuse",
    value: function canIuse() {
      this.canuse = navigator.getUserMedia != null;
    }
  }, {
    key: "throwError",
    value: function throwError(message) {
      throw new function () {
        this.toString = function () {
          return message;
        };
      }();
    }
  }, {
    key: "startRecord",
    value: function startRecord() {
      var _this2 = this;

      if (!this.canuse) {
        throw throwError('浏览器不支持');
      }

      window.navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(function (mediaStream) {
        // console.log(mediaStream);
        _this2.beginRecord(mediaStream);
      }).catch(function (error) {
        // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
        // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误 
        switch (error.code || error.name) {
          case 'PERMISSION_DENIED':
          case 'PermissionDeniedError':
            _this2.throwError('用户拒绝提供信息。');

            break;

          case 'NOT_SUPPORTED_ERROR':
          case 'NotSupportedError':
            _this2.throwError('浏览器不支持硬件设备。');

            break;

          case 'MANDATORY_UNSATISFIED_ERROR':
          case 'MandatoryUnsatisfiedError':
            _this2.throwError('无法发现指定的硬件设备。');

            break;

          default:
            _this2.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));

            break;
        }
      });
    }
  }, {
    key: "beginRecord",
    value: function beginRecord(mediaStream) {
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var mediaNode = audioContext.createMediaStreamSource(mediaStream); // 创建一个jsNode

      var jsNode = createJSNode(audioContext); // 需要连到扬声器消费掉outputBuffer，process回调才能触发
      // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音

      jsNode.connect(audioContext.destination);
      jsNode.onaudioprocess = this.onAudioProcess.bind(this); // 把mediaNode连接到jsNode

      mediaNode.connect(jsNode);
    }
  }, {
    key: "onAudioProcess",
    value: function onAudioProcess(event) {
      var audioBuffer = event.inputBuffer;
      var leftChannelData = audioBuffer.getChannelData(0),
          rightChannelData = audioBuffer.getChannelData(1); // 需要克隆一下

      this.leftDataList.push(leftChannelData.slice(0));
      this.rightDataList.push(rightChannelData.slice(0));
    }
  }, {
    key: "stopRecord",
    value: function stopRecord() {
      var leftData = mergeArray(this.leftDataList),
          rightData = mergeArray(this.rightDataList);
      var allData = interleaveLeftAndRight(leftData, rightData);
      var wavBuffer = createWavFile(allData);
      return new Blob([new Uint8Array(wavBuffer)], {
        type: 'audio/mp3'
      });
    }
  }]);

  return Recorder;
}();

if (window !== null) {
  window.Recorder = Recorder;
}

export default Recorder;
