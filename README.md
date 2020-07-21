# web-meeting-quickstart

### 配置

修改 config.js

```js
const Config = {
  appkey: '', // appkey
  server: '' // app server 地址
};
```
### web 页面启动

使用 `localhost` 或 `https` 打开 html 页面

### server 启动

server 用户获取用户 token

#### 安装依赖
```
npm install
```

#### 启动
```
npm run serve
```

#### 启动成功

得到 server 地址填写到 config.js 中。