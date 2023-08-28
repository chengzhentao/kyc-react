import React, { useRef, useState, useEffect } from 'react';
import { vendorList, configList, configInfo, close } from '@/services/kyc';
import { PlusOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Switch, Modal, message } from 'antd';
import {
  PageContainer,
  ProTable,
  StepsForm,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
  ProFormList,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

type Entity = {
  id: number;
  code: string;
  vendor: string;
  status: boolean;
  gmtCreate: string;
  modifyBy: string;
};

const Config = () => {
  const [current, setCurrent] = useState<number>(1);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [vendors, setVendors] = useState({});
  const [record, setRecod] = useState<Entity | null>();
  const [contentTypeHidden, setContentTypeHidden] = useState<boolean>(true);

  const actionRef = useRef<ActionType>();
  useEffect(() => {
    vendorList()
      .then((res: API.Result) => {
        setVendors({ ...res.data });
      })
      .catch(() => setVendors({}));
  }, []);

  useEffect(() => {
    console.log(currentId);
    if (currentId) {
      configInfo({ id: currentId }).then((res: API.Result) => {
        setRecod(res.data);
      });
      setOpen(true);
    }
  }, [currentId]);

  const requestData = (params?: API.PageParams) => {
    return configList(params).then((res: API.Result) => {
      setCurrent(res.data.current);
      return {
        data: res.data.records,
        success: true,
        total: res.data.total,
      };
    });
  };

  const closeById = (id: number) => {
    close({ id: id })
      .then((res: API.Result) => {
        if (!res.msg) {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        message.error('关闭服务失败');
      });
  };
  const columns: ProColumns<Entity>[] = [
    {
      title: '服务编号',
      dataIndex: 'code',
    },
    {
      title: '供应商',
      dataIndex: 'vendor',
      renderFormItem: () => {
        return (
          <ProFormSelect
            key="vendor"
            valueEnum={vendors}
            placeholder="请选择供应商"
          ></ProFormSelect>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="在线"
            unCheckedChildren="关闭"
            defaultChecked={record.status}
            disabled={true}
          ></Switch>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      search: false,
    },
    {
      title: '修改人',
      dataIndex: 'modifyBy',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentId(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key={record.id}
          title="你确定关闭该服务?"
          onConfirm={() => closeById(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a key={record.id}> 关闭 </a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={(params) => requestData(params)}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 10, current }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined /> 新增供应商
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            <PlusOutlined /> 新增服务
          </Button>,
        ]}
        options={{ density: false, fullScreen: false, reload: false }}
        search={{
          labelWidth: 'auto',
        }}
      ></ProTable>
      <Modal
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
          setRecod(null);
          setCurrentId(null);
        }}
        width={1000}
        destroyOnClose
      >
        <ProCard>
          <StepsForm<{
            name: string;
          }>
            onFinish={async (values) => {
              console.log(values);
              //   await waitTime(1000);
              //   message.success('提交成功');
            }}
            formProps={{
              validateMessages: {
                required: '此项为必填项',
              },
            }}
            submitter={{
              render: (props) => {
                if (props.step === 0) {
                  return (
                    <Button type="primary" key="step1" onClick={() => props.onSubmit?.()}>
                      下一步
                    </Button>
                  );
                }

                if (props.step === 1) {
                  return [
                    <Button
                      type="primary"
                      key="testIn"
                      onClick={() => {
                        '测试入参脚本';
                      }}
                    >
                      测试入参脚本
                    </Button>,
                    <Button key="pre" onClick={() => props.onPre?.()}>
                      上一步
                    </Button>,
                    <Button type="primary" key="step2" onClick={() => props.onSubmit?.()}>
                      下一步
                    </Button>,
                  ];
                }

                return [
                  <Button
                    type="primary"
                    key="testIn"
                    onClick={() => {
                      '测试入参脚本';
                    }}
                  >
                    测试出参脚本
                  </Button>,
                  <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                    上一步
                  </Button>,
                  <Button type="primary" key="step3" onClick={() => props.onSubmit?.()}>
                    保存
                  </Button>,
                ];
              },
            }}
          >
            <StepsForm.StepForm<{ name: string }>
              name="base"
              title="基本信息"
              onFinish={async ({ name }) => {
                console.log(name);
                ///wait waitTime(2000);
                return true;
              }}
            >
              <ProForm.Group>
                <ProFormText
                  name="code"
                  label="产品编号"
                  width="md"
                  tooltip="用于调用和计费标记"
                  rules={[{ required: true }]}
                  initialValue={record && record?.code}
                />
                <ProFormSelect
                  name="vendor"
                  label="供应商"
                  width="md"
                  valueEnum={vendors}
                  rules={[{ required: true }]}
                  initialValue={record && record?.vendor}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  name="url"
                  label="请求地址"
                  width="xl"
                  tooltip="请求url"
                  placeholder="请输入完整的请求url"
                  rules={[{ required: true }, { max: 32, message: '计费code最长为32' }]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  name="charge"
                  label="是否计费"
                  width="md"
                  valueEnum={{ yes: '是', no: '否' }}
                  placeholder="是否计费"
                />
                <ProFormDigit
                  label="超时时间(ms为单位)"
                  name="overdue"
                  fieldProps={{ precision: 0 }}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  name="method"
                  label="请求方式"
                  width="md"
                  valueEnum={{ GET: 'GET', POST: 'POST' }}
                  placeholder="请选择请求方式"
                  rules={[{ required: true }]}
                  fieldProps={{
                    onSelect: (e) => {
                      if (e === 'POST') {
                        setContentTypeHidden(false);
                      } else {
                        setContentTypeHidden(true);
                      }
                    },
                  }}
                />

                <ProFormSelect
                  hidden={contentTypeHidden}
                  name="contentType"
                  label="请求type"
                  width="md"
                  placeholder="请选择请求方式"
                  valueEnum={{ Form: 'form表单', JSON: 'JSON' }}
                  rules={[{ required: !contentTypeHidden }]}
                />
              </ProForm.Group>
            </StepsForm.StepForm>
            <StepsForm.StepForm name="checkbox" title="请求参数">
              <ProFormList
                name="params"
                creatorButtonProps={{
                  creatorButtonText: '添加参数',
                }}
              >
                <ProForm.Group>
                  <ProFormText
                    width={95}
                    name="name"
                    label="参数名称"
                    placeholder={''}
                    rules={[{ required: true }]}
                  />
                  <ProFormSelect
                    width={90}
                    name="address"
                    label="位置"
                    placeholder={''}
                    valueEnum={{ header: 'Header', body: 'Body', url: 'Url' }}
                    rules={[{ required: true }]}
                  />
                  <ProFormSelect
                    width={70}
                    name="need"
                    initialValue={'否'}
                    label="必填"
                    placeholder={''}
                    valueEnum={{ yes: '是', no: '否' }}
                    rules={[{ required: true }]}
                  />
                  <ProFormSelect
                    width={70}
                    name="change"
                    initialValue={'否'}
                    label="变量"
                    placeholder={''}
                    valueEnum={{ yes: '是', no: '否' }}
                    rules={[{ required: true }]}
                  />
                  <ProFormText width={120} name="value" label="定值" />
                  <ProFormText width={120} name="descript" label="映射参数" placeholder={''} />
                </ProForm.Group>
              </ProFormList>
              <ProForm.Group>
                <ProFormTextArea label="入参解析脚本" width="xl" name="inScript"></ProFormTextArea>
              </ProForm.Group>
            </StepsForm.StepForm>

            <StepsForm.StepForm name="time" title="输出参数">
              <ProForm.Group>
                <ProFormTextArea label="出参解析脚本" width="xl" name="outScript"></ProFormTextArea>
              </ProForm.Group>
              <ProForm.Group>
                <ProFormTextArea
                  label="结果输出脚本"
                  width="xl"
                  name="resultScript"
                ></ProFormTextArea>
              </ProForm.Group>
            </StepsForm.StepForm>
          </StepsForm>
        </ProCard>
      </Modal>
    </PageContainer>
  );
};
export default Config;
