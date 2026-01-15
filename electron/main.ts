import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false; // 앱을 진짜 종료할지 결정하는 플래그

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // 상단 메뉴바 제거
    Menu.setApplicationMenu(null);

    // 개발 모드
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // 프로덕션 모드
        mainWindow.loadFile(path.join(__dirname, '../dist-react/index.html'));
    }

    // [추가] 창을 닫을 때 종료되지 않고 숨기기만 함
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });
}

// [추가] 트레이 생성 함수
function createTray() {
    // 1. 아이콘 경로를 더 안전하게 설정 (프로젝트 루트의 assets 또는 public 폴더 권장)
    // 개발 중에는 현재 위치 기준, 빌드 후에는 resources 경로를 고려해야 함
    let iconPath = '';
    if (process.env.NODE_ENV === 'development') {
        iconPath = path.join(__dirname, '..', 'public', 'favicon.ico'); // 개발 시 public 폴더 내 아이콘
    } else {
        iconPath = path.join(process.resourcesPath, 'dist-react', 'favicon.ico');
    }

    const icon = nativeImage.createFromPath(iconPath);

    // 아이콘이 비어있을 경우 대비 (빈 이미지가 들어가지 않게)
    if (icon.isEmpty()) {
        console.error('아이콘을 찾을 수 없습니다:', iconPath);
    }

    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'SunSch 열기', click: () => mainWindow?.show() },
        { type: 'separator' },
        {
            label: '종료',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('SunSch - Daily Schedule Manager');
    tray.setContextMenu(contextMenu);

    // 2. 'click' 대신 'double-click' 이벤트 사용
    tray.on('double-click', () => {
        mainWindow?.show();
        // 창이 최소화되어 있거나 뒤에 숨어있을 때 앞으로 가져오기
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    // (참고) 윈도우에서 'click' 이벤트가 contextMenu를 방해할 수 있으므로
    // 특정 동작을 넣고 싶지 않다면 click 이벤트는 아예 선언하지 않습니다.
}

app.whenReady().then(() => {
    createWindow();
    createTray(); // 트레이 실행

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // 이제 이 부분은 기본적으로 작동하지 않음 (isQuitting으로 제어)
        if (isQuitting) app.quit();
    }
});