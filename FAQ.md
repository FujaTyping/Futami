# 🪄 FAQ - Frequently Asked Questions
## - 📻 Distube FAQ
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

## Source : [Distube discord server](https://discord.gg/feaDd9h)
## - 🔐 SSL FAQ
Don't forget to install [Openssl](https://www.openssl.org/source/)
1. Generate a key file used for self-signed certificate generation
```
openssl genrsa -out key.pem
```
2. Generate a certificate service request (CSR)
```
openssl req -new -key key.pem -out csr.pem
```
3. Generate your certificate by providing the private key created to sign it with the public key created in step two with an expiry date of **9,999 days**
```
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```
## Source : [adamtheautomator.com](https://adamtheautomator.com/https-nodejs/)
> If you want to use certbot : certbot renewtps://certbot.eff.org/
> 1. run `certbot certonly --manual` and follow the instructions
> 2. edit your **cert** and **key** in `index.js`<br>
> Want to renew run `certbot renew`
