import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function configList(options?: { [key: string]: any }) {
  return request<{
    data: API.Result;
  }>('/api/kyc/config/list', {
    method: 'GET',
    params:{
      ...(options || {}),

    }
  });
}


export async function vendorList() {
  return request<{
    data: API.Result;
  }>('/api/kyc/vendor/list', {
    method: 'GET',
  });
}

export async function configInfo(options?: { [key: string]: any }) {
  return request<{
    data: API.Result;
  }>('/api/kyc/config/getById', {
    method: 'GET',
    params:{
      ...(options || {}),

    }
  });
}


export async function close(options?: { [key: string]: any }) {
  return request<{
    data: API.Result;
  }>('/api/kyc/config/close', {
    method: 'POST',
    params:{
      ...(options || {}),

    }
  });
}
