import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { TaskStatus } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  onExpand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onExpand }) => {
  const { currentSchedule, addProject } = useSchedule();
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;

    addProject(newProjectName);
    setNewProjectName('');
    setIsAdding(false);
  };

  return (
    <div 
      className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* 사이드바 헤더 */}
      {/*<div className={`p-6 border-b border-gray-200 ${isCollapsed ? 'p-3' : ''}`}>
        {!isCollapsed ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">프로젝트</h2>
            <p className="text-sm text-gray-500">오늘의 작업 목록</p>
          </>
        ) : (
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        )}
      </div>*/}

      {/* 프로젝트 추가 버튼 */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-3' : 'p-6'}`}>
        {!isCollapsed ? (
          <>
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 px-4 py-3 bg-white text-gray-700 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center justify-center gap-2 group cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="group-hover:text-blue-600 transition-colors">새 프로젝트</span>
            </button>

            {/* 프로젝트 추가 폼 */}
            {isAdding && (
              <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
                  placeholder="프로젝트 이름을 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddProject}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewProjectName('');
                    }}
                    className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 프로젝트 통계 */}
            {currentSchedule && (
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">프로젝트</span>
                  <span className="font-bold text-gray-900">{currentSchedule.projects.length}개</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">작업</span>
                  <span className="font-bold text-gray-900">
                    {currentSchedule.projects.reduce((sum, p) => sum + p.tasks.length, 0)}개
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">진행률</span>
                  <span className="font-bold text-blue-600">
                    {(() => {
                      const totalTasks = currentSchedule.projects.reduce((sum, p) => sum + p.tasks.length, 0);
                      const completedTasks = currentSchedule.projects.reduce(
                        (sum, p) => sum + p.tasks.filter(t => t.status === TaskStatus.COMPLETED).length, 0
                      );
                      return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                    })()}%
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 접힌 상태의 프로젝트 추가 버튼 */}
            <button
              onClick={() => {
                onExpand();
                setIsAdding(true);
              }}
              className="w-full mb-3 p-3 bg-white text-gray-700 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center cursor-pointer"
              title="새 프로젝트"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* 접힌 상태의 통계 */}
            {currentSchedule && (
              <div className="mt-auto pt-3 border-t border-gray-200 flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">프로젝트</span>
                  <span className="text-sm font-bold text-gray-900">{currentSchedule.projects.length}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">작업</span>
                  <span className="text-sm font-bold text-gray-900">
                    {currentSchedule.projects.reduce((sum, p) => sum + p.tasks.length, 0)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">진행률</span>
                  <span className="text-sm font-bold text-blue-600">
                    {(() => {
                      const totalTasks = currentSchedule.projects.reduce((sum, p) => sum + p.tasks.length, 0);
                      const completedTasks = currentSchedule.projects.reduce(
                        (sum, p) => sum + p.tasks.filter(t => t.status === TaskStatus.COMPLETED).length, 0
                      );
                      return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                    })()}%
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
