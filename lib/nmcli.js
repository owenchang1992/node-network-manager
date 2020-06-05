const { exec } = require('child_process')

class Node_nmcli {
    constructor() {

    }

    stdParser(stdout) {
        let parse = stdout.trim().split('\n')
        let titles = parse[0].trim().split(/\s+/)
        let contents = []
        for ( let i = 1; i < parse.length; i++ ) {
            let newContens = {}
            let splitList = parse[i].trim().split(/\s+/)
            titles.forEach(( title, index) => {
                newContens[title.toLowerCase()] = splitList[index]
            });
            
            contents.push(newContens)
        }

        return contents
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
                }
                resolve(radioPaser(stdout))
            })
        })         
    }

    device() {
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                }
                resolve(this.stdParser(stdout))
            })
        })
    }

    wifiRescan() {
        return new Promise(( resolve, reject ) => {
            exec(`nmcli device wifi rescan`, (err, stdout, stderr) => {
                if (err | stderr) {
                    reject(err, stderr)
                }
                resolve(this.stdParser(stdout))
            })
        })
    }

}

module.exports = Node_nmcli