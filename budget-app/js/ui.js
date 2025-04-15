// UI 관련 작업 처리
class BudgetUI {
    constructor() {
        // 현재 페이지에 따라 다른 요소 초기화
        if (window.location.pathname.endsWith('add-transaction.html')) {
            this.initAddTransactionElements();
        } else {
            this.initMainPageElements();
        }
    }
    
    // 메인 페이지 요소 초기화
    initMainPageElements() {
        this.balanceEl = document.querySelector('.balance');
        this.incomeValueEl = document.querySelector('.income-value');
        this.expenseValueEl = document.querySelector('.expense-value');
        this.transactionsContainer = document.getElementById('transactions-container');
    }
    
    // 거래내역 추가 페이지 요소 초기화
    initAddTransactionElements() {
        this.typeRadios = document.querySelectorAll('input[name="transaction-type"]');
        this.amountInput = document.getElementById('transaction-amount');
        this.dateInput = document.getElementById('transaction-date');
        this.descriptionInput = document.getElementById('transaction-description');
        this.categorySelect = document.getElementById('transaction-category');
        this.todayBtn = document.querySelector('.today-btn');
        this.saveBtn = document.getElementById('save-btn');
    }
    
    // 잔액 표시 업데이트
    updateBalance(balance, income, expense) {
        if (!this.balanceEl) return;
        
        this.balanceEl.textContent = this.formatAmountWithoutSign(balance);
        this.incomeValueEl.textContent = this.formatAmountWithoutSign(income);
        this.expenseValueEl.textContent = this.formatAmountWithoutSign(expense);
    }
    
    // 거래내역 목록 표시
    displayTransactions(transactions) {
        if (!this.transactionsContainer) return;
        
        this.transactionsContainer.innerHTML = '';
        
        if (transactions.length === 0) {
            this.transactionsContainer.innerHTML = `
                <div class="no-transactions">
                    <p>거래내역이 없습니다.</p>
                </div>
            `;
            return;
        }
        
        // 최대 10개까지만 표시
        const recentTransactions = transactions.slice(0, 10);
        
        recentTransactions.forEach(transaction => {
            const { id, type, amount, description, date, category } = transaction;
            
            // 카테고리에 따른 아이콘 선택
            const iconSvg = this.getCategoryIcon(category);
            
            const transactionEl = document.createElement('div');
            transactionEl.classList.add('transaction-item');
            transactionEl.setAttribute('data-id', id);
            
            transactionEl.innerHTML = `
                <div class="transaction-info">
                    <div class="category-icon">
                        ${iconSvg}
                    </div>
                    <div class="transaction-details">
                        <h3>${description}</h3>
                        <span class="transaction-meta">${this.formatDate(date)} • ${category}</span>
                    </div>
                </div>
                <div class="transaction-amount amount-${type}">
                    ${this.formatAmount(amount, type)}
                </div>
            `;
            
            this.transactionsContainer.appendChild(transactionEl);
        });
    }
    
    // 입력 폼 초기화
    clearForm() {
        if (!this.amountInput) return;
        
        this.amountInput.value = '';
        this.descriptionInput.value = '';
        this.typeRadios[0].checked = true; // 기본값 입금으로 설정
    }
    
    // 카테고리별 아이콘 가져오기
    getCategoryIcon(category) {
        const icons = {
            '식품': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
            '외식': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
            '교통': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
            '공과금': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
        };
        
        // 해당 카테고리 아이콘이 없으면 기본 아이콘 반환
        return icons[category] || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }
    
    // 날짜를 한국어 형식으로 포맷팅 (2023년 4월 12일)
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `${year}년 ${month}월 ${day}일`;
    }
    
    // 금액을 한국어 형식으로 포맷팅 (₩1,234,567) - 부호 포함
    formatAmount(amount, type) {
        const formatted = new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
        
        return type === 'expense' ? `-${formatted}` : `+${formatted}`;
    }
    
    // 금액을 한국어 형식으로 포맷팅 - 부호 없음
    formatAmountWithoutSign(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
    }
}

// 전역으로 사용할 수 있도록 인스턴스 생성
const budgetUI = new BudgetUI();