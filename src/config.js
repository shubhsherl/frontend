export const data = {
    base: 'http://localhost:4000',
    channel: 'mychannel',
    chaincode: 'mycc',
    base_time: 1562025600, // => 02/07/2019 00:00:00
    date: '02/07/2019',
    freqs: [49.94,49.9,49.96,49.99,50.02,50.02,50.02,50.03,50.01,50.02,50.03,50.03,50.05,50.06,50.04,50.03,50.05,50.02,50.03,49.99,49.97,49.94,49.97,49.98,50,50.03,50.05,50.1,50.11,50.09,50.12,50.18,50.13,50.19,50.22,50.15,50.13,50.25,50.26,50.24,50.14,50.08,50.04,50.01,49.98,50,50,49.98,50.04,49.99,50,50.01,49.98,49.99,49.98,49.97,50.03,49.97,50,49.99,49.96,49.91,49.97,50,50.01,49.99,50.01,50.03,50.05,50,49.99,49.98,50.01,50.06,50.06,50.01,49.98,49.99,50.03,49.99,50,49.99,49.97,49.96,49.97,49.97,49.98,50.02,50.01,49.98,49.95,50.01,50,50,49.98,49.98],
    Org1: {
        username: 'Grid',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIyMDAyNjYsInVzZXJuYW1lIjoiTG9yZW0iLCJvcmdOYW1lIjoiT3JnMSIsImlhdCI6MTU2MjE2MDI2Nn0.hCIu0m7gdbfMXaNh9qXf1oEWey-OoFrGG-3VZ0MvWgg',
        permissions: ['initFreq', 'readFreq']
    },
    Org2: {
        username: 'Station',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIyMDAyNjgsInVzZXJuYW1lIjoiSXBzdW0iLCJvcmdOYW1lIjoiT3JnMiIsImlhdCI6MTU2MjE2MDI2OH0.bosweozp98pe4gTQRqO-cyVPpOKRJVD3jXcACMj3ajA',
        permissions: ['initBill','initUnit', 'readFreq', 'readBill', 'readUnit']
    },
    Org3: {
        username: 'Society',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjIyMDAyNzEsInVzZXJuYW1lIjoiRG9sb3IiLCJvcmdOYW1lIjoiT3JnMyIsImlhdCI6MTU2MjE2MDI3MX0.WjJs1-12iFH1jBLL3H_RS9McMLZHdkah9J2KzhXJcc8',
        permissions: ['readFreq', 'readBill', 'readUnit']
    }
}

