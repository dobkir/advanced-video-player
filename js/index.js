'use strict'
/// General variables
const videoFrame = document.querySelector('.video-presentation')
const videoPlayer = videoFrame.querySelector('.video-viewer')
const playVideoButton = videoFrame.querySelector('.play-video-button')
const videoThumbnails = []
let skipStepLength = 5


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
const timelineTooltip = videoFrame.querySelector('.timeline-tooltip')
const timelineTooltipImg = videoFrame.querySelector('.timeline-tooltip-img')
const timelineTooltipTime = videoFrame.querySelector('.timeline-tooltip-time')
const currentTimeOutput = videoFrame.querySelector('.time__currenttime')
const durationTimeOutput = videoFrame.querySelector('.time__duration')
const volumeBar = videoFrame.querySelector('.volume')


/// Events

// Preload timeline tooltip thumbnail snapshots
videoPlayer.addEventListener('canplay', preloadVideoThumbnails)
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

function preloadVideoThumbnails() {
  const videoTemporaryCopy = videoPlayer.cloneNode(true)
  document.body.appendChild(videoTemporaryCopy)
  videoTemporaryCopy.style.display = "none"

  let videoThumbnailsInterval = videoPlayer.duration < 120 ? 1 :
    videoPlayer.duration < 300 ? 2 :
      videoPlayer.duration < 600 ? 3 :
        5
  const thumbnailWidth = 120
  const thumbnailHeight = 70

  videoTemporaryCopy.addEventListener(
    'loadeddata',
    async function setThumbs() {
      for (let i = 0; i <= videoTemporaryCopy.duration; i = i + (videoThumbnailsInterval)) {
        const canvas = document.createElement('canvas')
        canvas.width = thumbnailWidth
        canvas.height = thumbnailHeight

        const context = canvas.getContext('2d')
        videoTemporaryCopy.currentTime = i

        await new Promise(function (resolve) {
          const event = function () {
            context?.drawImage(videoTemporaryCopy, 0, 0, thumbnailWidth, thumbnailHeight)
            const url = canvas.toDataURL('image/jpeg')
            videoThumbnails.push({ sec: i, url })
            videoTemporaryCopy.removeEventListener('canplay', event)
            resolve()
          }
          videoTemporaryCopy.addEventListener('canplay', event)
        })
      }
      setTimeout(() => document.body.removeChild(videoTemporaryCopy))
      console.log('video thumbnails loaded')
    }, false
  )
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
  videoPlayer.currentTime -= skipStepLength
}

function stepVideoForward() {
  videoPlayer.currentTime += skipStepLength
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

function toggleVolumeControlView(value) {
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

function endVideoPlayback() {
  stopVideo()
  videoFrame.classList.add('hover')
}

// Convert seconds to h:mm:ss or mm:ss format
function formatTime(time) {
  const seconds = (time = Math.trunc(time)) % 60
  const minutes = Math.trunc(time / 60) % 60
  const hours = Math.trunc(time / 60 / 60)
  return `${hours ? `${hours}:` : ""}${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

function showPlaybackTime() {
  currentTimeOutput.textContent = formatTime(videoPlayer.currentTime)
  durationTimeOutput.textContent = formatTime(videoPlayer.duration)
}

function updateTimelineBar() {
  let videoCurrentTime = Math.round(videoPlayer.currentTime)
  let videoTotalLength = Math.round(videoPlayer.duration)
  let value = (videoCurrentTime * 100 / videoTotalLength) || 0
  updateProgressBar(timelineBar, value)

  currentTimeOutput.textContent = formatTime(videoCurrentTime)
}

function updateTimelineTooltip(event) {
  const timePoint = Math.round((event.offsetX / event.target.clientWidth) * videoPlayer.duration)
  timelineBar.setAttribute('data-time-point', timePoint)
  timelineTooltipTime.textContent = formatTime(timePoint)
  const rect = videoPlayer.getBoundingClientRect()
  timelineTooltip.style.left = `${event.pageX - rect.left - 45}px`

  videoThumbnails.forEach(element => {
    if (element.sec === timePoint) {
      timelineTooltipImg.style.background = `url(${element.url}) 50% 50% no-repeat`
    }
  })
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
    toggleVolumeControlView(value)
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

function changeSkipStepLength(time) {
  return skipStepLength = time
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
    changeSkipStepLength(timeInterval)
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
