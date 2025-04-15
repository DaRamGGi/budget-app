// 앱 초기화 및 이벤트 처리
class BudgetApp {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        
        // 앱 초기화
        this.init();
    }
    
    async init() {
        // 데이터베이스 연결 대기
        await new Promise(resolve => {
            const checkDb = setInterval(() => {
                if (this.storage.db) {
                    clearInterval(checkDb);
                    resolve();
                }
            }, 100);
        });
        
        // 앱 데이터 로드 및 UI 업데이트
        this.loadData();
    }
    
    async loadData() {
        try {
            // 모든 거래내역 가져오기
            const transactions = await this.storage.getAllTransactions();
            
            // 잔액, 수입, 지출 계산
            const { balance, income, expense } = await this.storage.getBalance();
            
            // UI 업데이트
            this.ui.updateBalance(balance, income, expense);
            this.ui.displayTransactions(transactions);
        } catch (error) {
            console.error('데이터 로드 오류:', error);
        }
    }
}

// 페이지 로드 시 앱 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const app = new BudgetApp(budgetStorage, budgetUI);
});