import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DailySchedule, Project, Task } from '../types';
import { db } from '../services/database';
import { getTodayDate, generateId } from '../utils/helpers';

interface ScheduleContextType {
  currentSchedule: DailySchedule | null;
  currentDate: string;
  loading: boolean;
  setCurrentDate: (date: string) => void;
  addProject: (name: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  saveSchedule: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSchedule, setCurrentSchedule] = useState<DailySchedule | null>(null);
  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // 날짜가 변경되면 해당 날짜의 스케줄 로드
  useEffect(() => {
    loadSchedule(currentDate);
  }, [currentDate]);

  // currentSchedule이 변경되면 자동 저장
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (currentSchedule && !loading) {
      db.saveSchedule(currentSchedule).catch(error => {
        console.error('Failed to auto-save schedule:', error);
      });
    }
  }, [currentSchedule, loading]);

  const loadSchedule = async (date: string) => {
    setLoading(true);
    isInitialLoad.current = true;
    try {
      let schedule = await db.getScheduleByDate(date);
      
      if (!schedule) {
        // 해당 날짜의 스케줄이 없으면 새로 생성
        schedule = {
          id: generateId(),
          date,
          startTime: '09:30',
          endTime: '16:30',
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      setCurrentSchedule(schedule);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = (name: string) => {
    if (!currentSchedule) return;

    const newProject: Project = {
      id: generateId(),
      name,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCurrentSchedule({
      ...currentSchedule,
      projects: [...currentSchedule.projects, newProject],
      updatedAt: new Date()
    });
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      projects: currentSchedule.projects.map(p =>
        p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      updatedAt: new Date()
    });
  };

  const deleteProject = (projectId: string) => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      projects: currentSchedule.projects.filter(p => p.id !== projectId),
      updatedAt: new Date()
    });
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentSchedule) return;

    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCurrentSchedule({
      ...currentSchedule,
      projects: currentSchedule.projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: [...p.tasks, newTask], updatedAt: new Date() }
          : p
      ),
      updatedAt: new Date()
    });
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      projects: currentSchedule.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map(t =>
                t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
              ),
              updatedAt: new Date()
            }
          : p
      ),
      updatedAt: new Date()
    });
  };

  const deleteTask = (projectId: string, taskId: string) => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      projects: currentSchedule.projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId), updatedAt: new Date() }
          : p
      ),
      updatedAt: new Date()
    });
  };

  const saveSchedule = async () => {
    if (!currentSchedule) return;

    try {
      await db.saveSchedule(currentSchedule);
    } catch (error) {
      console.error('Failed to save schedule:', error);
      throw error;
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        currentSchedule,
        currentDate,
        loading,
        setCurrentDate,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        saveSchedule
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
