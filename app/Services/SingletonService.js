import DefaultService from './DefaultService';
let instance = null;
export default class SingletonService extends DefaultService {
  constructor() {
    super();
    if (!instance) {
      instance = this;
      instance.data = {};
      instance.User = {};
      instance.add = obj => {
        instance.data = Object.assign(instance.data, obj);
        return instance;
      };

      instance.UserLogin = obj => {
        instance.User = Object.assign(instance.User, obj);
        return instance;
      };

      instance.delete = key => {
        instance.data = Object.keys(instance.data).reduce((obj, curVal) => {
          if (curVal !== key) {
            obj[curVal] = instance.data[curVal];
          }
          return obj;
        }, {});
        return instance;
      };

      instance.update = (objKey, val) => {
        let newObj = {};
        newObj[objKey] = val;

        instance.delete(objKey).add(newObj);

        return instance;
      };

      instance.get = key => {
        return instance.data[key];
      };

      instance.getUserLogin = key => {
        return instance.User[key];
      };
      instance.getAll = () => {
        return {
          ...instance.data
        };
      };
    }
    return instance;
  }
}
