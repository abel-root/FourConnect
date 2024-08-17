const FourConnect = require("..");
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('FourConnect', () => {
    let four;

    beforeEach(() => {
        four = new FourConnect("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJwcm9maWwiOiJ2b3lhZ2V1ciIsImVtYWlsIjoiaW5nZW5pZXVycHJvYWJlbEBnbWFpbC5jb20iLCJ0ZWxzIjoiMDc2OTQ3NzI1NiIsImlhdCI6MTcyMzgwMzcwOCwiZXhwIjoxNzIzODE4MTA4fQ.uhGmLe3lRU-YjNS7Jnfe_AGtggKvE3bi49EnakSr8mY");
    });

    it('should return the correct API key', () => {
        expect(four.getApikey()).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJwcm9maWwiOiJ2b3lhZ2V1ciIsImVtYWlsIjoiaW5nZW5pZXVycHJvYWJlbEBnbWFpbC5jb20iLCJ0ZWxzIjoiMDc2OTQ3NzI1NiIsImlhdCI6MTcyMzgwMzcwOCwiZXhwIjoxNzIzODE4MTA4fQ.uhGmLe3lRU-YjNS7Jnfe_AGtggKvE3bi49EnakSr8mY");
    });

    it('should decode a JWT token correctly', () => {
        const payload = four.decodeToken(four.getApikey()).payload;
        expect(payload.userId).toBe(12);
        expect(payload.email).toBe("ingenieurproabel@gmail.com");
    });

    it('should send an email successfully', async () => {
        const sendMailMock = jest.fn().mockResolvedValue({ response: '250 OK' });

        // Simuler nodemailer.createTransport().sendMail()
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const payload = four.decodeToken(four.getApikey()).payload;
        const message = 'Cliquez sur le lien suivant pour confirmer votre inscription : https://example.com/confirm?token=123';

        const response = await four.sendConfirmationEmail(payload, message, 'olvn tvxp xcgc upyt', 'k.kouakouabel96@gmail.com');

        expect(response).toBe('250 OK');
        expect(sendMailMock).toHaveBeenCalledTimes(1);
    });

    it('should handle email sending errors', async () => {
        const sendMailMock = jest.fn().mockRejectedValue(new Error('Erreur lors de l\'envoi de l\'email'));

        // Simuler nodemailer.createTransport().sendMail()
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const payload = four.decodeToken(four.getApikey()).payload;
        const message = 'Cliquez sur le lien suivant pour confirmer votre inscription : https://example.com/confirm?token=123';

        const response = await four.sendConfirmationEmail(payload, message, 'olvn tvxp xcgc upyt', 'k.kouakouabel96@gmail.com');

        expect(response.message).toBe('Erreur lors de l\'envoi de l\'email');
        expect(sendMailMock).toHaveBeenCalledTimes(1);
    });
});