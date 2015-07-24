PiFlix
======
![PiFlix](http://i.imgur.com/cgDCsWV.png)

PiFlix is a free Popcorn Time alternative for your Raspberry Pi. It's powered by Node.js and uses:
- yts.to to fetch movie torrent data
- WebTorrent to stream the torrent data
- OMXPlayer to play the video on Raspberry Pi

Installation instructions:
- Flash raspbian to an SD card, and boot your Raspberry Pi from it
- ssh into your raspberry pi and install Node.js and OMXPlayer
- Download PiFlix as a zip file and extract it somewhere on your raspberry pi
- cd into the piflix directory and install all dependencies by running the command: npm install
- Start PiFlix with the command: npm start
- Browse to http://ip-of-your-pi:3000

Note:
This project is in very early alpha phase. There is still a lot TODO.
