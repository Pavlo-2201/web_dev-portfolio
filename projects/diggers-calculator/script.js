let brigadeTypes = ['', '', ''];

document.addEventListener('DOMContentLoaded', function() {
    createDitches();
});

function createDitches() {
    const container = document.getElementById('ditchesContainer');
    container.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const ditchHTML = `
            <div class="ditch-container">
                <h3>Канава ${i + 1}</h3>
                
                <div class="ditch-input">
                    <label>Длина канавы (метры):</label>
                    <input type="number" id="ditch${i + 1}" min="1" value="${10 + i * 5}">
                </div>

                <div class="brigade-choice">
                    <div class="brigade-option ${brigadeTypes[i] === 'mechanized' ? 'selected' : ''}" 
                         onclick="selectBrigade(${i}, 'mechanized')">
                        <img src="землекоп2.png" alt="Механизированная бригада">
                        <div>Механизированная</div>
                    </div>
                    <div class="brigade-option ${brigadeTypes[i] === 'manual' ? 'selected' : ''}" 
                         onclick="selectBrigade(${i}, 'manual')">
                        <img src="землекоп1.png" alt="Обычная бригада">
                        <div>Обычная</div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += ditchHTML;
    }
}

function selectBrigade(ditchIndex, type) {
    brigadeTypes[ditchIndex] = type;
    
    const ditchContainer = document.querySelectorAll('.ditch-container')[ditchIndex];
    const allOptions = ditchContainer.querySelectorAll('.brigade-option');
    
    allOptions.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = ditchContainer.querySelector(`[onclick="selectBrigade(${ditchIndex}, '${type}')"]`);
    selectedOption.classList.add('selected');
}

function calculateWorkers() {
    if (brigadeTypes.some(type => type === '')) {
        alert('Пожалуйста, выберите тип бригады для всех канав!');
        return;
    }

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '<h2>Результаты расчета:</h2>';

    const calculateWorkersFunction = new Function(`
        const results = [];
        let totalWorkers = 0;
        
        for (let i = 0; i < 3; i++) {
            const ditchLength = parseFloat(document.getElementById('ditch' + (i + 1)).value);
            const isMechanized = brigadeTypes[i] === 'mechanized';
            const metersPerWorker = isMechanized ? 4 : 3;
            
            const workers = Math.ceil(ditchLength / metersPerWorker);
            totalWorkers += workers;
            
            results.push({
                ditchNumber: i + 1,
                length: ditchLength,
                isMechanized: isMechanized,
                workers: workers,
                brigadeType: isMechanized ? 'Механизированная' : 'Обычная'
            });
        }
        
        return { results, totalWorkers };
    `);

    const calculation = calculateWorkersFunction();
    
    showDitchConfirms(calculation.results, calculation.totalWorkers, resultContainer);
}

function showDitchConfirms(ditchResults, totalWorkers, resultContainer) {
    let currentDitch = 0;
    let workingDitches = [];
    
    function showNextConfirm() {
        if (currentDitch >= ditchResults.length) {
            showFinalResult(workingDitches, totalWorkers, resultContainer);
            return;
        }

        const ditch = ditchResults[currentDitch];
        const result = confirm(`Показать результат для канавы ${ditch.ditchNumber}?`);
        
        let resultHTML = '';
        let imageSrc = '';

        if (result) {
            workingDitches.push(ditch);
            
            resultHTML = `
                <div class="result-item" style="background-color: #e8f5e8;">
                    <h3>✅ Канава ${ditch.ditchNumber} - РАБОТАЕТ</h3>
                    Длина: ${ditch.length} м<br>
                    Тип бригады: ${ditch.brigadeType}<br>
                    Землекопов: ${ditch.workers}
                </div>
            `;
            
            if (ditch.isMechanized) {
                imageSrc = 'землекоп2.png'; 
            } else {
                imageSrc = 'землекоп1.png'; 
            }
        } else {
            resultHTML = `
                <div class="result-item" style="background-color: #fff0f0;">
                    <h3>😴 Канава ${ditch.ditchNumber} - В ОТПУСКЕ</h3>
                    Бригада отдыхает
                </div>
            `;
            imageSrc = 'землекоп3.png'; 
        }

        const ditchResultElement = document.createElement('div');
        ditchResultElement.innerHTML = resultHTML + `<img src="${imageSrc}" class="result-image" alt="Канава ${ditch.ditchNumber}"><br><br>`;
        resultContainer.appendChild(ditchResultElement);

        currentDitch++;
        
        setTimeout(showNextConfirm, 100);
    }

    showNextConfirm();
}

function showFinalResult(workingDitches, totalWorkers, resultContainer) {
    const actualTotalWorkers = workingDitches.reduce((sum, ditch) => sum + ditch.workers, 0);
    
    const finalHTML = `
        <div class="result-item" style="background-color: #e3f2fd; padding: 20px; margin-top: 20px;">
            <h2>📊 ОБЩИЙ ИТОГ</h2>
            <h3>Общее количество землекопов: ${actualTotalWorkers}</h3>
            <p>Работающих канав: ${workingDitches.length} из 3</p>
            <p>Отдыхающих канав: ${3 - workingDitches.length} из 3</p>
        </div>
    `;
    
    resultContainer.innerHTML += finalHTML;
}