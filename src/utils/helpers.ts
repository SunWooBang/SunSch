import dayjs from 'dayjs';

// UUID 생성
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 날짜 포맷팅
export const formatDate = (date: Date | string): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatTime = (date: Date | string): string => {
  return dayjs(date).format('HH:mm');
};

export const formatDateTime = (date: Date | string): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

// 오늘 날짜
export const getTodayDate = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

// 시간 차이 계산 (분 단위)
export const getTimeDiffInMinutes = (start: string, end: string): number => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  return endTime.diff(startTime, 'minute');
};

// 날짜가 오늘인지 확인
export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

// 날짜가 과거인지 확인
export const isPast = (date: string): boolean => {
  return dayjs(date).isBefore(dayjs(), 'day');
};
