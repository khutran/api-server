const Request = jest.fn().mockImplementation(() => {
  return {
    get: function(param) {
      if (param) {
      }
      return 1;
    },
    has: function(param) {
      if (param) {
      }
      return true;
    }
  };
});

export default Request;
