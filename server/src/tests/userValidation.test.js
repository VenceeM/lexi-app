import { isPasswordStrong, isValidEmail } from "../utils/userValidation.js"
import { expect } from 'chai';




describe('user validation', () => {
    it('Password should be not strong ', async () => {
        const result = isPasswordStrong('myPassword123')
        expect(result).to.equal(false);
    });

    it('Password should be strong', async () => {
        const result = isPasswordStrong('@myPassword123');
        expect(result).to.equal(true)
    })

    it('Email should not be valid', async () => {
        const result = isValidEmail('test');
        expect(result).to.equal(false);
    })

    it('Email shoud be valid', async () => {
        const result = isValidEmail('example@gmail.com');
        expect(result).to.equal(true)
    })
})


