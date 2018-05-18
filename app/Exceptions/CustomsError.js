export default class customsError {
  constructor(e = '', code = 500) {
    let error = new Error(e);
    return { message: error['message'], code: code };
  }
}
