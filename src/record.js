import {interleaveLeftAndRight, mergeArray, createJSNode, createWavFile} from './helper';
//兼容
window.URL = window.URL || window.webkitURL;
//获取计算机的设备：摄像头或者录音设备
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
class Recorder {
    constructor(options) {
        this.leftDataList = [];
        this.rightDataList = [];
        this.canuse = true;
        this.mineType = options.mineType || 'audio/mp3';
        this.timeout = options.timeout;
        this.timeoutCallback = options.timeoutCallback;
        if(this.timeout && this.timeoutCallback) {
            setTimeout(() => {
                const blob = this.startRecord();
                this.timeoutCallback(blob);
            }, this.timeout)
        }
    }

    canIuse() {
        this.canuse = (navigator.getUserMedia != null);
    }

    throwError(message) {
        throw new function () { this.toString = function () { return message; } }
    }

    startRecord() {
        if(!this.canuse) {
            throw throwError('浏览器不支持');
        }
        window.navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(mediaStream => {
            // console.log(mediaStream);
            this.beginRecord(mediaStream);
        }).catch(error => {
            // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
            // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误 
            switch (error.code || error.name) {
                case 'PERMISSION_DENIED':
                case 'PermissionDeniedError':
                    this.throwError('用户拒绝提供信息。');
                    break;
                case 'NOT_SUPPORTED_ERROR':
                case 'NotSupportedError':
                    this.throwError('浏览器不支持硬件设备。');
                    break;
                case 'MANDATORY_UNSATISFIED_ERROR':
                case 'MandatoryUnsatisfiedError':
                    this.throwError('无法发现指定的硬件设备。');
                    break;
                default:
                    this.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                    break;
            }
        });
    }

    beginRecord(mediaStream) {
        let audioContext = new (window.AudioContext || window.webkitAudioContext);
        let mediaNode = audioContext.createMediaStreamSource(mediaStream);
        // 创建一个jsNode
        let jsNode = createJSNode(audioContext);
        // 需要连到扬声器消费掉outputBuffer，process回调才能触发
        // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
        jsNode.connect(audioContext.destination);
        jsNode.onaudioprocess = this.onAudioProcess.bind(this);
        // 把mediaNode连接到jsNode
        mediaNode.connect(jsNode);
    }

    onAudioProcess(event) {
        let audioBuffer = event.inputBuffer;
        let leftChannelData = audioBuffer.getChannelData(0),
            rightChannelData = audioBuffer.getChannelData(1);
        // 需要克隆一下
        this.leftDataList.push(leftChannelData.slice(0));
        this.rightDataList.push(rightChannelData.slice(0));
    }

    stopRecord() {
        let leftData = mergeArray(this.leftDataList),
            rightData = mergeArray(this.rightDataList);
        let allData = interleaveLeftAndRight(leftData, rightData);
        let wavBuffer = createWavFile(allData);
        return new Blob([new Uint8Array(wavBuffer)], { type: 'audio/mp3' });
    }
}

if(window !== null) {
    window.Recorder = Recorder;
}

export default Recorder;