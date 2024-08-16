///import { setupEventListeners } from "./eventListeners";
///console.log (setupEventListeners);

let calculationHistory = [];

        function addToHistory(calculation) {
            calculationHistory.push(calculation);
            updateHistoryDisplay();
        }

        function updateHistoryDisplay() {
            const historyElement = document.getElementById('history');
            historyElement.innerHTML = calculationHistory.map(calc => `<p>${calc}</p>`).join('');
        }

        function clearHistory() {
            calculationHistory = [];
            updateHistoryDisplay();
        }

        function parseFractionalInput(input) {
            input = input.trim();
            let total = 0;
            let parts = input.split(' ');
            
            for (let part of parts) {
                if (part.includes('/')) {
                    let [numerator, denominator] = part.split('/').map(num => parseFloat(num.trim()));
                    total += numerator / denominator;
                } else {
                    total += parseFloat(part) || 0;
                }
            }
            
            return total;
        }

        function roundToNearestFraction(decimal, denominator) {
            return Math.round(decimal * denominator) / denominator;
        }

        function toConstructionFraction(decimal) {
            if (decimal == 0) return '0';
            const wholePart = Math.floor(decimal);
            let fractionalPart = decimal - wholePart;
    
            if (fractionalPart < 1/256) {  // Using 1/256 as the threshold for rounding to 0
                return wholePart.toString();
            }
    
    const tooltip = document.querySelector('tooltip');

    document.addEventListener('mousemove', (event) => {
        tooltip.style.left = event.pageX + 'px';
        tooltip.style.top = event.pageY + 'px';
    });
    
    const fractions = [2, 4, 8, 16, 32, 64, 128, 256];
    let bestFraction = { numerator: 0, denominator: 256 };
    let smallestError = Infinity;

    for (let denominator of fractions) {
        const rounded = roundToNearestFraction(fractionalPart, denominator);
        const error = Math.abs(rounded - fractionalPart);
        
        if (error < smallestError) {
            smallestError = error;
            bestFraction = {
                numerator: Math.round(rounded * denominator),
                denominator: denominator
            };
        }
    }

    if (bestFraction.numerator === 0) {
        return wholePart.toString();
    }

    // Simplify the fraction
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const divisor = gcd(bestFraction.numerator, bestFraction.denominator);
    bestFraction.numerator /= divisor;
    bestFraction.denominator /= divisor;

    if (wholePart > 0) {
        return `${wholePart} ${bestFraction.numerator}/${bestFraction.denominator}`;
    } else {
        return `${bestFraction.numerator}/${bestFraction.denominator}`;
    }
}

