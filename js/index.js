///Tutorial for the educational project. Delete in the working project.

// width и height — ширина и высота контейнера для проигрывания видео;
// videoWidth и videoHeight — внутреннее значение ширины и высоты видео, если размеры не известны, равны 0;
// poster — ссылка на картинку, которую можно показывать, пока видео недоступно(обычно это один
// из первых непустых кадров).

// Состояние сети и готовность к работе
// src — ссылка(url) на воспроизводимый контент
// buffered — буферизованные куски видео

// Воспроизведение и контролы
// currentTime — текущий момент проигрывания(с.)
// duration — длительность медиа - контента(с.)
// playbackRate - скорость воспроизведения (нормальная - 1.0)
// paused — находится ли воспроизведение на паузе
// ended — закончилось ли проигрывание
// muted — включение / выключение звука
// volume — уровень звука[0, 1]
// play() — начать проигрывание
// pause() — поставить на паузу

// События
// oncanplay — можно начать проигрывание
// ontimeupdate — изменена позиция проигрывания
// onplay — запущено проигрыв
// onpause — нажата пауза
// onended — воспроизведение закончилось


/// General variables
const videoFrame = document.querySelector('.video-presentation')
const videoPlayer = videoFrame.querySelector('.video-viewer')
const playVideoButton = videoFrame.querySelector('.play-video-button')
let stepLength = 5

/// Controls
const controlButtons = videoFrame.querySelectorAll('.control-button')
const controlPlay = videoFrame.querySelector('.play-icon')
const controlStepBack = videoFrame.querySelector('.step-back-icon')
const controlStepForward = videoFrame.querySelector('.step-forward-icon')
const controlVolume = videoFrame.querySelector('.volume-icon')
const controlVideoSettings = videoFrame.querySelector('.settings-icon')
const videoSettings = videoFrame.querySelector('.video-settings')
const playbackSpeedOptionsList = videoSettings.querySelectorAll('.playback-speed_variant')
const stepLengthsOptionsList = videoSettings.querySelectorAll('.step-legth_variant')
const controlFullscreen = videoFrame.querySelector('.fullscreen-icon')
const timelineBar = videoFrame.querySelector('.timeline')
const timelineTooltip = document.querySelector('.timeline-tooltip')
const currentTimeOutput = videoFrame.querySelector('.time__currenttime')
const durationTimeOutput = videoFrame.querySelector('.time__duration')
const volumeBar = videoFrame.querySelector('.volume')

/// Predicates
let hasHours = false


/// Events

// Click on the big play button
playVideoButton.addEventListener('click', toggleVideoPlayback)
// Click on the video viewer area
videoPlayer.addEventListener('click', pauseVideo)
// Click on the playback control button
controlPlay.addEventListener('click', toggleVideoPlayback)
// Click on the step back control button
controlStepBack.addEventListener('click', stepVideoBack)
// Click on the step forward control button
controlStepForward.addEventListener('click', stepVideoForward)
// Click on the volume control button
controlVolume.addEventListener('click', toggleVolume)
// When video is ready to play
videoPlayer.addEventListener('canplay', showPlaybackTime)
// Update the position on a timeline
videoPlayer.addEventListener('timeupdate', updateTimelineBar)
// Show current time tooltip moving the mouse on the timeline
timelineBar.addEventListener('mousemove', updateTimelineTooltip)
// Actions on video end event
videoPlayer.addEventListener('ended', endVideoPlayback)
// Manual value changes on the progress bars
videoFrame.addEventListener('input', handleProgressBarChanges)
// Open video settings
controlVideoSettings.addEventListener('click', toggleSettingsVisibility)
// Video settings event listener
videoSettings.addEventListener('click', handleVideoSettings)
// Switching to full screen mode and back
controlFullscreen.addEventListener('click', toggleFullscreen)

/// Functions

function changeOneIconToOther(changeableIcon = '', currentIcon = '') {
  controlButtons.forEach(button => {
    if (button.classList.contains(changeableIcon)) {
      button.classList.remove(changeableIcon)
      button.classList.add(currentIcon)
    }
  })
}

