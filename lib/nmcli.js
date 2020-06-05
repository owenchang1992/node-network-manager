const { exec } = require('child_process')

class Node_nmcli {
    constructor() {

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
}

module.exports = Node_nmcli