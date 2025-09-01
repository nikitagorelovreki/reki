import React from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Checkbox, Space, Card, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

interface FormField {
  name: string;
  type: 'text' | 'date' | 'select' | 'rating' | 'number' | 'textarea' | 'checkbox' | 'checkbox-group';
  label: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  readOnly?: boolean;
}

interface FormSection {
  title: string;
  fields: FormField[];
}

interface FormSchema {
  sections: FormSection[];
}

interface FormBuilderProps {
  schema: FormSchema;
  initialValues?: Record<string, any>;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  form?: FormInstance;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  initialValues = {},
  onValuesChange,
  form
}) => {
  // Преобразуем строки дат в объекты dayjs
  const processedInitialValues = React.useMemo(() => {
    const processed: Record<string, any> = {};
    
    Object.keys(initialValues).forEach(key => {
      const value = initialValues[key];
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        // Это похоже на дату, преобразуем в dayjs
        processed[key] = dayjs(value);
      } else {
        processed[key] = value;
      }
    });
    
    return processed;
  }, [initialValues]);
  const renderField = (field: FormField) => {
    const { name, type, label, required, options, min, max, readOnly } = field;

    switch (type) {
      case 'text':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <Input placeholder={`Введите ${label.toLowerCase()}`} disabled={readOnly} />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <DatePicker style={{ width: '100%' }} placeholder={`Выберите ${label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <Select placeholder={`Выберите ${label.toLowerCase()}`}>
              {options?.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'rating':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <Select placeholder={`Выберите оценку (${min}-${max})`}>
              {Array.from({ length: max! - min! + 1 }, (_, i) => min! + i).map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={min}
              max={max}
              placeholder={`Введите ${label.toLowerCase()}`}
              disabled={readOnly}
            />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <TextArea rows={4} placeholder={`Введите ${label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'checkbox':
        return (
          <Form.Item key={name} name={name} valuePropName="checked">
            <Checkbox>{label}</Checkbox>
          </Form.Item>
        );

      case 'checkbox-group':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Поле "${label}" обязательно для заполнения` }] : []}
          >
            <Checkbox.Group>
              <Space direction="vertical" style={{ width: '100%' }}>
                {options?.map((option) => (
                  <Checkbox key={option} value={option}>
                    {option}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        );

      default:
        return (
          <Form.Item key={name} name={name} label={label}>
            <Input placeholder={`Неподдерживаемый тип поля: ${type}`} disabled />
          </Form.Item>
        );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={processedInitialValues}
      onValuesChange={onValuesChange}
      style={{ maxWidth: '100%' }}
    >
      {schema.sections.map((section, sectionIndex) => (
        <Card
          key={sectionIndex}
          title={<Title level={4}>{section.title}</Title>}
          style={{ marginBottom: 16 }}
          size="small"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {section.fields.map((field) => (
              <div key={field.name}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Form>
  );
};

export default FormBuilder;