function playVideo() {
  videoPlayer.play()
  videoFrame.classList.remove('hover')
  changeOneIconToOther('play-icon', 'pause-icon')
  controlPlay.title = "Pause"
  changeOneIconToOther('reload-icon', 'pause-icon')
  playVideoButton.classList.add('hidden')
}

function pauseVideo() {
  videoPlayer.pause()
  changeOneIconToOther('pause-icon', 'play-icon')
  controlPlay.title = "Play"
  if (playVideoButton.classList.contains('hidden')) {
    playVideoButton.classList.remove('hidden')
  }
}

function stopVideo() {
  changeOneIconToOther('pause-icon', 'reload-icon')
  controlPlay.title = "Replay"
  videoPlayer.currentTime = videoPlayer.duration
  videoPlayer.pause()
}

function stepVideoBack() {
  videoPlayer.currentTime -= stepLength
}

function stepVideoForward() {
  videoPlayer.currentTime += stepLength
}

function playSound(value) {
  changeOneIconToOther('mute-icon', 'medium-volume-icon')
  controlVolume.title = "Mute"
  videoPlayer.muted = false
  updateVolumeBar(value)
}

function muteSound() {
  if (controlVolume.classList.contains('low-volume-icon')) {
    changeOneIconToOther('low-volume-icon', 'mute-icon')
  } else if (controlVolume.classList.contains('medium-volume-icon')) {
    changeOneIconToOther('medium-volume-icon', 'mute-icon')
  } else if (controlVolume.classList.contains('full-volume-icon')) {
    changeOneIconToOther('full-volume-icon', 'mute-icon')
  }
  controlVolume.title = "Unmute"
  videoPlayer.muted = true
  updateVolumeBar(0)
}

function toggleVideoPlayback() {
  if (videoPlayer.paused) {
    playVideo()
  } else {
    pauseVideo()
  }
}

function toggleVolume() {
  if (videoPlayer.muted) {
    playSound(40)
  } else {
    muteSound()
  }
}

function endVideoPlayback() {
  stopVideo()
  videoFrame.classList.add('hover')
}

// Convert seconds to hh:mm:ss or mm:ss format
function formatTime(time, hasHours) {
  let hours = 0
  let minutes = 0
  let seconds = 0

  if (hasHours) {
    hours = Math.floor(time / 3600)
    time = time - hours * 3600

    minutes = Math.floor(time / 60)
    seconds = Math.floor(time % 60)

    return `${hours.lead0(2)}:${minutes.lead0(2)}:${seconds.lead0(2)}`
  } else {
    minutes = Math.floor(time / 60)
    seconds = Math.floor(time % 60)

    return `${minutes.lead0(2)}:${seconds.lead0(2)}`
  }
}

Number.prototype.lead0 = function (digits) {
  let timer = '' + this
  while (timer.length < digits) {
    timer = '0' + timer
  }
  return timer
}

function showPlaybackTime() {
  // Determine whether to display the number of hours in the video player?
  hasHours = (videoPlayer.duration / 3600) >= 1.0
  durationTimeOutput.textContent = formatTime(videoPlayer.duration, hasHours)
  currentTimeOutput.textContent = formatTime(value = 0, hasHours)
}

function updateTimelineBar() {
  let videoCurrentTime = Math.round(videoPlayer.currentTime)
  let videoTotalLength = Math.round(videoPlayer.duration)
  let value = (videoCurrentTime * 100 / videoTotalLength) || 0
  updateProgressBar(timelineBar, value)

  currentTimeOutput.textContent = formatTime(videoCurrentTime, hasHours)
}

function updateTimelineTooltip(event) {
  const timePoint = Math.round((event.offsetX / event.target.clientWidth) * videoPlayer.duration)
  timelineBar.setAttribute('data-time-point', timePoint)
  timelineTooltip.textContent = formatTime(timePoint, hasHours)
  const rect = videoPlayer.getBoundingClientRect()
  timelineTooltip.style.left = `${event.pageX - rect.left - 16}px`
}

function updateVolumeBar(value) {
  videoPlayer.volume = value / 100
  updateProgressBar(volumeBar, value)
}

function updateProgressBar(bar, value) {
  bar.value = value
  bar.style.background = `linear-gradient(to right, #1181A6 0%, #1181A6 ${value}%, #b3b3b3 ${value}%, #b3b3b3 100%)`
}

