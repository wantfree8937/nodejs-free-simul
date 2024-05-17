import mongoose from 'mongoose';

const connect = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=express-mongo`;
    const dbName = process.env.DB_NAME;
    
    const connection = await mongoose.connect(mongoURI, {
      dbName,
    });
    
    console.log('MongoDB 연결에 성공하였습니다.');
    return connection;
  } catch (error) {
    console.error(`MongoDB 연결에 실패하였습니다. ${error}`);
    throw error;
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

export default connect;
