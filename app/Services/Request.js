import _ from 'lodash';
import { create } from 'domain';

const HEADER_FORWARDED = 0b00001; // When using RFC 7239
const HEADER_X_FORWARDED_FOR = 0b00010;
const HEADER_X_FORWARDED_HOST = 0b00100;
const HEADER_X_FORWARDED_PROTO = 0b01000;
const HEADER_X_FORWARDED_PORT = 0b10000;
const HEADER_X_FORWARDED_ALL = 0b11110; // All "X-Forwarded-*" headers
const HEADER_X_FORWARDED_AWS_ELB = 0b11010; // AWS ELB doesn't send X-Forwarded-Host
const METHOD_HEAD = 'HEAD';
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_PATCH = 'PATCH';
const METHOD_DELETE = 'DELETE';
const METHOD_PURGE = 'PURGE';
const METHOD_OPTIONS = 'OPTIONS';
const METHOD_TRACE = 'TRACE';
const METHOD_CONNECT = 'CONNECT';
export default class Request {
  /**
   * Creates a new request with values from express's request.
   *
   * @return static
   */
  createFromRequest(req, res, next) {
    var reqd = create();
    return reqd;
  }

  all() {
    return _.assign({}, process.domain._req.query, process.domain._req.body);
  }
  /**
   * Clear the request
   *
   * @return void
   */
  clear() {
    process.domain._req = null;
  }
}
