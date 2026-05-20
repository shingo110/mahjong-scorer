import { v4 as uuidv4 } from 'uuid';
import { Player, Settlement } from '../types';

// 生成6位随机房间号
export function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成设备唯一标识
export function getDeviceId(): string {
  let deviceId = localStorage.getItem('mahjong-device-id');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('mahjong-device-id', deviceId);
  }
  return deviceId;
}

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

// 本地存储管理
export const storage = {
  saveRoom(roomId: string, playerId: string) {
    localStorage.setItem('mahjong-current-room', JSON.stringify({ roomId, playerId }));
  },

  getCurrentRoom() {
    const data = localStorage.getItem('mahjong-current-room');
    if (!data) return null;
    try {
      return JSON.parse(data) as { roomId: string; playerId: string };
    } catch {
      return null;
    }
  },

  clearRoom() {
    localStorage.removeItem('mahjong-current-room');
  },

  saveRoomData(roomId: string, data: Record<string, unknown>) {
    localStorage.setItem(`mahjong-room-${roomId}`, JSON.stringify(data));
  },

  getRoomData(roomId: string) {
    const data = localStorage.getItem(`mahjong-room-${roomId}`);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
};

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

    if (creditor.net === 0) i++;
    if (debtor.net === 0) j++;
  }

  return settlements;
}

// 获取大赢家和大输家
export function getWinnersAndLosers(players: Player[]): { winner: Player | null; loser: Player | null } {
  if (players.length === 0) {
    return { winner: null, loser: null };
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);
  return {
    winner: sorted[0],
    loser: sorted[sorted.length - 1],
  };
}
