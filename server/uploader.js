const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
// const fs = require('fs');

const app = express();
const port = 3000;

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir)); // 允许访问上传的文件

// 配置 multer 存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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

// const formData = new FormData();
// formData.append('file', file); // 单文件
// axios.post('http://localhost:3000/upload/single', formData);
// 单个文件上传
// 单个文件上传
app.post('/api/upload/singleFile', upload.single('file'), (req, res) => {
  console.log('文件信息:', req.file);
  setTimeout(() => {
    // throw new Error('上传失败');
    res.json({
      code: 200,
      message: '上传成功',
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      }
    });
  }, 2000);
});
app.post('/api/upload/singleChunk', upload.single('file'), async(req, res) => {
  console.log('文件信息:', req.file);
  const filePath = req.file.path;
  const chunkSize = 10 * 1024; // 10 KB一片
  const fileName = req.file.originalname;
  const baseName = path.basename(filePath);
  const extName = path.extname(fileName);
  const chunkDir = path.join(uploadDir,  `${baseName}_chunks`);

  await fs.ensureDir(chunkDir);

  const fileBuffer = await fs.readFile(filePath);
  const totalSize = fileBuffer.length;
  const totalChunks = Math.ceil(totalSize / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = fileBuffer.slice(start, end);
    const chunkFilePath = path.join(chunkDir, `chunk_${i}${extName}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    await fs.writeFile(chunkFilePath, chunk);
  }

  // 删除原始文件
  await fs.remove(filePath);

  res.json({
    code: 200,
    message: '上传成功',
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    },
    chunk: totalChunks
  });
});

// 测试上传
// const formData = new FormData();
// fileList.forEach(file => {
//   formData.append('files', file); // "files" 是字段名
// });
// axios.post('http://localhost:3000/api/upload', formData).then(res => {
//   console.log(res.data);
// });
// 多文件上传
app.post('/api/upload/multiple', upload.array('files', 10), (req, res) => {
  const fileInfo = req.files.map(file => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`
  }));
  setTimeout(() => {
    res.json({
      code: 200,
      message: '批量上传成功',
      data: fileInfo
    });
  }, 5000);
});

app.listen(3000, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});