import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../types';
import { TaskItem } from './TaskItem';
import { useSchedule } from '../contexts/ScheduleContext';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { addTask, deleteProject, updateProject } = useSchedule();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [startTime, setStartTime] = useState(project.startTime || '');
  const [endTime, setEndTime] = useState(project.endTime || '');

  const handleSaveTime = () => {
    updateProject(project.id, { startTime, endTime });
    setIsEditingTime(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const maxOrder = project.tasks.length > 0 
      ? Math.max(...project.tasks.map(t => t.order))
      : 0;

    addTask(project.id, {
      title: newTaskTitle,
      status: TaskStatus.PENDING,
      level: 1,
      order: maxOrder + 1
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleDeleteProject = () => {
    if (confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`)) {
      deleteProject(project.id);
    }
  };

  const completedCount = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const inProgressCount = project.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const totalCount = project.tasks.length;
  const completedProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const inProgressProgress = totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 mb-4">
      {/* 프로젝트 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{totalCount}개 작업</span>
            {totalCount > 0 && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">{completedCount}개 완료</span>
              </>
            )}
            <span>•</span>
            {isEditingTime ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span>~</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveTime}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 cursor-pointer"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditingTime(false);
                    setStartTime(project.startTime || '');
                    setEndTime(project.endTime || '');
                  }}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 cursor-pointer"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTime(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {project.startTime && project.endTime ? (
                  <span>{project.startTime} ~ {project.endTime}</span>
                ) : (
                  <span>시간 설정</span>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            작업 추가
          </button>
          <button
            onClick={handleDeleteProject}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 진행률 바 */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${completedProgress}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${inProgressProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 작업 목록 */}
      <div className="space-y-2">
        {project.tasks
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskItem key={task.id} task={task} projectId={project.id} />
          ))}
      </div>

      {/* 새 작업 추가 폼 */}
      {isAddingTask && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="작업 내용을 입력하세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex-1"
            >
              추가
            </button>
            <button
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
              }}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex-1"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {project.tasks.length === 0 && !isAddingTask && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">작업이 없습니다</p>
        </div>
      )}
    </div>
  );
};
