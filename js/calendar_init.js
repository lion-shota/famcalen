// ==========================================================
// 【重要】設定が必要な箇所
// ==========================================================
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// ==========================================================

let calendar = null;
let accessToken = null;

// FullCalendarが利用可能になるまで待機し、初期化を行う関数
function initializeFullCalendarWhenReady() {
    // ログに FullCalendar 初期化失敗の記録が残る場合があるため、ここで typeof チェックを行う
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        // FullCalendarの初期化（TypeErrorの原因となる部分）
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', 
            locale: 'ja',
            // DayGridを含めたプラグインを指定
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

// window.onload で 全ての処理を開始
window.onload = function() {
    // FullCalendarの初期化を開始
    initializeFullCalendarWhenReady();

    // DOMContentLoaded でボタンへのイベントリスナーを設定
    document.getElementById('auth-button').addEventListener('click', initializeGis);
};

// 互換性のためグローバルに公開
window.initializeGis = initializeGis;
