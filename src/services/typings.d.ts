// @ts-ignore
/* eslint-disable */
declare namespace API {
  type Result = {
    code?: number;
    msg?: string;
    data?: any;
  };

  type CurrentUser = {
    name?: string;
    avatar?: string;
    phone?: string;
    
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type LoginParams = {
    phone?: string;
    password?: string;
  };

}
