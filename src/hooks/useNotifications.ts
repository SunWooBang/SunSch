import { useEffect, useState, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { useSchedule } from '../contexts/ScheduleContext';

export const useNotifications = () => {
  const { currentSchedule } = useSchedule();
  const [hasPermission, setHasPermission] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const midnightIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scheduleRef = useRef(currentSchedule); // 최신 스케줄을 ref로 저장

  // currentSchedule이 변경될 때마다 ref 업데이트
  useEffect(() => {
    scheduleRef.current = currentSchedule;
  }, [currentSchedule]);

  // 알림 권한 요청
  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setHasPermission(granted);
    if (granted) {
      // 권한을 받으면 즉시 체크 시작
      startChecking();
    }
    return granted;
  };

  // 시간 체크 시작
  const startChecking = () => {
    // 이미 실행 중이면 중복 방지
    if (intervalRef.current) {
      console.log('이미 알림 체크가 실행 중입니다.');
      return;
    }

    console.log('알림 체크 시작');

    // 즉시 한 번 체크
    if (scheduleRef.current && scheduleRef.current.projects.length > 0) {
      notificationService.checkAndNotify(scheduleRef.current.projects);
    }

    // 매 5초마다 체크 (더 정확한 타이밍)
    intervalRef.current = setInterval(() => {
      if (scheduleRef.current && scheduleRef.current.projects.length > 0) {
        notificationService.checkAndNotify(scheduleRef.current.projects);
      }
    }, 5000); // 5초

    // 자정에 알림 기록 초기화 (이미 설정되어 있지 않은 경우에만)
    if (!midnightIntervalRef.current) {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = midnight.getTime() - now.getTime();

      setTimeout(() => {
        notificationService.resetDailyNotifications();
        // 매일 자정마다 초기화
        midnightIntervalRef.current = setInterval(() => {
          notificationService.resetDailyNotifications();
        }, 24 * 60 * 60 * 1000); // 24시간
      }, timeUntilMidnight);
    }
  };

  // 시간 체크 중지
  const stopChecking = () => {
    if (intervalRef.current) {
      console.log('알림 체크 중지');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 컴포넌트 마운트 시 권한 확인 및 체크 시작
  useEffect(() => {
    const initNotifications = () => {
      const permission = notificationService.checkPermission();
      setHasPermission(permission);

      if (permission) {
        startChecking();
      }
    };

    initNotifications();

    // 컴포넌트 언마운트 시 interval 정리
    return () => {
      stopChecking();
      if (midnightIntervalRef.current) {
        clearInterval(midnightIntervalRef.current);
        midnightIntervalRef.current = null;
      }
    };
  }, []); // dependency를 빈 배열로 변경 - 한 번만 실행

  // 예정된 알림 목록 가져오기
  const getUpcomingNotifications = () => {
    if (!scheduleRef.current) return [];
    return notificationService.getUpcomingNotifications(scheduleRef.current.projects);
  };

  return {
    hasPermission,
    requestPermission,
    startChecking,
    stopChecking,
    getUpcomingNotifications,
  };
};
