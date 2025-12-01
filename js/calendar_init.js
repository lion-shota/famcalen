// js/calendar_init.js の内容

// ==========================================================
// 【重要】設定が必要な箇所
// ==========================================================
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
// ==========================================================

let calendar = null;
let accessToken = null;

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


function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            // ✅ 修正点: 初期ビューをList形式に切り替え (コア機能)
            initialView: 'listWeek', 
            locale: 'ja',
            // DayGridを削除したため、Google Calendarプラグインのみに限定
            plugins: ['googleCalendar'], 
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                // ✅ 修正点: DayGridMonthを削除し、List/TimeGridに限定
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
// イベントリスナー設定
// ==========================================================

// window.onload で DOM構造の準備が完了してからチェックを開始
window.onload = function() {
    initializeFullCalendarWhenReady();
};

// DOMContentLoaded でボタンへのイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    // initializeGis 関数を直接呼び出すよう、イベントリスナーを設定
    document.getElementById('auth-button').addEventListener('click', initializeGis);
});

// ボタンからの呼び出しを可能にする
window.initializeGis = initializeGis;
