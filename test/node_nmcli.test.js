const Nmcli = require('../lib/nmcli');

const nodeNmcli = new Nmcli()

describe('Test nmcli radio function', () => {
    it('Response should have WIFIHW, WIFI, WWANHW, WWAN properties', () => {
        nodeNmcli.radio()
            .then((res) => {
                expect(res).toEqual(expect.objectContaining({
                    WIFIHW: expect.any(String),
                    WIFI: expect.any(String),
                    WWANHW: expect.any(String),
                    WWAN: expect.any(String)
                }))
            })
            .catch((err) => {console.error('Test nmcli radio function', err)})
    })    
})

describe('Test nmcli device function', () => {
    it('Response contents should have device, type, state, connection properties', () => {
        nodeNmcli.device()
            .then((res) => {
                expect(res[0]).toEqual(expect.objectContaining({
                    device: expect.any(String),
                    type: expect.any(String),
                    state: expect.any(String),
                    connection: expect.any(String)
                }))
            })
            .catch((err) => {console.error('Test nmcli device function', err)})
    }) 
})

describe('Test nmcli wifiList function', () => {
    it('Response contents would be null', () => {
        nodeNmcli.wifiList()
            .then((res) => {
                expect(res[0]).toEqual(expect.objectContaining({
                    inuse: expect.any(String),
                    ssid: expect.any(String),
                    mode: expect.any(String),
                    chan: expect.any(String),
                    rate: expect.any(String),
                    signal: expect.any(String),
                    bars: expect.any(String),
                    security: expect.any(String)
                }))
            })
            .catch((err) => {console.error('Test nmcli device function', err)})
    }) 
})