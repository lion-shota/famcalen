// ... (CLIENT_ID, CALENDAR_ID, SCOPE の設定値はそのまま維持) ...
const CLIENT_ID = '376485449787-sk76t7tgmigbmqgm4h2vkkgr72hq1kl5.apps.googleusercontent.com';
const CALENDAR_ID = 'it.is.shotaime@google.com'; 
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
let calendar = null;
let accessToken = null;

function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            // 【修正】初期ビューをList形式に切り替え (コア機能)
            initialView: 'listWeek', 
            locale: 'ja',
            // 【修正】プラグインを全て削除 (最小構成)
            plugins: [], 
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                // 表示形式をListとTimeGridに限定
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

window.onload = function() {
    initializeFullCalendarWhenReady();
};

// ... (initializeGis および loadCalendarEvents 関数は、この状態では機能しませんが、コードの整合性のため維持します。)
// ... (window.initializeGis = initializeGis; も維持します)
