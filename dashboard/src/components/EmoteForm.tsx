import React from "react";
import { AxiosResponse } from "axios";
import { Switch, Input, Upload, Button, notification, Form } from "antd";
import { RuleObject } from "antd/es/form";

import { PlusOutlined } from "@ant-design/icons";

import Api, { EMOTE_CHECK_KEYWORD, CREATE_EMOTE, getResponseError } from "../api/index";
import { SuccessResponse } from "../api/responses";
import { getImageFilePreview } from "../util/helpers";

const layout = {
    labelCol   : { span: 6 },
    wrapperCol : { span: 14 },
};

const EmoteForm: React.FC<EmoteFormProps> = ({ reloadEmotes }) => {
    const [form] = Form.useForm();
    const [preview, setPreview] = React.useState<string | undefined>();
    const [loading, setLoading] = React.useState<boolean>(false);

    const onFileChange = (e: any) => {
        if (e.file) {
            getImageFilePreview(e.file)
                .then((result) => setPreview(result));
        }
    };

    const submit = async (vals: { emote: any, keyword: string, private: boolean }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("emote", vals.emote.originFileObj);
            formData.append("keyword", vals.keyword);
            formData.append("is_private", vals.private.toString());
            const { data: { message } }: AxiosResponse<SuccessResponse> = await Api({ ...CREATE_EMOTE(), data: formData })
            notification.success({ message });
            setLoading(false);
            form.resetFields();
            setPreview(undefined);
            reloadEmotes();
        } catch (e) {
            setLoading(false);
            notification.error({ message: getResponseError(e) });
        }
    };

    const validateKeyword = async (_: RuleObject, value: string) => {
        if (!value) return;
        const { data }: AxiosResponse<boolean> = await Api({ ...EMOTE_CHECK_KEYWORD(), params: { keyword: value } })
        if (!data) {
            throw new Error("Keyword has already been used");
        }
        return true;
    };

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
        <Form { ...layout } initialValues={{ private: false }} onFinish={ submit } form={ form }>
            <Form.Item
                name="keyword"
                label="Keyword"
                rules={[
                    { required: true, pattern: /^\w{3,}$/, message: "Please enter a keyword (min 3 alphanumeric characters)" },
                    { validator: validateKeyword, validateTrigger: "onSubmit" },
                ]}
            >
                <Input placeholder="Keyword" />
            </Form.Item>
            <Form.Item name="private" label="Private" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item
                name="emote"
                label="Emote"
                valuePropName="file"
                rules={[{ required: true, message: "Please select a file" }]}
                getValueFromEvent={ e => e.file }
            >
                <Upload
                    accept="image/*"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={ false }
                    customRequest={ onFileChange }
                >
                    { preview ? <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={ preview } alt="emote" /> : uploadButton }
                </Upload>
            </Form.Item>
            <Form.Item style={{ marginTop: 20 }} label="Note">
                Only gif files are supported for animated emotes for now.
            </Form.Item>
            <Form.Item style={{ marginTop: 20 }} label="Action">
                <div>
                    <Button loading={ loading } type="primary" htmlType="submit" icon={ <PlusOutlined /> }>
                        { loading ? "Saving" : "Save" }
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

interface EmoteFormProps {
    reloadEmotes: () => void
}

export default EmoteForm;
