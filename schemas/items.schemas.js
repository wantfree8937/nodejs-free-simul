import mongoose from 'mongoose';

// MongoDB 스키마 정의
const ItemSchema = new mongoose.Schema({
  item_code: {
    type: Number,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
    unique: true,
  },
  item_stat: {
    type: Object,
    required: true,
  },
}, { versionKey: false });

// 아이템 스키마를 이용해 모델을 생성하고 내보낸다
export default mongoose.model('Item', ItemSchema);