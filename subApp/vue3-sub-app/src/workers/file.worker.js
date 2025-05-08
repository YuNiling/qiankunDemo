import SparkMD5 from 'spark-md5'

// 计算文件 hash
self.onmessage = async (e) => {
  const { type, file } = e.data
  
  switch (type) {
    case 'hash':
      const hash = await calculateHash(file)
      self.postMessage({ type: 'hash', hash })
      break
      
    case 'chunks':
      const chunks = createFileChunks(file)
      self.postMessage({ type: 'chunks', chunks })
      break
  }
}

// 计算文件 hash
const calculateHash = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
      const buffer = e.target.result
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(buffer)
      const hash = spark.end()
      resolve(hash)
    }
  })
}

// 创建文件切片
const createFileChunks = (file) => {
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
  const chunks = []
  let cur = 0
  
  while (cur < file.size) {
    chunks.push({
      index: chunks.length,
      file: file.slice(cur, cur + CHUNK_SIZE)
    })
    cur += CHUNK_SIZE
  }
  
  return chunks
} 