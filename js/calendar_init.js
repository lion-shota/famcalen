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

// FullCalendarが利用可能になるまで待機し、初期化を行う関数
function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            // DayGridプラグインがないため、エラーを避けるためにビューをデフォルトのlistに切り替えることを推奨
            initialView: 'dayGridMonth', // 一旦、DayGridがコア機能として残っている可能性に賭け維持
            locale: 'ja',
            // 【修正】DayGridプラグインを削除
            plugins: ['googleCalendar'], 
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

// window.onload で DOM構造の準備が完了してからチェックを開始
window.onload = function() {
    initializeFullCalendarWhenReady();
};

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

// ボタンからの呼び出しを可能にする
window.initializeGis = initializeGis;
