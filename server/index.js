const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件
app.use(cors({
  origin: 'http://localhost:8002',
  credentials: true
}));
app.use(express.json());

// 模拟数据
let users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
];

// 获取所有用户
app.get('/api/users', (req, res) => {
  const token = req.headers.authorization;
  if (token !== '123456') {
    return res.json({
      code: 401,
      message: '未授权'
    });
  }
  res.json({
    code: 200,
    data: users,
    message: '获取成功'
  });
});

// 根据 ID 获取用户
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(v => v.id === id);
  setTimeout(() => {
    if (user) {
      res.json({
        code: 200,
        data: user,
        message: '获取成功'
      });
    } else {
      res.json({
        code: 300,
        data: null,
        message: '用户不存在'
      });
    }
  }, 3000);
});

// 添加用户
app.post('/api/users', (req, res) => {
  console.log('req.body', req.body);
  const { name, age } = req.body;
  if (!name || !age) {
    return res.json({
      code: 300,
      message: '参数错误'
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    age
  };

  users.push(newUser);
  res.json({
    code: 200,
    data: newUser,
    message: '添加用户成功'
  });
});

app.listen(3000, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});