function formatResult(feet, inches) {
    const wholeFeet = Math.floor(feet);
    const totalInches = (feet - wholeFeet) * 12 + inches;
    const wholeInches = Math.floor(totalInches);
    const fractionalInches = totalInches - wholeInches;
    
    let result = '';
    if (wholeFeet > 0) {
        result += `${wholeFeet}'`;
    }
    if (wholeInches > 0 || fractionalInches > 0) {
        if (result) result += '-';
        result += toConstructionFraction(totalInches % 12) + '"';
    }
    return result || '0"';
}

        function calculate() {
            const feet1 = parseFloat(document.getElementById('feet1').value) || 0;
            const inches1 = parseFractionalInput(document.getElementById('inches1').value);
            const feet2 = parseFloat(document.getElementById('feet2').value) || 0;
            const inches2 = parseFractionalInput(document.getElementById('inches2').value);
            const operation = document.getElementById('operation').value;

            const totalInches1 = feet1 * 12 + inches1;
            const totalInches2 = feet2 * 12 + inches2;

            let result;
            switch (operation) {
                case '+':
                    result = totalInches1 + totalInches2;
                    break;
                case '-':
                    result = totalInches1 - totalInches2;
                    break;
                case '*':
                    result = totalInches1 * totalInches2;
                    break;
                case '/':
                    result = totalInches1 / totalInches2;
                    break;
            }

            const resultFeet = Math.floor(result / 12);
            const resultInches = result % 12;

            const resultText = `<span style="color: black;">Result: <span style="color: red;">${formatResult(resultFeet, resultInches)}`;
            document.getElementById('result').innerHTML = resultText;

            const calculationText = `${formatResult(feet1, inches1)} ${operation} ${formatResult(feet2, inches2)} = ${formatResult(resultFeet, resultInches)}`;
            addToHistory(calculationText);
        }

        function standardToMetric() {
            const feet = parseFloat(document.getElementById('feetToConvert').value) || 0;
            const inches = parseFractionalInput(document.getElementById('inchesToConvert').value);

            const totalInches = feet * 12 + inches;
            const totalCentimeters = totalInches * 2.54;

            const meters = Math.floor(totalCentimeters / 100);
            const centimeters = totalCentimeters % 100;
            const millimeters = inches * 25.4;
            const kilometers = meters / 1000;

            const resultText = `<span style="color: black;">Result:<br>${feet}'-${inches}" = <span style="color: red;">${millimeters.toFixed(Math.max(1, getDecimalPlaces(millimeters)))} mm
            <br><span style="color: black;">or <span style="color: red;">${centimeters.toFixed(Math.max(1, getDecimalPlaces(centimeters)))} cm
            <br><span style="color: black;">or <span style="color: red;">${meters.toFixed(Math.max(1, getDecimalPlaces(meters)))} m
            <br><span style="color: black;">or <span style="color: red;">${(meters / 1000).toFixed(Math.max(1, getDecimalPlaces(meters / 1000)))} km`;
            document.getElementById('metricResult').innerHTML = resultText;

            const conversionText = `${formatResult(feet, inches)} = ${meters.toFixed(Math.max(1, getDecimalPlaces(meters)))}m ${centimeters.toFixed(Math.max(1, getDecimalPlaces(centimeters)))}cm`;
            addToHistory(conversionText);
            }

            function getDecimalPlaces(number) {
                const stringNumber = number.toString();
                const decimalIndex = stringNumber.indexOf('.');
                if (decimalIndex === -1) {
                    return 0;
                }
                return Math.min(10, stringNumber.length - decimalIndex - 1);
            }

            function roundToNearestFraction(decimal, denominator) {
                return Math.round(decimal * denominator) / denominator;
            }

        function parseFeetAndInches(input) {
            const regex = /^(\d+)'?-?\s*(\d+\s+(\d+\/\d+)?"?|\d+\/\d+"?|(\d+\/\d+)"?)$/;
            const match = input.match(regex);
            
            if (!match) {
                throw new Error("Invalid input format");
            }
            
            let feet = parseInt(match[1]) || 0;
            let inches = 0;
            
            if (match[2]) {
                if (match[2].includes("/")) {
                    inches = parseFractionalInput(match[2]);
                } else {
                    inches = parseInt(match[2]);
                    if (match[3]) {
                        inches += parseFractionalInput(match[3]);
                    }
                }
            }
            
            return feet * 12 + inches;
        }

        function convertToDecimalFeet() {
            const feet = parseFloat(document.getElementById('feetToDec').value) || 0;
            const inches = parseFloat(document.getElementById('inchesToDec').value) || 0;
            const decimalFeet = feet + (inches / 12);
            const resultText = `<span style="color: black;">Result:<span style="color: red;">${decimalFeet.toFixed(2)} ft`;
            document.getElementById('decimal-feet-result').innerHTML = resultText;

            const conversionText = `${feet}'-${inches}" = ${decimalFeet.toFixed(2)} ft`;
            addToHistory(conversionText);
        }

        function calculateSlope() {
            const riseFeet = parseFloat(document.getElementById('slopeRiseFeet').value) || 0;
            const riseInches = parseFractionalInput(document.getElementById('slopeRiseInches').value);
            const runFeet = parseFloat(document.getElementById('slopeRunFeet').value) || 0;
            const runInches = parseFractionalInput(document.getElementById('slopeRunInches').value);
            const ADALandingLength = 60; ///Section 1012.6.3

            const totalRiseInches = (riseFeet * 12) + riseInches;
            const totalRunInches = (runFeet * 12) + runInches;
            
            let numberOfLandings = 0;
            // Check if slope is less than 20 before calculating landings
            if (totalRiseInches / ((runFeet * 12) + runInches) > 1/20.0) {
                numberOfLandings = Math.ceil(totalRunInches / (360) - 1); // 30 ft run / 30" of rise before landing is added
            }
           
            const totalRunInchesWithLandings = totalRunInches + (numberOfLandings * ADALandingLength);

            if (totalRiseInches <= 0 || totalRunInches <= 0) {
                document.getElementById('slopeResult').textContent = "Please enter valid positive numbers for rise and run.";
                return;
            }

            const slope = totalRiseInches / totalRunInches;
            const slopePercentage = slope * 100;
            const slopeAngle = Math.atan(slope) * (180 / Math.PI);
            const slopeRatio = 1 / slope;

            let railingsNeeded = "No";
            let adaCompliant = "Yes, ramp ratio is less than 1:12";
            if (slope > 1/20.0) {
                railingsNeeded = "Yes";
                if (slope > 1/12) {
                    adaCompliant = `No, ramp ratio (1:${slopeRatio.toFixed(2)}) exceeds 1:12. If not used as a means of egress ramp can be maximum 1:8 per <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1012.2' target='_blank'>Building Code Section 1012.2</a>.`;
                } else {
                    adaCompliant = `Yes, ramp ratio (1:${slopeRatio.toFixed(2)}) is between 1:12 and 1:20`;
                }
            } else {
                adaCompliant = `Yes, ramp ratio (1:${slopeRatio.toFixed(2)}) is less than or equal to 1:20`;
            }

            const maintain1on20 = totalRiseInches*20
            const maintain1on12 = totalRiseInches*12

            let maintain1on12withLandings = ((maintain1on12) + (Math.floor(maintain1on12 / 360) * ADALandingLength));
            if ((maintain1on12 / 360) <= 1) {
                maintain1on12withLandings = (maintain1on12);
            }

            let maintain1on12LandingNum = Math.floor(maintain1on12 / 360);
            if ((maintain1on12 / 360) <= 1){
                maintain1on12LandingNum = 0
            }

            document.getElementById('slopeResult').innerHTML = `
                <div class="fit-columns">
                    <div class="column-small"> 
                        <h3>Ramp Parameters</h3>
                        <br>                 
                        <span style="color: black;">Slope as a Percentage: <span style="color: red;">${slopePercentage.toFixed(1)}%
                        <br><span style="color: black;">Slope Angle: <span style="color: red;">${slopeAngle.toFixed(1)}°
                        <br><span style="color: black;">Number of Landings Required: <span style="color: red;">${numberOfLandings}
                        <br><span style="color: black;">Railings Needed?: <span style="color: red;">${railingsNeeded}
                        <br><span style="color: black;">ADA Compliant?: <span style="color: red;">${adaCompliant}
                        <br>
                        <br>Always double check calculations with the <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1005' target='_blank'>Building Code (2018) Section 1005</a>.
                    </div>
                    <div class="column-large">
                        <h3>Ideal Ramp Based Only On Rise</h3>
                        <br>                                             
                        <span style="color: black;">Run Required to maintain 1:20: <span style="color: red;">${formatFeetAndInches(maintain1on20)}
                        <br><span style="color: black;">Run Required to maintain 1:12: <span style="color: red;">${formatFeetAndInches(maintain1on12withLandings)} (includes ${maintain1on12LandingNum} landings)
                    </div>
                </div>
            `;
        }

        function calculateStairs() {
            const totalRiseFeet = parseFloat(document.getElementById('totalRiseFeet').value) || 0;
            const totalRiseInches = parseFractionalInput(document.getElementById('totalRiseInches').value) || 0;
            const runWidthFeet = parseFloat(document.getElementById('runWidthFeet').value) || 0;
            const runWidthInches = parseFractionalInput(document.getElementById('runWidthInches').value) || 0;
            const spaceBetweenRuns = parseFractionalInput(document.getElementById('spaceBetweenRuns').value) || 0;
            const noseToStringerAtLanding = parseFractionalInput(document.getElementById('noseToStringerAtLanding').value) || 0;
            const treadOffset = parseFractionalInput(document.getElementById('treadOffset').value) || 0;

            const totalRiseInInches = (totalRiseFeet * 12) + totalRiseInches;
            const runWidthInInches = (runWidthFeet * 12) + runWidthInches;

            const maxRiserHeight = 7;
            const treadDepth = 11;

            const numberOfSteps = Math.ceil(totalRiseInInches / maxRiserHeight);
            const actualRiserHeight = totalRiseInInches / numberOfSteps;

            const totalRun = numberOfSteps * treadDepth;
            const numberOfLandings = Math.floor(totalRiseInInches / (12 * 12)); // 12 feet vertically before landing is added
            const totalRunWithLandings = totalRun + (numberOfLandings * runWidthInInches);

            document.getElementById('stairResult').innerHTML = `
            <div class="fit-columns">  
                <div class="column-small">
                    <h3>Stair Parameters</h3>
                    <span style="color: black;">Number of Risers: <span style="color: red;">${numberOfSteps}
                    <br>
                    <br><span style="color: black;">Riser Height: <span style="color: red;">${actualRiserHeight.toFixed(3)}" or ${formatFractionalInches(actualRiserHeight)}
                    <br>
                    <br><span style="color: black;">Tread Depth: <span style="color: red;">11"
                    <br>
                    <h3>Occupancy Loads Acheived Per <a href="https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1005.3.1" target="_blank">Section 1005.3.1</a>:</h3>
                    <span style="color: black;">0.3"/person: <span style="color: red;">${(runWidthInInches / 0.3)} persons
                    <br><span style="color: black;">0.2"/person (Sprinklered): <span style="color: red;">${(runWidthInInches / 0.2)} persons
                </div>
                <div class="column-large">
                    <h3>Single Run Stair</h3>
                    <span style="color: black;">Single Run Stair Width (Egress Width):<span style="color: red;">${formatFeetAndInches(runWidthInInches)}
                    <br><span style="color: black;">Run Length Without Landings:<span style="color: red;">${formatFeetAndInches(totalRun)}
                    <br><span style="color: black;">Number of Landings Required:<span style="color: red;">${numberOfLandings} at ${formatFeetAndInches(runWidthInInches)} = ${formatFeetAndInches(numberOfLandings*runWidthInInches)}
                    <br><span style="color: black;">Run Length Including Landings:<span style="color: red;">${formatFeetAndInches(totalRunWithLandings)}
                    <br>${runWidthInInches < 48 && runWidthInInches >= 36 ? "<span style='color: red;'>Warning!: The stair width is less than 48\". Unless the building is sprinklered, the stair IS NOT accessible per <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1009.3.2' target='_blank'>Section 1009.3.2</a> Make sure at least one means of egress in the building is accessible.</span>" : ""}
                    <br>${runWidthInInches < 36 ? "<span style='color: red;'>Warning!: The stair width is less than 36\". per <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1009.3.2' target='_blank'>Section 1009.3.2</a> Make sure at least one means of egress in the building is accessible.</span>" : ""}
                </div>
                <div class="column-large tooltip">
                    <h3>Switchback Stair</h3>
                    <span style="color: black;">Switchback Stair Shaft Width (Includes 1/4" On Each Side For Constructability):<span style="color: red;">${formatFeetAndInches((runWidthInInches*2)+spaceBetweenRuns+0.5)}
                    <br><span style="color: black;">Number of Treads: <span style="color: red;">${Math.ceil(numberOfSteps/2)} plus ${Math.floor(numberOfSteps/2)}
                    <br><span style="color: black;">Switchback Stair Shaft Length:</span>                       
                    <span style="color: red;">${formatFeetAndInches(((runWidthInInches * 2)) + (noseToStringerAtLanding * 2) + (Math.ceil(numberOfSteps / 2) * 11))}
                        <br>
                        <span class="tooltiptext">Shaft Length is based on typical intermediate landing dtl. 2" of the stringer in that dtl counts as egress width in this calculation.</span> 
                </div>
            </div>   
            <br><span style="color: red;">Warnings!: 
                <br>- All Egress Widths are taken from outside of stringers, typ.
                <br>- Make sure if there are (2) stair towers, the narrowest stair width is minimally 50% of the overall egress width per <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1005.5' target='_blank'>Section 1005.5</a>.
                <br>${totalRiseInInches < 12 ? "- Per <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1003.5' target='_blank'>Section 1003.5</a>, for a change in elevation of less than 12\" a ramp must be used.</span>" : ""}
                <br>${spaceBetweenRuns < 4 ? '- Space Between Runs is less than 4" and will cause the stringer installation to be very difficult.' : ""}
                <br>- Always double check calculations with the <a href='https://up.codes/viewer/new_york/ibc-2018/chapter/10/means-of-egress#1005' target='_blank'>Building Code (2018) Section 1005</a>.
                    `;
        }

        function formatFeetAndInches(totalInches) {
            const feet = Math.floor(totalInches / 12);
            const inches = totalInches % 12;
            const fractionalInches = formatFractionalInches(inches);
            return `${feet}'-${fractionalInches}`;
        }

        function formatFractionalInches(inches) {
        const wholeNumber = Math.floor(inches);
        const fractionalPart = inches - wholeNumber;

        if (fractionalPart === 0) {
            return `${wholeNumber}"`;
        } else {
            const numerator = Math.round(fractionalPart * 256);
            return `${wholeNumber} ${numerator}/256"`;
        }
        }
        
        const gaugesToThickness = {
            stainless: {
                3: 0.2391, 4: 0.2242, 5: 0.2092, 6: 0.1943, 7: 0.1793, 8: 0.1644, 9: 0.1495, 10: 0.1345,
                11: 0.1196, 12: 0.1046, 13: 0.0897, 14: 0.0747, 15: 0.0673, 16: 0.0598, 17: 0.0538,
                18: 0.0478, 19: 0.0418, 20: 0.0359, 21: 0.0329, 22: 0.0299, 23: 0.0269, 24: 0.0239,
                25: 0.0209, 26: 0.0179, 27: 0.0164, 28: 0.0149, 29: 0.0135, 30: 0.0120
            },
            galvanized: {
                3: 0.2391, 4: 0.2242, 5: 0.2092, 6: 0.1943, 7: 0.1793, 8: 0.1644, 9: 0.1495, 10: 0.1345,
                11: 0.1196, 12: 0.1046, 13: 0.0897, 14: 0.0747, 15: 0.0673, 16: 0.0598, 17: 0.0538,
                18: 0.0478, 19: 0.0418, 20: 0.0359, 21: 0.0329, 22: 0.0299, 23: 0.0269, 24: 0.0239,
                25: 0.0209, 26: 0.0179, 27: 0.0164, 28: 0.0149, 29: 0.0135, 30: 0.0120
            },
            sheet: {
                3: 0.2391, 4: 0.2242, 5: 0.2092, 6: 0.1943, 7: 0.1793, 8: 0.1644, 9: 0.1495, 10: 0.1345,
                11: 0.1196, 12: 0.1046, 13: 0.0897, 14: 0.0747, 15: 0.0673, 16: 0.0598, 17: 0.0538,
                18: 0.0478, 19: 0.0418, 20: 0.0359, 21: 0.0329, 22: 0.0299, 23: 0.0269, 24: 0.0239,
                25: 0.0209, 26: 0.0179, 27: 0.0164, 28: 0.0149, 29: 0.0135, 30: 0.0120
            },
            aluminum: {
                3: 0.2294, 4: 0.2043, 5: 0.1819, 6: 0.1620, 7: 0.1443, 8: 0.1285, 9: 0.1144, 10: 0.1019,
                11: 0.0907, 12: 0.0808, 13: 0.0720, 14: 0.0641, 15: 0.0571, 16: 0.0508, 17: 0.0452,
                18: 0.0403, 19: 0.0359, 20: 0.0320, 21: 0.0285, 22: 0.0254, 23: 0.0226, 24: 0.0201,
                25: 0.0179, 26: 0.0159, 27: 0.0142, 28: 0.0126, 29: 0.0113, 30: 0.0100
            }};

            function convertGauge() {
            console.log('Calculate function called');
    
            const materialSelect = document.getElementById('material');
            const materialValue = materialSelect.value.trim();
            const gauge = parseInt(document.getElementById('mtlGauge').value);
    
            const materialLabels = {
                stainless: "Stainless Steel",
                galvanized: "Galvanized Steel",
                sheet: "Sheet Steel",
                aluminum: "Aluminum"
            };

            if (!materialValue) {
                const errorText = 'Material cannot be empty.';
                console.log('Error:', errorText);
                document.getElementById('gaugeResult').textContent = errorText;
                return;
            }

            if (isNaN(gauge) || gauge < 3 || gauge > 30) {
                const errorText = 'Invalid gauge number. Please enter a number between 3 and 30.';
                console.log('Error:', errorText);
                document.getElementById('gaugeResult').textContent = errorText;
                return;
            }

            // Get the display name for the selected material
            const materialLabel = materialLabels[materialValue] || materialValue;

            if (materialValue in gaugesToThickness && gauge >= 3 && gauge <= 30) {
            const thickness = gaugesToThickness[materialValue][gauge];
            const thicknessInches = thickness.toFixed(4);
            const thicknessMm = (thickness * 25.4).toFixed(2);
            const resultText = `${materialLabel} Gauge ${gauge} = <span class="red-result-text">${thicknessInches} inches (${thicknessMm} mm)</span>`;
            console.log('Result:', resultText);
            document.getElementById('gaugeResult').innerHTML = resultText;
        } else {
            const errorText = 'Invalid input. Please check the material and gauge number.';
            console.log('Error:', errorText);
            document.getElementById('gaugeResult').textContent = errorText;
        }
        }

        document.addEventListener('DOMContentLoaded', function() {
        const calculateBtn = document.getElementById('calculateBtn');
        const convertBtn = document.getElementById('convertBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        const convertToDecimalFeetBtn = document.getElementById('convertToDecimalFeetBtn');
        const calculateSlopeBtn = document.getElementById('calculateSlopeBtn');
        const convertGaugeBtn = document.getElementById('convertGaugeBtn');

        if (calculateBtn) calculateBtn.addEventListener('click', calculate);
        if (convertBtn) convertBtn.addEventListener('click', standardToMetric);
        if (convertToDecimalFeetBtn) convertToDecimalFeetBtn.addEventListener('click', convertToDecimalFeet);
        if (calculateSlopeBtn) calculateSlopeBtn.addEventListener('click', calculateSlope);
        if (convertGaugeBtn) convertGaugeBtn.addEventListener('click', convertGauge);
        if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

        // Add keydown event listeners for 'calculate' Function
        const calculatorInputs = ['feet1', 'inches1', 'feet2', 'inches2']; ///create new const for 'inputs' and list all input fields from the HTML by name
        calculatorInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        calculate();///call the function by name
                    }
                });
            }
        });

        // Add keydown event listeners for 'standardToMetric' Function
        const standardToMetricInputs = ['feetToConvert', 'inchesToConvert'];
        standardToMetricInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        standardToMetric();
                    }
                });
            }
        });

        // Add keydown event listeners for 'convertToDecimalFeet' Function
        const convertToDecimalFeetInputs = ['feetToDec', 'inchesToDec'];
        convertToDecimalFeetInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        convertToDecimalFeet();
                    }
                });
            }
        });
        
        // Add keydown event listeners for 'calculateSlope' Function
        const calculateSlopeInputs = ['slopeRiseFeet', 'slopeRiseInches', 'slopeRunFeet', 'slopeRunInches', 'rampWidthFeet', 'rampWidthInches'];
        calculateSlopeInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        calculateSlope();
                    }
                });
            }
        });

        // Add keydown event listeners for 'calculateStairs' Function
        const calculateStairsInputs = ['totalRiseFeet', 'totalRiseInches', 'runWidthFeet', 'runWidthInches', 'spaceBetweenRuns', 'noseToStringerAtLanding', 'treadOffset'];
        calculateStairsInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        calculateStairs();
                    }
                });
            }
        });

        // Add keydown event listeners for 'convertGauge' Function
        const convertGaugeInputs = ['material', 'mtlGauge'];
        convertGaugeInputs.forEach(id => {
            const inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        convertGauge();
                    }
                });
            }
        });
});