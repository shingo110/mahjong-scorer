import { Player, Settlement } from '../types';

/* ─── 随机中文昵称库（2~4字） ─── */

const NICKNAME_POOL = [
  '东风', '南风', '西风', '北风',
  '一筒', '二条', '三万', '四筒',
  '五万', '六条', '七筒', '八条',
  '自摸', '红中', '发财', '白板',
  '胡牌', '天胡', '雀神', '麻神',
  '小明', '小红', '小张', '小刘',
  '大壮', '阿强', '阿花', '阿杰',
  '老王', '老李', '老张', '老刘',
  '帅气', '美丽', '可爱', '聪明',
  '无敌', '幸运', '好运', '高手',
  '杠上花', '清一色', '对对胡', '十三幺',
];

// 生成随机中文昵称（从库里随机取一个）
export function generateRandomNickname(): string {
  return NICKNAME_POOL[Math.floor(Math.random() * NICKNAME_POOL.length)];
}

// 多人净盈亏平账算法
export function calculateSettlement(players: Player[]): Settlement[] {
  const settlements: Settlement[] = [];

  const netAmounts = players.map(p => ({
    id: p.id,
    name: p.name,
    net: p.score,
  }));

  const creditors = netAmounts.filter(p => p.net > 0).sort((a, b) => b.net - a.net);
  const debtors = netAmounts.filter(p => p.net < 0).sort((a, b) => a.net - b.net);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.net, -debtor.net);

    if (amount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount,
      });
    }

    creditor.net -= amount;
    debtor.net += amount;

    // 整数场景直接判等；若未来引入小数，用容差比较
    if (Math.abs(creditor.net) < 1e-9) i++;
    if (Math.abs(debtor.net) < 1e-9) j++;
  }

  return settlements;
}

// 获取大赢家和大输家（支持并列，返回数组）
export function getWinnersAndLosers(players: Player[]): {
  winners: Player[];
  losers: Player[];
} {
  if (players.length === 0) {
    return { winners: [], losers: [] };
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top = sorted[0].score;
  const bottom = sorted[sorted.length - 1].score;

  const winners = sorted.filter(p => p.score === top);
  const losers = sorted.filter(p => p.score === bottom);

  return { winners, losers };
}
