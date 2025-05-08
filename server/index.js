const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    const chunkDir = path.join(uploadDir, 'chunks');
    
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    
    cb(null, chunkDir);
  },
  filename: function (req, file, cb) {
    const { hash, chunkIndex } = req.body;
    cb(null, `${hash}-${chunkIndex}`);
  }
});

const upload = multer({ storage: storage });

// 中间件
app.use(cors());
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

// 获取已上传的切片
app.get('/api/upload/chunks', (req, res) => {
  const { hash } = req.query;
  const chunkDir = path.join(__dirname, 'uploads', 'chunks');
  
  try {
    const chunks = fs.readdirSync(chunkDir)
      .filter(name => name.startsWith(hash))
      .map(name => parseInt(name.split('-')[1]));
    
    res.json({ chunks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chunks' });
  }
});

// 检查文件是否已存在
app.get('/api/upload/check', (req, res) => {
  const { hash } = req.query;
  const filePath = path.join(__dirname, 'uploads', hash);
  
  if (fs.existsSync(filePath)) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// 上传文件切片
app.post('/api/upload/chunk', upload.single('chunk'), (req, res) => {
  res.json({ success: true });
});

// 合并文件切片
app.post('/api/upload/merge', async (req, res) => {
  const { hash, filename } = req.body;
  const chunkDir = path.join(__dirname, 'uploads', 'chunks');
  const filePath = path.join(__dirname, 'uploads', filename);
  
  try {
    // 读取所有切片
    const chunks = fs.readdirSync(chunkDir)
      .filter(name => name.startsWith(hash))
      .sort((a, b) => {
        const indexA = parseInt(a.split('-')[1]);
        const indexB = parseInt(b.split('-')[1]);
        return indexA - indexB;
      });
    
    // 创建写入流
    const writeStream = fs.createWriteStream(filePath);
    
    // 依次写入切片
    for (const chunk of chunks) {
      const chunkPath = path.join(chunkDir, chunk);
      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);
      // 删除切片文件
      fs.unlinkSync(chunkPath);
    }
    
    writeStream.end();
    
    writeStream.on('finish', () => {
      res.json({ success: true });
    });
    
    writeStream.on('error', (error) => {
      console.error('Merge failed:', error);
      res.status(500).json({ success: false, error: 'Merge failed' });
    });
  } catch (error) {
    console.error('Merge failed:', error);
    res.status(500).json({ success: false, error: 'Merge failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});