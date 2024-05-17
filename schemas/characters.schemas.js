import mongoose from 'mongoose';

// MongoDB 스키마 정의
const CharacterSchema = new mongoose.Schema({
  character_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  health: {
    type: Number,
    default: 500, // 기본값 500
  },
  power: {
    type: Number,
    default: 100, // 기본값 100
  },
}, { versionKey: false });

// 캐릭터 스키마를 이용해 모델을 생성하고 내보낸다
export default mongoose.model('Character', CharacterSchema);
