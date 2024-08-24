import { expect } from "chai";
import { generateOtp, verifyOtp } from '../utils/otp.js'


describe('Otp', () => {
    it('should generate otp secret', async () => {
        const result = await generateOtp()
        console.log(result);
        expect(result).not.equal(undefined)
    })

    it('should generate otp secret and verify', async () => {
        const { otp, secret } = await generateOtp()
        const verify = await verifyOtp(otp, secret)
        console.log(otp);
        console.log(verify)
        expect(verify).to.equal(true)
    })
})