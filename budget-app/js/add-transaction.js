// 거래내역 추가 화면 관련 로직
class AddTransactionHandler {
    constructor(storage, ui) {
        this.storage = storage;
        this.ui = ui;
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 초기화
        this.init();
    }
    
    init() {
        // 오늘 날짜로 초기화
        this.setTodayDate();
    }
    
    setupEventListeners() {
        // 오늘 날짜 버튼
        this.ui.todayBtn.addEventListener('click', () => this.setTodayDate());
        
        // 저장 버튼
        this.ui.saveBtn.addEventListener('click', () => this.saveTransaction());
    }
    
    setTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        
        // 한 자리 숫자인 경우 앞에 0 추가
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        this.ui.dateInput.value = `${year}-${month}-${day}`;
    }
    
    saveTransaction() {
        // 입력값 검증
        const amount = parseFloat(this.ui.amountInput.value);
        const description = this.ui.descriptionInput.value.trim();
        const date = this.ui.dateInput.value;
        const category = this.ui.categorySelect.value;
        let type = '';
        
        // 선택된 거래 타입 가져오기
        for (const radio of this.ui.typeRadios) {
            if (radio.checked) {
                type = radio.value;
                break;
            }
        }
        
        // 유효성 검사
        if (isNaN(amount) || amount <= 0) {
            alert('유효한 금액을 입력해주세요.');
            return;
        }
        
        if (description === '') {
            alert('설명을 입력해주세요.');
            return;
        }
        
        if (date === '') {
            alert('날짜를 선택해주세요.');
            return;
        }
        
        // 거래내역 객체 생성
        const transaction = {
            type,
            amount,
            description,
            date,
            category,
            timestamp: new Date().getTime()
        };
        
        // 저장 처리
        this.storage.addTransaction(transaction)
            .then(() => {
                alert('거래내역이 저장되었습니다.');
                window.location.href = 'index.html'; // 메인 화면으로 이동
            })
            .catch(error => {
                console.error('저장 오류:', error);
                alert('저장 중 오류가 발생했습니다.');
            });
    }
}

// 데이터베이스 연결 대기 함수
function waitForDatabase(callback) {
    const checkInterval = setInterval(() => {
        if (budgetStorage && budgetStorage.db) {
            clearInterval(checkInterval);
            callback();
        }
    }, 100);
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // DB 연결을 기다린 후 핸들러 초기화
    waitForDatabase(() => {
        const addTransactionHandler = new AddTransactionHandler(budgetStorage, budgetUI);
    });
});