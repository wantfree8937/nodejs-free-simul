import express from 'express';
import Item from '../schemas/items.schemas.js';

const router = express.Router();

// 아이템 생성 API
router.post('/items', async (req, res, next) => {
  try {
    // 클라이언트로부터 전달받은 아이템 정보를 확인
    const { item_name, item_stat } = req.body;

    // 이미 존재하는 아이템명인지 확인
    const existingItem = await Item.findOne({ item_name });
    if (existingItem) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 아이템명입니다.' });
    }

    // MongoDB에서 가장 높은 item_code 값을 찾아온다
    const maxItemCode = await Item.findOne().sort('-item_code').exec();

    const item_code = maxItemCode ? maxItemCode.item_code + 1 : 1;

    // MongoDB에 저장할 아이템 데이터를 생성
    const newItem = new Item({
      item_code,
      item_name,
      item_stat,
    });

    // 생성한 아이템 데이터를 MongoDB에 저장
    await newItem.save();

    // 생성한 아이템의 ID를 클라이언트에게 응답
    return res.status(201).json({ newItem });
  } catch (error) {
    // 에러 발생 시 다음 에러 처리 미들웨어로 전달
    next(error);
  }
});

// 아이템 목록 전체 가져오기
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find({}, 'item_code item_name -_id');

    // 클라이언트에게 아이템 목록을 응답
    return res.status(200).json({ items });
  } catch (error) {
    // 에러가 발생한 경우 에러를 클라이언트에게 전달
    return res.status(500).json({ error: '서버 오류' });
  }
});

// 아이템 수정 API
router.patch('/items/:itemCode', async (req, res, next) => {
  try {
    // 클라이언트로부터 전달받은 아이템 코드와 수정할 정보를 확인
    const { itemCode } = req.params;
    const { item_name, item_stat } = req.body;

    // 해당 아이템 코드로 아이템을 조회
    let item = await Item.findOne({ item_code: itemCode });
    if (!item) {
      return res
        .status(404)
        .json({ message: '해당 아이템을 찾을 수 없습니다.' });
    }

    // 아이템 정보를 업데이트
    if (item_name) {
      item.item_name = item_name;
    }
    if (item_stat) {
      item.item_stat = item_stat;
    }

    // 수정된 아이템을 저장
    await item.save();

    return res.status(200).json({ item });
  } catch (error) {
    // 에러 발생 시 다음 에러 처리 미들웨어로 전달
    next(error);
  }
});

// 아이템 상세 조회 API
router.get('/items/:itemCode', async (req, res) => {
  try {
    // URI의 parameter에서 아이템 코드를 가져온다
    const { itemCode } = req.params;

    // 아이템 코드를 이용해 MongoDB에서 해당 아이템을 조회
    const item = await Item.findOne(
      { item_code: itemCode },
      'item_code item_name item_stat -_id'
    );

    // 아이템이 존재하지 않을 경우 에러를 반환
    if (!item) {
      return res.status(404).json({ message: '아이템을 찾을 수 없습니다.' });
    }

    // 아이템 정보를 클라이언트에게 응답
    return res.status(200).json(item);
  } catch (error) {
    // 에러가 발생한 경우 에러를 클라이언트에게 전달
    return res.status(500).json({ error: '서버 오류' });
  }
});

export default router;
