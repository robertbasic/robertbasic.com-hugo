+++
draft = false
date = 2018-02-21T20:56:03+01:00
title = "My OBS setup for recording screencasts"
slug = "my-obs-setup-for-recording-screencasts"
description = "Finally configured OBS in a way that I'm happy with"
tags = ["obs", "screencasts", "recording", "about"]
categories = ["Software", "Blablabla"]
2018 = ["02"]
+++

Last year I started [recording my contributions to open source](https://robertbasic.com/blog/recording-screencasts-of-oss-contributions/). I wasn't really regular, so today I published only the 9th episode: [OSS Contribution 9](https://www.youtube.com/watch?v=iS1HJUGPEyo).

Anyway, now I'm at the point where I am happy with the overall quality of the recording, both with the video and the audio and I want to write down the current setup so that I can recreate it in the future if I need to.

I'm using a [Sennheiser GSP 300 headset](https://en-us.sennheiser.com/gaming-headset-gsp-300) and the microphone that comes with it. A really great product, I love it.

PulseAudio is responsible for the audio in my Fedora system. In the "Input Devices" settings of PulseAudio, I have set the "loudness" of the microphone to 25% or -35.94dB. I got there after a lot of trial and error.

As for the recording software, I was first using Zoom, which is a video conferencing and screen sharing tool. Start a meeting with myself, share screen, record. Buuut... I was never really happy with the audio.

I tried out [Open Broadcaster Software](https://obsproject.com/), or OBS, last week. Again, after a lot of trial and error, I think I have the perfect settings given the hardware that I'm using. I picked it up from [Swizec](https://twitter.com/Swizec), he's using it for his live coding sessions I believe.

**"Settings > Output"**: Output mode: simple, video bitrate: 2500, encode: software (x264), audio bitrate: 160, recording quality: indistinguishable quality, recording format: mp4. **"Settings > Audio"**: Sample rate: 44.1khz, the rest is all default. **"Settings > Video"**: Base resolution: 1920x1080, output resolution 1920x1080, the rest is default.

The most improvement came from setting filters on the microphone &mdash; "Mic/Aux > gear icon > Filters". The first filter I added is **"Noise Suppression"** with a value of -17. The second filter is **"Noise Gate"** with a "Close Threshold" of -44, "Open Threshold" of -42, "Attack Time" 25ms, "Hold Time" 200ms, and "Release Time" 150ms. These last three might be the defaults, I'm not sure. I did play around with them.

Now, I said I'm happy with the audio, but I know it can be much better. One, I need to speak louder, and two, if these screencast become a more regular thing then I'll invest in a better microphone. Until then, this will do.

Happy hackin'!
