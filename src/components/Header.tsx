import React, { useState, useRef, useEffect } from 'react';
import dayjs from '../utils/dayjs';
import { useSchedule } from '../contexts/ScheduleContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const { currentDate, setCurrentDate } = useSchedule();
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(dayjs(currentDate));
  const calendarRef = useRef<HTMLDivElement>(null);

  // 달력 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // 달력 열 때 현재 날짜의 월로 설정
  const handleOpenCalendar = () => {
    setCalendarMonth(dayjs(currentDate));
    setShowCalendar(true);
  };

  // 날짜 선택
  const handleSelectDate = (date: string) => {
    setCurrentDate(date);
    setShowCalendar(false);
  };

  // 달력 날짜 생성
  const generateCalendarDays = () => {
    const startOfMonth = calendarMonth.startOf('month');
    const endOfMonth = calendarMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const days: (string | null)[] = [];

    // 이전 달 빈 칸
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(calendarMonth.date(i).format('YYYY-MM-DD'));
    }

    return days;
  };

  const handlePrevDay = () => {
    const prevDay = dayjs(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD');
    setCurrentDate(nextDay);
  };

  const handleToday = () => {
    setCurrentDate(dayjs().format('YYYY-MM-DD'));
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 햄버거 버튼 & 로고 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 cursor-pointer"
            title={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SunSch</h1>
              <p className="text-xs text-gray-500">Daily Schedule Manager</p>
            </div>
          </div>
        </div>

        {/* 날짜 네비게이션 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1.5">
            <button
              onClick={handlePrevDay}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="relative" ref={calendarRef}>
              <button
                onClick={handleOpenCalendar}
                className="px-4 py-1.5 min-w-[160px] text-center hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {dayjs(currentDate).format('YYYY년 MM월 DD일')}
                </div>
                <div className="text-xs text-gray-500">
                  {dayjs(currentDate).format('dddd')}
                </div>
              </button>

              {/* 달력 팝업 */}
              {showCalendar && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 w-72">
                  {/* 달력 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCalendarMonth(calendarMonth.subtract(1, 'month'))}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="font-semibold text-gray-900">
                      {calendarMonth.format('YYYY년 MM월')}
                    </span>
                    <button
                      onClick={() => setCalendarMonth(calendarMonth.add(1, 'month'))}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* 요일 헤더 */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                      <div
                        key={day}
                        className={`text-center text-xs font-medium py-1 ${
                          index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 날짜 그리드 */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="w-8 h-8" />;
                      }

                      const isSelected = date === currentDate;
                      const isToday = date === dayjs().format('YYYY-MM-DD');
                      const dayOfWeek = dayjs(date).day();

                      return (
                        <button
                          key={date}
                          onClick={() => handleSelectDate(date)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer
                            ${isSelected
                              ? 'bg-blue-500 text-white font-semibold'
                              : isToday
                                ? 'bg-blue-100 text-blue-600 font-semibold'
                                : dayOfWeek === 0
                                  ? 'text-red-500 hover:bg-gray-100'
                                  : dayOfWeek === 6
                                    ? 'text-blue-500 hover:bg-gray-100'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {dayjs(date).date()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextDay}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>


            <button
              onClick={handleToday}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm cursor-pointer"
            >
              오늘
            </button>
        </div>
      </div>
    </header>
  );
};
