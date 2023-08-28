import { Request, Response } from 'express';
export default {
  // 支持值为 Object 和 Array
  'GET /api/kyc/config/list': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: {
        total: 5,
        current: 1,
        records: [
          {
            id: 1,
            code: 'OCR',
            vendor: 'regula',
            status: true,
            gmtCreate: '2020-08-01',
            modifyBy: '程振涛',
          },
          {
            id: 2,
            code: 'OCR2',
            vendor: 'regula2',
            status: true,
            gmtCreate: '2020-08-05',
            modifyBy: '程振涛',
          },
        ],
      },
    });
  },
  'GET /api/kyc/vendor/list': (req: Request, res: Response) => {
    res.send({ data: ['regula', '望为', 'fastDB'], success: true });
  },

  'GET /api/kyc/config/getById': (req: Request, res: Response) => {
    res.send({
      data: {
        id: 1,
        code: 'OCR',
        vendor: 'regula',
        status: true,
        gmtCreate: '2020-08-01',
        modifyBy: '程振涛',
      },
      success: true,
    });
  },

  'POST /api/kyc/config/close': (req: Request, res: Response) => {
    res.send({
      success: true,
    });
  },
};
