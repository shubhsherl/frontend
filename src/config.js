export const data = {
    base: 'http://localhost:4000',
    channel: 'mychannel',
    chaincode: 'mycc',
    base_time: 1562025600, // => 02/07/2019 00:00:00
    date: '02/07/2019',
    freqs: [49.94,49.9,49.96,49.99,50.02,50.02,50.02,50.03,50.01,50.02,50.03,50.03,50.05,50.06,50.04,50.03,50.05,50.02,50.03,49.99,49.97,49.94,49.97,49.98,50,50.03,50.05,50.1,50.11,50.09,50.12,50.18,50.13,50.19,50.22,50.15,50.13,50.25,50.26,50.24,50.14,50.08,50.04,50.01,49.98,50,50,49.98,50.04,49.99,50,50.01,49.98,49.99,49.98,49.97,50.03,49.97,50,49.99,49.96,49.91,49.97,50,50.01,49.99,50.01,50.03,50.05,50,49.99,49.98,50.01,50.06,50.06,50.01,49.98,49.99,50.03,49.99,50,49.99,49.97,49.96,49.97,49.97,49.98,50.02,50.01,49.98,49.95,50.01,50,50,49.98,49.98],
    Org1: {
        username: 'Grid',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIxMzI5MDMsInVzZXJuYW1lIjoiTG9yZW0iLCJvcmdOYW1lIjoiT3JnMSIsImlhdCI6MTU2MjA5MjkwM30.yAQOWPkQlhcDens7Yn5CKn4-I002DQtq_NdzYyck9DU',
        permissions: ['initFreq', 'readFreq']
    },
    Org2: {
        username: 'Station',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIxMzI5MDgsInVzZXJuYW1lIjoiSXBzdW0iLCJvcmdOYW1lIjoiT3JnMiIsImlhdCI6MTU2MjA5MjkwOH0.US7wQ9rWngTcsjnAz-GmJP6wIxL_7Sv-hGXJ_zIzb54',
        permissions: ['initUnit','initBill', 'readFreq', 'readBill', 'readUnit']
    },
    Org3: {
        username: 'Society',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIxMzI5MTIsInVzZXJuYW1lIjoiRG9sb3IiLCJvcmdOYW1lIjoiT3JnMyIsImlhdCI6MTU2MjA5MjkxMn0.jxRwYc2DZv9ulCQT9FpdFcgnQl98TAxsJj0TMaeFCS8',
        permissions: ['readFreq', 'readBill', 'readUnit']
    }
}

