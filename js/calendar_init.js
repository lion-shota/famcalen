// ==========================================================
// 【重要】設定が必要な箇所
// ==========================================================
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// ==========================================================

let calendar = null;
let accessToken = null;

// 1. 関数定義 (ReferenceError対策として最優先で配置)
function initializeGis() {
    google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (tokenResponse) => {
            if (tokenResponse.error !== undefined) {
                console.error('認証エラー:', tokenResponse);
                alert('認証に失敗しました。GCPの設定を確認してください。');
                return;
            }
            accessToken = tokenResponse.access_token;
            loadCalendarEvents(accessToken);
        },
    }).requestAccessToken();
}

function loadCalendarEvents(token) {
    if (!calendar) {
         setTimeout(() => loadCalendarEvents(token), 100);
         return;
    }

    document.getElementById('status-message').textContent = '認証成功！カレンダーを読み込み中です...';
    document.getElementById('auth-status').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';

    calendar.setOption('eventSources', [
        {
            googleCalendarId: CALENDAR_ID,
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
    ]);

    calendar.render();
}

// FullCalendarの初期化関数
function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', 
            locale: 'ja',
            // V5形式のプラグイン名で初期化
            plugins: ['dayGrid', 'googleCalendar'], 
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            googleCalendarApiKey: null,
            eventSources: [],
            eventSourceFailure: function (error) {
                console.error('カレンダーの読み込みに失敗しました:', error);
                alert('カレンダーの読み込みに失敗しました。アクセス権限を確認してください。');
            }
        });
        
        console.log("FullCalendar 初期化成功！"); 
    } else {
        setTimeout(initializeFullCalendarWhenReady, 50);
    }
}

// ==========================================================
// 2. イベントハンドラの設定
// ==========================================================

// window.onload で 全ての処理を開始
window.onload = function() {
    // FullCalendarの初期化を開始
    initializeFullCalendarWhenReady();

    // ボタンへのイベントリスナーを設定 (ReferenceError対策)
    document.getElementById('auth-button').addEventListener('click', initializeGis);
};

// HTMLの onclick 属性を削除したため、このグローバル公開は不要ですが、念のため維持します
window.initializeGis = initializeGis;
