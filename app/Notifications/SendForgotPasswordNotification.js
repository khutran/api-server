import { Notification, MAIL, SMS } from "./Notification";
import CustomEmail from "../Emails/CustomEmail";

export class SendForgotPasswordNotification extends Notification {
    via() {
        return [MAIL, SMS];
    }

    toMail(notifiable) {

        let resetUrl = process.env.APP_URL + '/reset-password';

        return (new CustomEmail)
            .to(notifiable.email)
            .from('test@vicoders.com')
            .subject("Forgot password")
            .greeting(`Hi ${notifiable.first_name}`)
            .line("Comfirm email:")
            .line(`<a href="${resetUrl}/?token=${notifiable.resetPasswordToken}">Clink To link</a>`)
            .action("Button", "https://google.com")
            .line("At the end is a line of text");
    }
}