// ... (宣言部分は省略) ...

function initializeFullCalendarWhenReady() {
    if (typeof FullCalendar !== 'undefined') {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            // DayGridプラグインがないため、List形式を推奨
            initialView: 'listWeek', 
            locale: 'ja',
            // 【修正】Google Calendarプラグインを復活
            plugins: ['googleCalendar'], 
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                // 表示形式をListとTimeGridに限定
                right: 'listWeek,timeGridDay' 
            },
            // ❌ 削除: この行は削除
            // googleCalendarApiKey: null, 
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
// ... (関数と window.onload はそのまま維持) ...
// ボタンからの呼び出しを可能にする
window.initializeGis = initializeGis;

// ✅ 修正箇所: DOMがロードされた後にイベントリスナーを設定する
document.getElementById('auth-button').addEventListener('click', initializeGis);
