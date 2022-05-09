import React, { useEffect, useRef } from 'react';
// import data from './song.json'

const AudioComponent = () => {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio: HTMLAudioElement | null = audioRef.current
    if (!audio) {
      console.error('Sorry! No HTML5 Audio was found on this page');
      return;
    }
    audio.addEventListener('loadeddata', () => {
      console.log(`audio duration ${audio.duration}`);
      // The duration variable now holds the duration (in seconds) of the audio clip
    })
    // audio.src = `data:audio/mp3;base64,${data.text}`
  })
  return (
    <div>
      <audio ref={audioRef} controls>
        <source src='http://hi5.1980s.fm/;' type='audio/mpeg'/>
      </audio>
    </div>
  )
}

export default AudioComponent;