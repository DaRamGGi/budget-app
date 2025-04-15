// IndexedDB를 사용한 데이터 저장 처리
class BudgetStorage {
    constructor() {
        this.dbName = 'budgetApp';
        this.dbVersion = 1;
        this.transactionsStore = 'transactions';
        this.db = null;
        
        this.initDatabase();
    }
    
    // IndexedDB 초기화
    initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            // DB 생성 또는 업그레이드 필요시
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 거래내역 저장소 생성
                if (!db.objectStoreNames.contains(this.transactionsStore)) {
                    const store = db.createObjectStore(this.transactionsStore, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('데이터베이스 연결 성공');
                resolve();
            };
            
            request.onerror = (event) => {
                console.error('데이터베이스 오류:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    // 모든 거래내역 가져오기
    getAllTransactions() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('데이터베이스가 초기화되지 않았습니다.');
                return;
            }
            
            const transaction = this.db.transaction(this.transactionsStore, 'readonly');
            const store = transaction.objectStore(this.transactionsStore);
            const request = store.getAll();
            
            request.onsuccess = () => {
                // 날짜 순으로 정렬 (최신순)
                const transactions = request.result.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                resolve(transactions);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    // 새 거래내역 추가
    addTransaction(transactionData) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('데이터베이스가 초기화되지 않았습니다.');
                return;
            }
            
            const tx = this.db.transaction(this.transactionsStore, 'readwrite');
            const store = tx.objectStore(this.transactionsStore);
            const request = store.add(transactionData);
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    // 특정 거래내역 삭제
    deleteTransaction(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('데이터베이스가 초기화되지 않았습니다.');
                return;
            }
            
            const tx = this.db.transaction(this.transactionsStore, 'readwrite');
            const store = tx.objectStore(this.transactionsStore);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                resolve();
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
    
    // 현재 잔액 계산
    getBalance() {
        return new Promise((resolve, reject) => {
            this.getAllTransactions()
                .then(transactions => {
                    let income = 0;
                    let expense = 0;
                    
                    transactions.forEach(transaction => {
                        if (transaction.type === 'income') {
                            income += transaction.amount;
                        } else {
                            expense += transaction.amount;
                        }
                    });
                    
                    const balance = income - expense;
                    resolve({ balance, income, expense });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

// 전역으로 사용할 수 있도록 인스턴스 생성
const budgetStorage = new BudgetStorage();