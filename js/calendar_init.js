// ==========================================================
// 【重要】設定が必要な箇所
// ==========================================================
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// ==========================================================

let calendar = null;
let accessToken = null;

// ==========================================================
// 🚨 修正点: 関数定義をイベントリスナー設定より前に配置
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


// FullCalendarが利用可能になるまで待機し、初期化を行う関数
function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'listWeek', 
            locale: 'ja',
            plugins: ['googleCalendar'], 
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'listWeek,timeGridDay'
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
// 🚨 修正点: DOMContentLoaded でボタンへのイベントリスナーを設定
// ==========================================================
// window.onload と initializeGis の定義が全て完了した後に実行される
document.addEventListener('DOMContentLoaded', function() {
    // initializeGis 関数を直接呼び出すよう、イベントリスナーを設定
    document.getElementById('auth-button').addEventListener('click', initializeGis);
});

window.onload = function() {
    initializeFullCalendarWhenReady();
};

// HTMLの onclick 属性からの呼び出しのためにグローバルに公開
window.initializeGis = initializeGis;
