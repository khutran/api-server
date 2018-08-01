import { Notification, MAIL} from "./Notification";
import StyleMailer from "../Emails/StyleMailer";

export class SendFlauntNotification extends Notification {
    via() {
        return [MAIL];
    }

    toMail(notifiable) {
        return (new StyleMailer)
            .to(notifiable.email)
            .data(notifiable.data)
            .template('flaunt_' + notifiable.type);
    }
}