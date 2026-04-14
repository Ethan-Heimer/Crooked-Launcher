const { setTimeout } = require('node:timers/promises');

let initialized = false;

async function CaptureKeys(){
    const readline = require('readline');
    
    // Enable keypress events on stdin
    readline.emitKeypressEvents(process.stdin);
    
    // Configure stdin to receive data character-by-character
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    let strokes = []
    process.stdin.on('keypress', (str, key) => {
        // key object contains properties like 'name', 'ctrl', 'meta', and 'shift'
        strokes.push(key.name)
    
        // Standard way to exit raw mode (Ctrl+C)
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }
    });

    while(!initialized){
        await setTimeout(1)
    }

    console.log("Sent")
    return strokes.join("");
}

const electron = require('./backend/electron-app')

CaptureKeys().then(res => {
    console.log("Lost Keys: " + res)

    electron.SendLostKeys(res);
})

async function Init(){
    initialized = await electron.InitializeApp('frontend/')
}
Init();

