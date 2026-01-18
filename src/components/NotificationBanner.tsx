import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationBanner: React.FC = () => {
  const { hasPermission, requestPermission } = useNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Electron 환경인지 확인
  const isElectron = () => {
    return !!(window.navigator.userAgent.includes('Electron') || (window as any).electron);
  };

  useEffect(() => {
    // Electron 환경에서는 배너를 표시하지 않음 (권한이 자동으로 허용되므로)
    if (isElectron()) {
      setShowBanner(false);
      return;
    }

    // 알림 권한이 없고, 사용자가 배너를 닫지 않았으면 표시
    const isDismissed = localStorage.getItem('notificationBannerDismissed') === 'true';
    setDismissed(isDismissed);

    if (!hasPermission && !isDismissed) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [hasPermission]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <div>
          <p className="font-semibold">작업 시작/종료 알림을 받으시겠습니까?</p>
          <p className="text-sm text-blue-100">프로젝트와 작업의 시작 및 종료 시간에 알림을 받을 수 있습니다.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleRequestPermission}
          className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm cursor-pointer"
        >
          알림 허용
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          나중에
        </button>
      </div>
    </div>
  );
};
