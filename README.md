# SunSch - Daily Schedule Manager

일일 스케줄을 관리하는 데스크톱 애플리케이션입니다.  
Electron 으로 윈도우에서도 사용할 수 있는 데스크탑앱으로 개발했습니다.
  
<img width="1578" height="890" alt="image" src="https://github.com/user-attachments/assets/e3235d76-2f7f-43fe-bd91-49d4063ef79d" />
  

## 기술스택
- Electron  
- React  
- TypeScript

## 주요 기능

### 프로젝트 관리
- 프로젝트 생성, 수정, 삭제
- 프로젝트별 시작/종료 시간 설정
- 프로젝트 진행률 시각화 (완료: 초록색, 진행중: 파란색)

### 작업 관리
- 작업 생성, 수정, 삭제
- 작업 상태 관리 (대기, 진행중, 완료)
- 작업별 시간 설정
- 계층 레벨 지원

### 날짜 네비게이션
- 이전/다음 날짜 이동
- 달력을 통한 날짜 선택
- 오늘 날짜로 빠른 이동

### 사이드바
- 접기/펼치기 지원
- 프로젝트/작업 통계
- 전체 진행률 표시

### 데이터 관리
- 자동 저장 (변경 시 즉시 저장)
- IndexedDB를 통한 영구 저장
- 날짜별 스케줄 분리 저장

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Desktop**: Electron
- **Database**: IndexedDB (Dexie.js)
- **Date**: Day.js

## 설치 및 실행

### 개발 모드

```bash
# 의존성 설치
npm install

# 웹 개발 서버 실행
npm run dev

# Electron 개발 모드 실행
npm run electron:dev
```

### 빌드

```bash
# 웹 빌드
npm run build

# Electron 빌드
npm run electron:build
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Header.tsx       # 헤더 (날짜 네비게이션, 달력)
│   ├── Sidebar.tsx      # 사이드바 (통계, 프로젝트 추가)
│   ├── MainContent.tsx  # 메인 콘텐츠 영역
│   ├── ProjectCard.tsx  # 프로젝트 카드
│   └── TaskItem.tsx     # 작업 항목
├── contexts/
│   └── ScheduleContext.tsx  # 스케줄 상태 관리
├── services/
│   └── database.ts      # IndexedDB 데이터베이스
├── types/
│   └── index.ts         # TypeScript 타입 정의
├── utils/
│   ├── dayjs.ts         # Day.js 설정
│   └── helpers.ts       # 유틸리티 함수
├── App.tsx              # 앱 루트 컴포넌트
├── main.tsx             # React 진입점
└── index.css            # 전역 스타일

electron/
├── main.ts              # Electron 메인 프로세스
└── preload.ts           # Electron 프리로드 스크립트
```

## 라이선스

MIT License
