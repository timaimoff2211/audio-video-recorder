document.addEventListener('DOMContentLoaded', () => {
  
  const recordBtn = document.getElementById('record-btn')
  const activateBtn = document.getElementById('activate-btn')
  const disActivateBtn = document.getElementById('disactivate-btn')
  const downloadBtn = document.getElementById('download-btn')
  const stopBtn = document.getElementById('stop-btn')
  const videoPlayer = document.getElementById('video-player')
  const previewPlayer = document.getElementById('preview')
  const statusText = document.getElementById('status-text')

  let mediaRecorder = null
  let mediaData = []

  const setStatusText = text => {
    statusText.textContent = text
  }

  const activateMedia = async e => {
    if(mediaData.length) mediaData = []
    switchDisplayedPlayers('preview')
    let stream = null
  
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      setStatusText('Предпросмотр')
      previewPlayer.srcObject = stream
      downloadBtn.href = stream
      preview.captureStream = preview.captureStream || preview.mozCaptureStream
      previewPlayer.addEventListener('loadedmetadata', e => {
        previewPlayer.play()
      })
      recordBtn.disabled = false
      disActivateBtn.disabled = false
      activateBtn.disabled = true
      downloadBtn.classList.add('hide')
    } catch(err) {
      console.log(err)
      console.log(err.response)
    }
  }

  const stopMedia = () => {
    const stream = previewPlayer.srcObject
    const tracks = stream.getTracks()

    tracks.forEach((track) => {
      track.stop();
    });

    previewPlayer.srcObject = null
    setStatusText('Камера и микрофона не активированы')
    recordBtn.disabled = true
    stopBtn.disabled = true
    activateBtn.disabled = false
    disActivateBtn.disabled = true
    downloadBtn.classList.add('hide')
  }

  const stopRecord = () => {
    mediaRecorder.stop()
    stopBtn.disabled = true
    activateBtn.disabled = false
    disActivateBtn.disabled = false
    disActivateBtn.disabled = true
    downloadBtn.classList.remove('hide')
    setStatusText('Просмотр записи')
    mediaRecorder.addEventListener('stop', recordStopHandler)
  }

  const startRecord = async () => {
    mediaRecorder = new MediaRecorder(previewPlayer.captureStream())
    mediaRecorder.start()
    recordBtn.disabled = true
    activateBtn.disabled = true
    disActivateBtn.disabled = true
    stopBtn.disabled = false
    downloadBtn.classList.add('hide')
    setStatusText('Идет запись')
    mediaRecorder.addEventListener('dataavailable', recordDataHandler)
  }

  const recordDataHandler = e => {
    mediaData.push(e.data)
  }

  const recordStopHandler = e => {
    e.currentTarget.stream.getTracks().forEach(track => track.stop())
    const recordedBlob = new Blob(mediaData, {
      type: 'video/webm'
    })
    const url = URL.createObjectURL(recordedBlob)
    videoPlayer.src = url
    downloadBtn.href = videoPlayer.src;
    const d = new Date();
    const date = d.toLocaleString();
    downloadBtn.download = `recorded-video-${date}.webm`;
    switchDisplayedPlayers('record')
  }

  const switchDisplayedPlayers = type => {
    if(type === 'preview') {
      videoPlayer.classList.remove('show')
      videoPlayer.classList.add('hide')
      previewPlayer.classList.remove('hide')
      previewPlayer.classList.add('show')
    } else if(type === 'record') {
      previewPlayer.classList.remove('show')
      previewPlayer.classList.add('hide')
      videoPlayer.classList.remove('hide')
      videoPlayer.classList.add('show')
    }
  }


  activateBtn.addEventListener('click', activateMedia)
  disActivateBtn.addEventListener('click', stopMedia)
  stopBtn.addEventListener('click', stopRecord)
  recordBtn.addEventListener('click', startRecord)

})