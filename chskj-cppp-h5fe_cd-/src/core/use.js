/*
 * @Date: 2022-07-11 14:27:16
 * @LastEditTime: 2023-06-16 11:38:45
 */
import {
  Button,
  Input,
  Result,
  Avatar,
  Radio,
  Checkbox,
  Modal,
  Row,
  Col,
  Tabs,
  Statistic,
  Drawer,
  Tag,
  Space,
  Dropdown,
  Menu,
  MenuItem,
  MenuDivider,
  Select,
  Collapse,
  Skeleton,
  Breadcrumb,
  Upload,
  Progress,
  Empty,
  Form,
  Rate,
  Table,
  ConfigProvider,
  Pagination,
  Image,
  Spin
} from 'ant-design-vue';
import { message } from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';

export function lazyUse(app) {
  app.use(ConfigProvider);
  app.use(Button);
  app.use(Input);
  app.use(Result);
  app.use(Avatar);
  app.use(Radio);
  app.use(Checkbox);
  app.use(Modal);
  app.use(Row);
  app.use(Col);
  app.use(Tabs);
  app.use(Statistic);
  app.use(Drawer);
  app.use(Tag);
  app.use(Space);
  app.use(Dropdown);
  app.use(Menu);
  app.use(MenuItem);
  app.use(MenuDivider);
  app.use(Select);
  app.use(Collapse);
  app.use(Skeleton);
  app.use(Breadcrumb);
  app.use(Upload);
  app.use(Progress);
  app.use(Empty);
  app.use(Form);
  app.use(Rate);
  app.use(Table);
  app.use(Pagination);
  app.use(Rate);
  app.use(Image);
  app.use(Spin);
  
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$modal = Modal;
}
