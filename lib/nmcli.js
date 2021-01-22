const { exec, spawn } = require('child_process')
const EventEmitter = require('events');

class Node_nmcli extends EventEmitter{
    constructor() {
        super()
        this.monitor = null
    }

    stdParser(stdout) {
        let parse = stdout.trim().split('\n')
        let titles = parse[0].trim().split(/\s+/)
        let contents = []
        for ( let i = 1; i < parse.length; i++ ) {
            let newContens = {}
            let splitList = parse[i].split(/\s+/)
            titles.forEach(( title, index) => {
                newContens[title.replace('-','').toLowerCase()] = splitList[index]
            });
            
            contents.push(newContens)
        }

        return contents
    }

    startMonitor() {
        console.log('start monitor')
        this.monitor = spawn('nmcli', ['monitor'])

        this.monitor.stdout.on('data', (data) => {
            if (data.indexOf('connected') !== -1 ) {
                this.emit('connected', data.toString() )
            }
            this.emit( 'data', data.toString() )
        })

        this.monitor.stderr.on('data', (data) => {
            this.emit( 'error', data.toString() )
        });

        this.monitor.on('close', (code) => {
            this.emit( 'data', `child process close all stdio with code ${code}` )
        });
          
        this.monitor.on('exit', (code) => {
            this.emit( 'data', `child process exited with code ${code}` )
        });
    }

    radio() {
        let radioPaser = (stdout) => {
            let radiaState = {}
            let parse = stdout.trim().split('\n')
            let title = parse[0].trim().split(/\s+/)
            let contents = parse[1].trim().split(/\s+/)

            title.forEach((element, index) => {
                radiaState[element.replace('-','')] = contents[index]
            });
            return radiaState
        }

        return new Promise(( resolve, reject ) => {
            exec(`nmcli radio`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                } else {
                    resolve(radioPaser(stdout))
                }                
            })
        })         
    }

    device() {
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                } else {
                    resolve(this.stdParser(stdout))
                }                
            })
        })
    }

    wifiRescan() {
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device wifi rescan`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                } else {
                    resolve(stdout)
                }                
            })
        })
    }

    wifiList() {
        let stdParser = stdout => {
            let parse = stdout.trim().split('\n')
            let titles = parse[0].trim().split(/\s+/)
            let contents = []
            for ( let i = 1; i < parse.length; i++ ) {
                let newContens = {}
                let splitList = parse[i].replace('WPA1 WPA2', 'WPA1,WPA2').replace(' Mbit/s', 'Mbit/s').split(/\s+/)
                titles.forEach(( title, index) => {
                    newContens[title.replace('-','').toLowerCase()] = splitList[index].replace('Mbit/s', ' Mbit/s')
                });
                
                contents.push(newContens)
            }

            return contents
        }
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device wifi list`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                } else {
                    resolve(stdParser(stdout))
                }                
            })
        })
    }

    wifiConnect(ssid, password) {
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device wifi connect ${ssid} password ${password}`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                } else {
                    resolve(stdout)
                }                
            })
        })
    }
}

module.exports = Node_nmcli