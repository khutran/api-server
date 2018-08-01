import { Notification, MAIL } from './Notification';
import CustomEmail from '../Emails/CustomEmail';

export class SendWelcomeEmailNotification extends Notification {
  via() {
    return [MAIL];
  }

  toMail(notifiable) {
    return new CustomEmail()
      .to(notifiable.email)
      .from('test@vicoders.com')
      .subject('wellcome')
      .greeting(`Hi ${notifiable.first_name}`)
      .line('hello !')
      .action('Button', 'https://google.com')
      .line('At the end is a line of text');
  }
}
