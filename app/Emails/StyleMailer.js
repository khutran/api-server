import sqs from '../Utils/Aws/SqsUtil';
import * as _ from 'lodash';

export default class StyleMailer {

    to(to) {
        if (_.isNil(to)) {
            throw new Exception("receiver's email is required");
        }
        this.to = to;
        return this;
    }

    data(data) {
        if (_.isNil(data)) {
            throw new Exception("email data is required");
        }
        this.data = data;
        return this;
    }

    template(name) {
        if (_.isNil(name)) {
            throw new Exception("sender's email is required");
        }
        this.template = name;
        return this;
    }

    send() {
        let destination = process.env.SQS_DESTINATION;
        let dataMerge = {
            data: JSON.stringify(this.data),
            type: this.template,
            recipient: this.to
        };
        return sqs.sendQueue(destination, dataMerge);
    }
}