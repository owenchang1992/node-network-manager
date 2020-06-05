const Nmcli = require('../lib/nmcli');

const nodeNmcli = new Nmcli()

describe('test nmcli radio function', () => {
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
    })    
})