import { DailySchedule, Template } from '../types';

class Database {
  private SCHEDULES_KEY = 'sunsch_schedules';
  private TEMPLATES_KEY = 'sunsch_templates';

  // 스케줄 관련 메서드
  async getScheduleByDate(date: string): Promise<DailySchedule | null> {
    const schedules = this.getAllSchedulesSync();
    return schedules.find(s => s.date === date) || null;
  }

  async saveSchedule(schedule: DailySchedule): Promise<DailySchedule> {
    const schedules = this.getAllSchedulesSync();
    const index = schedules.findIndex(s => s.date === schedule.date);

    if (index >= 0) {
      schedules[index] = schedule;
    } else {
      schedules.push(schedule);
    }

    localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(schedules));
    return schedule;
  }

  async getAllSchedules(): Promise<DailySchedule[]> {
    return this.getAllSchedulesSync();
  }

  private getAllSchedulesSync(): DailySchedule[] {
    const data = localStorage.getItem(this.SCHEDULES_KEY);
    if (!data) return [];

    try {
      const schedules = JSON.parse(data);
      // Date 객체 복원
      return schedules.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      }));
    } catch {
      return [];
    }
  }

  async deleteSchedule(date: string): Promise<number> {
    const schedules = this.getAllSchedulesSync();
    const filtered = schedules.filter(s => s.date !== date);
    localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(filtered));
    return schedules.length - filtered.length;
  }

  // 템플릿 관련 메서드
  async getTemplate(id: string): Promise<Template | null> {
    const templates = this.getAllTemplatesSync();
    return templates.find(t => t.id === id) || null;
  }

  async saveTemplate(template: Template): Promise<Template> {
    const templates = this.getAllTemplatesSync();
    const index = templates.findIndex(t => t.id === template.id);

    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }

    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return this.getAllTemplatesSync();
  }

  private getAllTemplatesSync(): Template[] {
    const data = localStorage.getItem(this.TEMPLATES_KEY);
    if (!data) return [];

    try {
      const templates = JSON.parse(data);
      // Date 객체 복원
      return templates.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }));
    } catch {
      return [];
    }
  }

  async deleteTemplate(id: string): Promise<number> {
    const templates = this.getAllTemplatesSync();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(filtered));
    return templates.length - filtered.length;
  }
}

export const db = new Database();
