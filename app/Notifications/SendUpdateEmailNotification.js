import { Notification, MAIL, SMS } from "./Notification";
import CustomEmail from "../Emails/CustomEmail";

export class SendUpdateEmailNotification extends Notification {
    via() {
        return [MAIL, SMS];
    }

    toMail(notifiable) {
        return (new CustomEmail)
            .to(notifiable.email)
            .from('test@vicoders.com')
            .subject("update email")
            .greeting(`Hi ${notifiable.first_name}`)
            .line("Comfirm email:")
            .line(`<a href="nodetest.com/xxx/${notifiable.resetEmailToken}">Clink To link</a>`)
            .action("Button", "https://google.com")
            .line("At the end is a line of text");
    }
}