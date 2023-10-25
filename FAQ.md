# 🪄 FAQ - Frequently Asked Questions

1. **FFmpeg/avconv not found**<br>
!! **Do not** install `ffmpeg` npm package !!<br>
Uninstall it if installed.
```
npm uninstall ffmpeg
```
You need to install FFmpeg first.<br>
[Windows](https://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/) ● [Linux](https://www.tecmint.com/install-ffmpeg-in-linux/) ● [Offical](https://ffmpeg.org/download.html)

2. **Error: write EPIPE** (Song ends instantly without any errors)<br>
This is due to ffmpeg-static is not stable.<br>
Solution : **Fix with guild above**
```
npm uninstall ffmpeg-static
npm ci --no-optional
npm update
```
>If it still happens after using this workaround, delete `node_modules` folder and `package-lock.json` file then run `npm install`. It should work when `npm ls ffmpeg-static` returns (empty).

# Source : [Distube discord server](https://discord.gg/feaDd9h)
