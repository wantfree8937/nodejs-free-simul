import express from 'express';
import dotenv from 'dotenv';
import connect from './schemas/index.js';
import ItemRouter from './routes/items.router.js';
import ChaRouter from './routes/characters.router.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';

dotenv.config(); // dotenv를 초기화합니다.

const app = express();
const PORT = process.env.PORT || 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
app.use(express.static('./assets'));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// /api 주소로 접근하였을 때, router, ChaRouter, ItemsRouter로 클라이언트의 요청이 전달됩니다.
app.use('/api', [router, ChaRouter, ItemRouter]);

// 에러 핸들링 미들웨어를 등록합니다.
app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
