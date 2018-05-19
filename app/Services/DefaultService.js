import SingletonService from './SingletonService';
const env = process.env.APP_ENV;

export default class DefaultService {
    getSingleton () {
        return new SingletonService();
    }

    createResolveMessage(data) {
        return {
            'success': true,
            'data': data
        }
    }
    createRejectMessage(e, msg, code=500) {
        let message = 'Unexpected error';

        if (env === 'production') {
            message = msg;
        } else {
            if (e) {
                message = e;
            } else {
                message = msg;
            }
        }

        return {
            'success': false,
            'message': message,
            'code': code
        }
    }
    ServicePromise(fn) {
        let newFn =  (resolve, reject) =>{
            let resolveFn =  (resolver) => {
                return  (data) =>{
                    return resolver(this.createResolveMessage(data));
                };
            };
            let rejectFn = (rejector) => {
                return (e, code) =>{
                    return rejector(this.createRejectMessage(e, code));
                };
            };
            fn(resolveFn(resolve), rejectFn(reject))
        };
        return new Promise(newFn);
    }
    async noop () {
        return Promise.resolve(this.createResolveMessage(true));
    };
}