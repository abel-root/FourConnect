const nodemailer = require('nodemailer');

class FourConnect {
    // Propriété privée
    #apikey;

    /**
     * @constructor
     * @param {string} apikey - La clé API à utiliser pour les requêtes.
     */
    constructor(apikey) {
        this.#apikey = apikey;
    }

    /**
     * Retourne la clé API.
     * @returns {string} La clé API.
     */
    getApikey() {
        return this.#apikey;
    }

    /**
     * Décode une chaîne encodée en base64URL.
     * @param {string} base64Url - La chaîne à décoder.
     * @returns {string} La chaîne décodée en UTF-8.
     */
    base64UrlDecode(base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(base64, 'base64').toString('utf8');
    }

    /**
     * Décode un token JWT en extrayant et en analysant le payload.
     * @param {string} token - Le token JWT à décoder.
     * @returns {object} L'objet JSON du payload décodé.
     */
    decodeToken(token) {
        const parts = token.split('.');
        const header = JSON.parse(this.base64UrlDecode(parts[0]));
        const payload = JSON.parse(this.base64UrlDecode(parts[1]));
        return {header,payload};
    }

    /**
     * Envoyer le lien de confirmation par email
     * @param {object} payload - object contenant l'email de l'utilisateur qui soite se connecter
     * @param {string} message - message à envoyer contenant le lien de confirmation
     * @param {string} admin_pwd - mot de passe de l'administrateur  ou l'application pour son compte gmail ou Yahoo
     * @param {string} admin_email - email de l'administrateur ou de l'application
     * @param {string} type_email - prend comme valeur, "Gmail", "Yahoo", ou etc.
     * @returns {boolean} L'état : si le lien à expirer (@returns false), si le lien est validé (@returns true)
     * 
     */

    sendConfirmationEmail = async (payload, message,admin_pwd,admin_email) => {
        const email = payload.email;
        //'olvn tvxp xcgc upyt' -> admin
        // Configurer le transporteur de mail
        const transporter = nodemailer.createTransport({
            //k.kouakouabel96@gmail.com ->admin
            service: this.gmail(admin_email) ,// Utilisez le service que vous voulez (Gmail, Yahoo, etc.)
            auth: {
                user: admin_email,
                pass:admin_pwd , // Attention à ne pas exposer ce mot de passe
            },
        });

        // Options de l'email
        const mailOptions = {
            from: admin_email,
            to: email,
            subject: 'Confirmation de votre inscription',
            text: message,
        };

        try {
            // Envoyer l'email
            const info = await transporter.sendMail(mailOptions)
            console.log('Email envoyé: ' + info.response);
            return info.response;
        } catch (error) {
            const message=`Erreur lors de l\'envoi de l\'email`
           console.error('Erreur lors de l\'envoi de l\'email:', error);
            return {message,error};
        }
    };
    
/**
 * @param {string} email - email de l'utilisateur
 * @returns {string} - le type de mail, soit GMAIL ou YAHOO
 */

    gmail=(email)=>{
        const gmail=email.split("@");
       const result=gmail[1].split(".")[0].toUpperCase();
        return  result;
    }

}

module.exports=FourConnect;

//let four = new FourConnect("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJwcm9maWwiOiJ2b3lhZ2V1ciIsImVtYWlsIjoiaW5nZW5pZXVycHJvYWJlbEBnbWFpbC5jb20iLCJ0ZWxzIjoiMDc2OTQ3NzI1NiIsImlhdCI6MTcyMzgwMzcwOCwiZXhwIjoxNzIzODE4MTA4fQ.uhGmLe3lRU-YjNS7Jnfe_AGtggKvE3bi49EnakSr8mY");
//const message='Cliquez sur le lien suivant pour confirmer votre inscription : https://example.com/confirm?token=123';
//console.log(four.sendConfirmationEmail(four.decodeToken(four.getApikey()).payload,message,'olvn tvxp xcgc upyt','k.kouakouabel96@gmail.com'));