function handleProgressBarChanges(event) {
  const target = event.target
  const value = target.value

  if (target === timelineBar) {
    videoPlayer.currentTime = value * videoPlayer.duration / 100
  }

  if (target === volumeBar) {
    playSound(value)
    updateVolumeBar(value)
    if (value == 0) {
      if (controlVolume.classList.contains('low-volume-icon')) {
        changeOneIconToOther('low-volume-icon', 'mute-icon')
      } else if (controlVolume.classList.contains('medium-volume-icon')) {
        changeOneIconToOther('medium-volume-icon', 'mute-icon')
      } else if (controlVolume.classList.contains('full-volume-icon')) {
        changeOneIconToOther('full-volume-icon', 'mute-icon')
      }
    } else if (value < 33.3) {
      if (controlVolume.classList.contains('mute-icon')) {
        changeOneIconToOther('mute-icon', 'low-volume-icon')
      } else if (controlVolume.classList.contains('medium-volume-icon')) {
        changeOneIconToOther('medium-volume-icon', 'low-volume-icon')
      } else if (controlVolume.classList.contains('full-volume-icon')) {
        changeOneIconToOther('full-volume-icon', 'low-volume-icon')
      }
    } else if (value < 66.6) {
      if (controlVolume.classList.contains('mute-icon')) {
        changeOneIconToOther('mute-icon', 'medium-volume-icon')
      } else if (controlVolume.classList.contains('low-volume-icon')) {
        changeOneIconToOther('low-volume-icon', 'medium-volume-icon')
      } else if (controlVolume.classList.contains('full-volume-icon')) {
        changeOneIconToOther('full-volume-icon', 'medium-volume-icon')
      }
    } else if (value <= 100) {
      if (controlVolume.classList.contains('mute-icon')) {
        changeOneIconToOther('mute-icon', 'full-volume-icon')
      } else if (controlVolume.classList.contains('low-volume-icon')) {
        changeOneIconToOther('low-volume-icon', 'full-volume-icon')
      } else if (controlVolume.classList.contains('medium-volume-icon')) {
        changeOneIconToOther('medium-volume-icon', 'full-volume-icon')
      }
    }
  }
}

function toggleSettingsVisibility() {
  if (videoSettings.classList.contains('hidden')) {
    videoSettings.classList.remove('hidden')
  } else {
    videoSettings.classList.add('hidden')
  }
}

function togglePlaybackSpeedActiveLink(targetElem) {
  playbackSpeedOptionsList.forEach(element => {
    if (element == targetElem && !element.classList.contains('active-variant')) {
      element.classList.add('active-variant')
    } else {
      element.classList.remove('active-variant')
    }
  });
}

function toggleStepLengthActiveLink(targetElem) {
  stepLengthsOptionsList.forEach(element => {
    if (element == targetElem && !element.classList.contains('active-variant')) {
      element.classList.add('active-variant')
    } else {
      element.classList.remove('active-variant')
    }
  });
}

function changeVideoPlaybackSpeed(speed) {
  return videoPlayer.playbackRate = speed
}

function changeStepLength(time) {
  return stepLength = time
}

function handleVideoSettings(event) {
  const target = event.target

  if (target.classList.contains('playback-speed_variant')) {
    let playbackSpeed = target.textContent === 'normal' ? 1 : parseFloat(target.textContent)

    changeVideoPlaybackSpeed(playbackSpeed)
    togglePlaybackSpeedActiveLink(target)
  }

  if (target.classList.contains('step-legth_variant')) {
    let timeInterval = parseInt(target.textContent)

    controlStepBack.title = `Step back ${timeInterval}sec`
    controlStepForward.title = `Step forward ${timeInterval}sec`
    changeStepLength(timeInterval)
    toggleStepLengthActiveLink(target)
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    changeOneIconToOther('fullscreen-icon', 'fullscreen-exit-icon')
    controlFullscreen.title = "Exit fullscreen"
    videoFrame.requestFullscreen().catch(err => {
      alert(`Error to enable fullscreen mode: ${err.message} (${err.name})`)
    })
  } else {
    changeOneIconToOther('fullscreen-exit-icon', 'fullscreen-icon')
    controlFullscreen.title = "Fullscreen"
    document.exitFullscreen()
  }
}
