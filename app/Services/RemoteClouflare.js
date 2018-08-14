import axios from 'axios';
import * as _ from 'lodash';
import { Exception } from '../Exceptions/Exception';

export class RemoteClouflare {
  constructor() {
    this.axios = axios.create();
    this.data = {};
  }

  getDomain(subDomain) {
    let arrDomain = _.split(subDomain, '.');
    let domain = '';
    let dem = 0;
    let length = arrDomain.length;
    const list = ['com', 'vn', 'info', 'net', 'org'];
    for (let i in arrDomain) {
      if (_.indexOf(list, arrDomain[parseInt(i)]) > -1 && _.indexOf(list, arrDomain[parseInt(i) + 1]) > -1) {
        domain = `${domain}.${arrDomain[i]}`;
        dem++;
      }
      if (parseInt(i) === length - 1 && _.indexOf(list, arrDomain[parseInt(i)]) > -1) {
        domain = `${domain}.${arrDomain[i]}`;
        dem++;
      }
    }
    _.reverse(arrDomain);
    domain = arrDomain[dem] + domain;
    return domain;
  }

  async getDetailsOfDns(website) {
    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    const zonesName = this.getDomain(website);
    const zones = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${zonesName}`, config);
    const result = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records?name=${website}`, config);
    return result;
  }

  async deleteDetails(website) {
    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    const zonesName = this.getDomain(website);
    const zones = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${zonesName}`, config);
    let detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records?name=${website}`, config);
    if (_.isEmpty(detail.data.result)) {
      throw new Exception(`${website} detail not found`, 204);
    }
    let result = await axios.delete(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records/${detail.data.result[0].id}`, config);
    return result;
  }

  async updateDns(website, ip) {
    const data = {
      type: 'A',
      name: website,
      content: ip
    };

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    if (_.isNil(data['name']) || _.isNil(data['content'])) {
      throw new Error('name or content not empty', 1000);
    }
    const zonesName = this.getDomain(website);
    const zones = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${zonesName}`, config);
    let detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records?name=${website}`, config);
    if (_.isEmpty(detail.data.result)) {
      throw new Error('detail not found', 204);
    }

    let result = await axios.put(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records/${detail.data.result[0].id}`, data, config);

    return result;
  }

  async getZoneByname(website) {
    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };

    let result = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${website}`, config);
    return result;
  }

  async createDns(website, ip) {
    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    const data = {
      type: 'A',
      name: website,
      content: ip,
      ttl: 120,
      priority: 10,
      proxied: false
    };
    const zonesName = this.getDomain(website);
    const zones = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${zonesName}`, config);
    const detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records?name=${website}`, config);

    if (!_.isEmpty(detail.data.result)) {
      throw new Error('detail is exits', 204);
    }

    let result = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zones.data.result[0].id}/dns_records`, data, config);
    return result;
  }
}
