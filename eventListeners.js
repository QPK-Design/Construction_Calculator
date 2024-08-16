///this is not connected to calculators.js yet


///export function setupEventListeners() {
    const calculateBtn = document.getElementById('calculateBtn');
    const convertBtn = document.getElementById('convertBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const convertToDecimalFeetBtn = document.getElementById('convertToDecimalFeetBtn');
    const calculateSlopeBtn = document.getElementById('calculateSlopeBtn');
    const convertGaugeBtn = document.getElementById('convertGaugeBtn');

    if (calculateBtn) calculateBtn.addEventListener('click', calculate);
    if (convertBtn) convertBtn.addEventListener('click', convertToMetric);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
    if (convertToDecimalFeetBtn) convertToDecimalFeetBtn.addEventListener('click', convertToDecimalFeet);
    if (calculateSlopeBtn) calculateSlopeBtn.addEventListener('click', calculateSlope);
    if (convertGaugeBtn) convertGaugeBtn.addEventListener('click', convertGauge);

    // Add keydown event listeners for 'calculate' Function
    const calculatorInputs = ['feet1', 'inches1', 'feet2', 'inches2'];
    calculatorInputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    calculate();
                }
            });
        }
    });

    // Add keydown event listeners for 'convertToMetric' Function
    const standardToMetricInputs = ['feetToConvert', 'inchesToConvert'];
    standardToMetricInputs.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    convertToMetric();
                }
            });
        }
    });
///}