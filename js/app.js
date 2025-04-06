class LotterySystem {
    constructor() {
        this.currentPool = [...config.totalNumbers];
        this.currentStage = 0;
        this.allWinners = [];
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
            this.allWinners.push({ name: currentPrize.name, winners });
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
        fireFireworks();
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
        message.style.fontSize = '40px';
        message.style.color = '#dec92a';
        message.textContent = 'All Done';
        display.appendChild(message);
    }

    // showCompletionMessage() {
    //         // 1. 淡出原来的数字卡片
    //     document.querySelectorAll('.number-box').forEach(box => {
    //         box.classList.add('fade-out');
    //     });
    //     fireFireworks();
        //setTimeout(() => {fireFireworks();},1000)
        // 2. 创建 summary panel 内容
        /*const summary = document.getElementById('summaryPanel');
        summary.innerHTML = '<h2>🎊 Winner Summary</h2>';
        summary.classList.add('fade-in'); // 初始化为透明

        this.allWinners.forEach(prize => {
            const line = document.createElement('div');
            line.textContent = `${prize.name}: ${prize.winners.join(', ')}`;
            summary.appendChild(line);
        });

        // 3. 延迟淡入 summary panel
        setTimeout(() => {
            summary.classList.add('show'); // 开始渐入
        }, 1000); // 1秒之后开始显示*/

        
    
    //}
    
}
function fireFireworks() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 6,
            angle: 60,
            spread: 100,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 6,
            angle: 120,
            spread: 100,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();

}





// 初始化系统
new LotterySystem();

window.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById("bgm");
    const muteBtn = document.getElementById("muteButton");
    bgm.muted = true
    let hasStarted = false


    // 初始化按钮文字
    muteBtn.textContent = bgm.muted ? "🔇 Music Off" : "🔈 Music On";

    // 切换静音 & 更新按钮文字
    muteBtn.addEventListener('click', () => {
        if (!hasStarted) {
            bgm.play().then(() => {
                hasStarted = true;
                console.log("音乐播放成功");
            }).catch((err) => {
                console.warn("音乐播放被阻止：", err);
            });
        }
        bgm.muted = !bgm.muted;
        muteBtn.textContent = bgm.muted ? "🔇 Music Off" : "🔈 Music On";
    });
});
