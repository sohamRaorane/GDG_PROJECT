import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_u3qjqus';
const EMAILJS_TEMPLATE_ID = 'template_53hln9f';
const EMAILJS_PUBLIC_KEY = 'TNRBfrbnl5Uzp8sKR';

interface EmailAppointmentDetails {
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    serviceName: string;
    providerName: string;
    status: string;
}

export const sendAppointmentEmail = async (details: EmailAppointmentDetails) => {
    try {
        const templateParams = {
            to_name: details.customerName,
            to_email: details.customerEmail,
            appointment_date: details.date,
            appointment_time: details.time,
            service_name: details.serviceName,
            doctor_name: details.providerName,
            status: details.status,
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log('SUCCESS!', response.status, response.text);
        return response;
    } catch (error) {
        console.error('FAILED...', error);
        return null;
    }
};

export const sendOtpEmail = async (email: string, otp: string, purpose: string = 'Verification') => {
    try {
        const templateParams = {
            to_email: email,
            to_name: "Valued Member",
            subject: `${purpose} Code`,
            message: `Your ${purpose} code is: ${otp}. Do not share this with anyone.`,
        };

        console.log(`[MOCK EMAIL SERVICE] Sending OTP ${otp} to ${email}`, templateParams);

        // Uncomment to actually try sending if a generic template is available
        /*
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            "template_otp_generic", // Placeholder
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        return response;
        */
        return { status: 200, text: "Sent (Mock)" };
    } catch (error) {
        console.error('OTP Email Failed:', error);
        return null;
    }
};
