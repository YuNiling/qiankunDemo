const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// const fs = require('fs-extra');
const fs = require('fs');

const app = express();
const port = 3000;

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
const chunkDir = path.join(uploadDir, 'chunks');

// 中间件
app.use(cors());
app.use(express.json());

// 配置 multer 存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    cb(null, chunkDir);
  },
  filename: (req, file, cb) => {
    console.log('req', JSON.stringify(req.query));
    const { hash, index } = req.query;
    cb(null, `${hash}-${index}`);
  }
});

// 实例化上传对象，限制最多上传 10 个文件
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  }
});

// 上传文件切片
app.post('/api/upload/chunk', upload.single('chunk'), (req, res) => {
  console.log('req', JSON.stringify(req.body));
  const { index } = req.body;
  if (Number(index) === 11) {
    res.json({
      code: 500,
      message: '上传失败',
    });
  } else {
  }
  res.json({
    code: 200,
    message: '上传成功',
  });
});

// 合并文件切片
app.post('/api/upload/merge', (req, res) => {
  const { hash, filename } = req.body;
  const filePath = path.join(uploadDir, `${hash}_${filename}`);

  try {
    // 读取所有切片
    const chunks = fs.readdirSync(chunkDir)
      .filter(chunk => chunk.startsWith(hash))
      .sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    console.log('chunks', chunks);

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
      res.json({
        code: 200,
        message: '合并成功',
        url: `http://localhost:3000/uploads/${hash}_${filename}`,
      });
    });

    writeStream.on('error', (err) => {
      res.json({
        code: 500,
        message: '合并失败',
      });
    });
  } catch (err) {
    res.json({
      code: 500,
      message: '合并失败',
    });
  }
});

app.listen(3000, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});