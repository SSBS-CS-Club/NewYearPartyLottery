class LotterySystem {
    constructor() {
        this.currentPool = [...config.totalNumbers];
        this.currentStage = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('mainButton').addEventListener('click', () => this.startLottery());
    }

    async startLottery() {
        const button = document.getElementById('mainButton');
        button.disabled = true;
        
        const currentPrize = config.prizes[this.currentStage];
        this.createNumberBoxes(currentPrize.count);
        
        try {
            const winners = await this.animateSelection(currentPrize.count);
            this.displayResults(winners);
            this.updatePool(winners);
            this.updateButton(currentPrize);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            button.disabled = false;
        }
    }

    createNumberBoxes(count) {
        const display = document.getElementById('prizeDisplay');
        display.innerHTML = '';
        
        const boxContainer = document.createElement('div');
        boxContainer.className = 'prize-box';
        
        Array.from({length: count}).forEach(() => {
            const box = document.createElement('div');
            box.className = 'number-box rolling';
            box.textContent = '?';
            boxContainer.appendChild(box);
        });
        
        display.appendChild(boxContainer);
    }

    animateSelection(count) {
        return new Promise((resolve) => {
            const boxes = document.querySelectorAll('.number-box');
            const winners = [];
            let counter = 0;

            const interval = setInterval(() => {
                boxes.forEach((box, index) => {
                        box.textContent = this.getRandomNumber();
                });
            }, config.animation.interval);

            setTimeout(() => {
                clearInterval(interval);
                const available = [...this.currentPool];
                while(winners.length < count && available.length > 0) {
                    const randomIndex = Math.floor(Math.random() * available.length);
                    winners.push(available.splice(randomIndex, 1)[0]);
                }
                resolve(winners);
            }, config.animation.duration);
        });
    }

    displayResults(winners) {
        document.querySelectorAll('.number-box').forEach((box, index) => {
            box.classList.remove('rolling');
            box.textContent = winners[index] || 'Null';
            box.style.background = '#fffff';
        });
    }

    updatePool(winners) {
        this.currentPool = this.currentPool.filter(n => !winners.includes(n));
        this.currentStage++;
    }

    updateButton(currentPrize) {
        const button = document.getElementById('mainButton');
        if (this.currentStage < config.prizes.length) {
            button.textContent = `${config.prizes[this.currentStage].name}`;
        } else {
            button.remove();
            this.showCompletionMessage();
        }
    }

    getRandomNumber() {
        return this.currentPool.length > 0 
            ? this.currentPool[Math.floor(Math.random() * this.currentPool.length)]
            : ' ';
    }

    showCompletionMessage() {
        const display = document.getElementById('prizeDisplay');
        const message = document.createElement('div');
        message.style.fontSize = '24px';
        message.style.color = '#e74c3c';
        message.textContent = 'All Done';
        display.appendChild(message);
    }
}

// 初始化系统
new LotterySystem();