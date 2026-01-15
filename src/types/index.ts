// 작업 상태
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// 작업 항목
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  level: number; // 계층 레벨 (1), (1), (2) 등
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// 프로젝트/작업 그룹
export interface Project {
  id: string;
  name: string;
  color?: string;
  startTime?: string;
  endTime?: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

// 일일 스케줄
export interface DailySchedule {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// 템플릿
export interface Template {
  id: string;
  name: string;
  description?: string;
  projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[];
  createdAt: Date;
  updatedAt: Date;
}
