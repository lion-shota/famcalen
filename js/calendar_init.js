// ==========================================================
// 【重要】設定が必要な箇所
// ==========================================================
// 🚨 CLIENT_ID: GCPで取得したOAuthクライアントID
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
// 📅 CALENDAR_ID: アクセスしたい非公開カレンダーの完全なID
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
// 🔒 SCOPE: カレンダーの読み取り専用アクセスを要求
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// ==========================================================

let calendar = null;
let accessToken = null;

// ==========================================================
// 1. 関数定義
// ==========================================================

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
         // 初期化を待機
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

// FullCalendarの初期化関数 (利用可能チェックロジックを含む)
function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        // V5系の安定したプラグイン構成
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', 
            locale: 'ja',
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
        // FullCalendarがロードされるまで待機
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

    // DOMContentLoaded でボタンへのイベントリスナーを設定
    document.getElementById('auth-button').addEventListener('click', initializeGis);
};

// 互換性のためグローバルに公開
window.initializeGis = initializeGis;
