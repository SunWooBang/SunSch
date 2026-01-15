import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { useSchedule } from '../contexts/ScheduleContext';

interface TaskItemProps {
  task: Task;
  projectId: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, projectId }) => {
  const { updateTask, deleteTask } = useSchedule();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [startTime, setStartTime] = useState(task.startTime || '');
  const [endTime, setEndTime] = useState(task.endTime || '');

  const handleSaveTime = () => {
    updateTask(projectId, task.id, { startTime, endTime });
    setIsEditingTime(false);
  };

  const handleCancelTime = () => {
    setIsEditingTime(false);
    setStartTime(task.startTime || '');
    setEndTime(task.endTime || '');
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(projectId, task.id, { status: newStatus });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(projectId, task.id, { title: editTitle });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('이 작업을 삭제하시겠습니까?')) {
      deleteTask(projectId, task.id);
    }
  };

  const getStatusConfig = () => {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return {
          color: 'bg-green-50 border-green-200 text-green-700',
          badge: 'bg-green-100 text-green-700',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: '완료'
        };
      case TaskStatus.IN_PROGRESS:
        return {
          color: 'bg-blue-50 border-blue-200 text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          text: '진행중'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-200 text-gray-600',
          badge: 'bg-gray-100 text-gray-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: '대기'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const indent = task.level * 24;

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${statusConfig.color}`}
      style={{ marginLeft: `${indent}px` }}
    >
      {/* 상태 셀렉트박스 */}
      <select
        value={task.status}
        onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${statusConfig.badge} hover:opacity-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <option value={TaskStatus.PENDING}>대기</option>
        <option value={TaskStatus.IN_PROGRESS}>진행중</option>
        <option value={TaskStatus.COMPLETED}>완료</option>
      </select>

      {/* 레벨 표시 */}
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/50 text-xs font-semibold">
        {task.level}
      </div>

      {/* 작업 내용 */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
          onBlur={handleSaveEdit}
          className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 font-medium ${
            task.status === TaskStatus.COMPLETED ? 'line-through opacity-60' : ''
          }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.title}
        </span>
      )}

      {/* 시간 표시/설정 */}
      {isEditingTime ? (
        <div className="flex items-center gap-1.5">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <span className="text-xs">~</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={handleSaveTime}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 cursor-pointer"
          >
            저장
          </button>
          <button
            onClick={handleCancelTime}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 cursor-pointer"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditingTime(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white/50 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">
            {task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : ''}
          </span>
        </button>
      )}

      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
