import express from 'express';
import Character from '../schemas/characters.schemas.js';

const router = express.Router();

// 캐릭터 생성 API
router.post('/characters', async (req, res, next) => {
  try {
    // 클라이언트로부터 전달받은 캐릭터명을 확인
    const { name } = req.body;

    // 이미 존재하는 캐릭터명인지 확인해.
    const existingCharacter = await Character.findOne({ name });
    if (existingCharacter) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 캐릭터명입니다.' });
    }

    // MongoDB에서 가장 높은 character_id 값을 찾는다
    const maxCharacterId = await Character.findOne()
      .sort('-character_id')
      .exec();

    // character_id 값을 설정 최초 생성 시 1로 설정하고, 이후에는 이전 값에서 1을 증가
    const character_id = maxCharacterId ? maxCharacterId.character_id + 1 : 1;

    // MongoDB에 저장할 캐릭터 데이터를 생성
    const newCharacter = new Character({
      character_id,
      name,
    });

    // 생성한 캐릭터 데이터를 MongoDB에 저장
    await newCharacter.save();

    // 생성한 캐릭터의 ID를 클라이언트에게 응답
    return res.status(201).json({ newCharacter });
  } catch (error) {
    // 에러 발생 시 다음 에러 처리 미들웨어로 전달
    next(error);
  }
});

// 캐릭터 목록 전체 가져오기
router.get('/characters', async (req, res) => {
  const characters = await Character.find().sort('-order').exec();

  // 찾은 '해야할 일'을 클라이언트에게 전달
  return res.status(200).json({ characters });
});

router.get('/characters/:characterId', async (req, res, next) => {
  try {
    // URI의 parameter에서 캐릭터 ID를 가져온다
    const { characterId } = req.params;

    // 캐릭터 ID를 이용해 MongoDB에서 해당 캐릭터를 조회
    const character = await Character.findOne({ character_id: characterId }).exec();

    // 캐릭터가 존재하지 않을 경우 에러를 발생
    if (!character) {
      return res.status(404).json({ message: '캐릭터를 찾을 수 없습니다.' });
    }

    // 캐릭터 정보와 아이템 목록을 응답
    return res.status(200).json({
      name: character.name,
      health: character.health,
      power: character.power,
      // 아이템 목록을 추가할 경우 여기에 추가
    });
  } catch (error) {
    // 에러가 발생하면 다음 미들웨어로 전달
    next(error);
  }
});

router.delete('/characters/:characterId', async (req, res, next) => {
  try {
    // URI의 parameter에서 캐릭터 ID를 가져온다
    const { characterId } = req.params;

    // 캐릭터 ID를 이용해 MongoDB에서 해당 캐릭터를 삭제
    const deletedCharacter = await Character.findOneAndDelete({ character_id: characterId }).exec();

    // 삭제된 캐릭터가 존재하지 않을 경우 에러를 발생
    if (!deletedCharacter) {
      return res.status(404).json({ message: '삭제할 캐릭터를 찾을 수 없습니다.' });
    }

    // 캐릭터 삭제 성공 메시지를 응답
    return res.status(200).json({ message: '캐릭터가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    // 에러가 발생하면 다음 미들웨어로 전달
    next(error);
  }
});

export default router;
