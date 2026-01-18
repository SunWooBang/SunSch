import { Project, Task } from '../types';

export interface NotificationItem {
  id: string;
  type: 'project' | 'task';
  eventType: 'start' | 'end';
  name: string;
  time: string;
  projectName?: string; // task인 경우 프로젝트 이름
}

class NotificationService {
  private hasPermission: boolean = false;
  private notifiedItems: Set<string> = new Set(); // 이미 알림 보낸 항목 추적
  private lastCheckedMinute: string = ''; // 마지막으로 체크한 분 추적

  // Electron 환경인지 확인
  private isElectron(): boolean {
    return !!(window.navigator.userAgent.includes('Electron') || (window as any).electron);
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    // Electron에서는 권한이 자동으로 허용됨
    if (this.isElectron()) {
      console.log('Electron 환경: 알림 권한 자동 허용');
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  checkPermission(): boolean {
    // Electron에서는 항상 권한이 있음
    if (this.isElectron()) {
      return 'Notification' in window;
    }
    return 'Notification' in window && Notification.permission === 'granted';
  }

  private sendNotification(title: string, body: string, tag: string) {
    if (!this.checkPermission()) {
      console.warn('알림 권한이 없습니다.');
      return;
    }

    // 이미 알림을 보낸 항목이면 중복으로 보내지 않음
    if (this.notifiedItems.has(tag)) {
      console.log('중복 알림 방지:', tag);
      return;
    }

    console.log('알림 발송:', tag);
    const notification = new Notification(title, {
      body,
      icon: '/icon.png', // 아이콘 경로는 필요시 수정
      tag,
      requireInteraction: true, // 사용자가 닫을 때까지 표시
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // 알림 보낸 것으로 표시
    this.notifiedItems.add(tag);
  }

  checkAndNotify(projects: Project[]) {
    if (!this.checkPermission()) {
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 분이 바뀌면 이전 분의 알림 기록을 제거 (새로운 분에 다시 알림 가능하도록)
    if (this.lastCheckedMinute !== currentTime) {
      console.log(`시간 변경: ${this.lastCheckedMinute} → ${currentTime}`);
      // 이전 분의 알림 기록만 제거
      if (this.lastCheckedMinute) {
        const itemsToRemove: string[] = [];
        this.notifiedItems.forEach(item => {
          if (item.includes(this.lastCheckedMinute)) {
            itemsToRemove.push(item);
          }
        });
        itemsToRemove.forEach(item => this.notifiedItems.delete(item));
        console.log(`이전 분(${this.lastCheckedMinute}) 알림 기록 제거:`, itemsToRemove.length);
      }
      this.lastCheckedMinute = currentTime;
    }

    projects.forEach(project => {
      // 프로젝트 시작 시간 체크
      if (project.startTime && project.startTime === currentTime) {
        const tag = `project-start-${project.id}-${currentTime}`;
        this.sendNotification(
          '프로젝트 시작 시간입니다',
          `"${project.name}" 프로젝트를 시작할 시간입니다.`,
          tag
        );
      }

      // 프로젝트 종료 시간 체크
      if (project.endTime && project.endTime === currentTime) {
        const tag = `project-end-${project.id}-${currentTime}`;
        this.sendNotification(
          '프로젝트 종료 시간입니다',
          `"${project.name}" 프로젝트를 종료할 시간입니다.`,
          tag
        );
      }

      // 각 프로젝트의 작업들 체크
      project.tasks.forEach(task => {
        // 작업 시작 시간 체크
        if (task.startTime && task.startTime === currentTime) {
          const tag = `task-start-${task.id}-${currentTime}`;
          this.sendNotification(
            '작업 시작 시간입니다',
            `[${project.name}] "${task.title}" 작업을 시작할 시간입니다.`,
            tag
          );
        }

        // 작업 종료 시간 체크
        if (task.endTime && task.endTime === currentTime) {
          const tag = `task-end-${task.id}-${currentTime}`;
          this.sendNotification(
            '작업 종료 시간입니다',
            `[${project.name}] "${task.title}" 작업을 종료할 시간입니다.`,
            tag
          );
        }
      });
    });
  }

  // 하루가 바뀌면 알림 기록 초기화 (같은 작업이 다음날 다시 알림되도록)
  resetDailyNotifications() {
    this.notifiedItems.clear();
  }

  // 특정 시간에 알림이 예정된 항목들을 가져오기 (UI에 표시 가능)
  getUpcomingNotifications(projects: Project[]): NotificationItem[] {
    const items: NotificationItem[] = [];

    projects.forEach(project => {
      if (project.startTime) {
        items.push({
          id: `project-start-${project.id}`,
          type: 'project',
          eventType: 'start',
          name: project.name,
          time: project.startTime,
        });
      }

      if (project.endTime) {
        items.push({
          id: `project-end-${project.id}`,
          type: 'project',
          eventType: 'end',
          name: project.name,
          time: project.endTime,
        });
      }

      project.tasks.forEach(task => {
        if (task.startTime) {
          items.push({
            id: `task-start-${task.id}`,
            type: 'task',
            eventType: 'start',
            name: task.title,
            time: task.startTime,
            projectName: project.name,
          });
        }

        if (task.endTime) {
          items.push({
            id: `task-end-${task.id}`,
            type: 'task',
            eventType: 'end',
            name: task.title,
            time: task.endTime,
            projectName: project.name,
          });
        }
      });
    });

    // 시간순으로 정렬
    return items.sort((a, b) => a.time.localeCompare(b.time));
  }
}

export const notificationService = new NotificationService();
