// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(250, 254, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(17, 17, 17, 0.1)';
    } else {
        navbar.style.background = 'rgba(250, 254, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Money Flow Animation
class MoneyFlowAnimation {
    constructor() {
        this.isAnimating = false;
        this.animationSpeed = 2500; // 2.5 seconds per step
        this.personalNode = document.getElementById('personal-node');
        this.trustNode = document.getElementById('trust-node');
        this.companyNode = document.getElementById('company-node');
        this.familyNode = document.getElementById('family-node');
        this.personalAmount = document.getElementById('personal-amount');
        this.trustAmount = document.getElementById('trust-amount');
        this.companyAmount = document.getElementById('company-amount');
        this.familyAmount = document.getElementById('family-amount');
        this.startBtn = document.getElementById('start-animation');
        this.resetBtn = document.getElementById('reset-animation');
        
        this.initializeAnimation();
    }

    initializeAnimation() {
        this.startBtn.addEventListener('click', () => this.startFlow());
        this.resetBtn.addEventListener('click', () => this.resetFlow());
    }

    startFlow() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.startBtn.disabled = true;
        this.resetFlow();
        
        // Step 1: Personal loans to Trust
        setTimeout(() => {
            this.activateStep(1);
            this.animateTransfer(this.personalNode, this.trustNode);
            this.updateAmounts(50000, 50000, 0, 0);
        }, 500);
        
        // Step 2: Trust loans to Company
        setTimeout(() => {
            this.activateStep(2);
            this.animateTransfer(this.trustNode, this.companyNode);
            this.updateAmounts(50000, 0, 50000, 0);
        }, this.animationSpeed + 500);
        
        // Step 3: Company repays Trust with interest
        setTimeout(() => {
            this.activateStep(3);
            this.animateReturn(this.companyNode, this.trustNode);
            this.updateAmounts(50000, 55000, 0, 0);
        }, this.animationSpeed * 2 + 500);
        
        // Step 4: Trust distributes tax-free interest to family
        setTimeout(() => {
            this.activateStep(4);
            this.animateReturn(this.trustNode, this.familyNode);
            this.updateAmounts(50000, 50000, 0, 5000);
        }, this.animationSpeed * 3 + 500);
        
        // Step 5: Trust repays principal to personal
        setTimeout(() => {
            this.activateStep(5);
            this.animateReturn(this.trustNode, this.personalNode);
            this.updateAmounts(100000, 0, 0, 5000);
            this.isAnimating = false;
            this.startBtn.disabled = false;
        }, this.animationSpeed * 4 + 500);
    }

    animateTransfer(fromNode, toNode, amount, delay) {
        // Add active class to nodes
        fromNode.classList.add('active');
        setTimeout(() => {
            toNode.classList.add('active');
        }, 1000);
        
        // Animate arrows
        const arrows = document.querySelectorAll('.arrow-line');
        arrows.forEach(arrow => {
            arrow.classList.add('animated');
        });
        
        setTimeout(() => {
            arrows.forEach(arrow => {
                arrow.classList.remove('animated');
            });
        }, 2000);
    }

    animateReturn(fromNode, toNode) {
        fromNode.classList.add('active');
        setTimeout(() => {
            toNode.classList.add('active');
        }, 1000);
    }

    activateStep(stepNumber) {
        // Remove active class from all steps
        document.querySelectorAll('.step-item').forEach(step => {
            step.classList.remove('active');
        });
        
        // Add active class to current step
        const currentStep = document.getElementById(`step-${stepNumber}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    updateAmounts(personal, trust, company, family) {
        this.animateValueChange(this.personalAmount, personal);
        this.animateValueChange(this.trustAmount, trust);
        this.animateValueChange(this.companyAmount, company);
        this.animateValueChange(this.familyAmount, family);
    }

    animateValueChange(element, targetValue) {
        const currentValue = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
        const increment = (targetValue - currentValue) / 50;
        let current = currentValue;
        
        const updateValue = () => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || 
                (increment < 0 && current <= targetValue)) {
                current = targetValue;
                element.textContent = `$${current.toLocaleString()}`;
                return;
            }
            element.textContent = `$${Math.round(current).toLocaleString()}`;
            requestAnimationFrame(updateValue);
        };
        
        updateValue();
    }

    resetFlow() {
        // Remove active classes from nodes
        document.querySelectorAll('.flow-node').forEach(node => {
            node.classList.remove('active');
        });
        
        // Remove active classes from steps
        document.querySelectorAll('.step-item').forEach(step => {
            step.classList.remove('active');
        });
        
        // Reset amounts
        this.personalAmount.textContent = '$100,000';
        this.trustAmount.textContent = '$0';
        this.companyAmount.textContent = '$0';
        this.familyAmount.textContent = '$0';
        
        // Remove arrow animations
        document.querySelectorAll('.arrow-line').forEach(arrow => {
            arrow.classList.remove('animated');
        });
        
        this.isAnimating = false;
        this.startBtn.disabled = false;
    }
}

// Tax Calculator
class TaxCalculator {
    constructor() {
        this.resultsContainer = document.getElementById('calculator-results');
        this.salaryIncomeInput = document.getElementById('salary-income');
        this.propertyYesRadio = document.getElementById('property-yes');
        this.propertyNoRadio = document.getElementById('property-no');
        this.propertyInputsContainer = document.getElementById('property-inputs');
        this.propertyIncomeInput = document.getElementById('property-income');
        this.propertyDeductionsInput = document.getElementById('property-deductions');
        this.investmentAmountInput = document.getElementById('investment-amount');
        this.taxSummaryContainer = document.getElementById('tax-summary');
        
        // Australian Tax Brackets 2024-25 (Updated)
        this.auTaxBrackets = [
            { min: 0, max: 18200, rate: 0 },
            { min: 18201, max: 45000, rate: 0.16 },
            { min: 45001, max: 135000, rate: 0.30 },
            { min: 135001, max: 190000, rate: 0.37 },
            { min: 190001, max: Infinity, rate: 0.45 }
        ];

        this.medicareLevy = 0.02; // 2% Medicare levy
        this.companyTaxRate = 0.25; // Company tax rate for base rate entities
        
        // TheyBuild.io Fees
        this.theybuildSetupCost = 3500; // Setup cost for company + trust structure
        this.theybuildAnnualCost = 2400; // Annual accounting and compliance
        this.theybuildMonthlyCost = 200; // Monthly management fee
        this.totalAnnualTheybuildCost = this.theybuildAnnualCost + (this.theybuildMonthlyCost * 12);
        
        this.initializeCalculator();
    }

    initializeCalculator() {
        // Setup number formatting for all inputs
        this.setupNumberFormatting();
        
        // Property ownership toggle
        this.propertyYesRadio.addEventListener('change', () => this.togglePropertyInputs());
        this.propertyNoRadio.addEventListener('change', () => this.togglePropertyInputs());
        
        // Real-time calculation updates
        const allInputs = [
            this.salaryIncomeInput,
            this.propertyIncomeInput,
            this.propertyDeductionsInput,
            this.investmentAmountInput
        ];
        
        allInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.updateCalculations());
                input.addEventListener('change', () => this.updateCalculations());
            }
        });
        
        // Radio button changes
        [this.propertyYesRadio, this.propertyNoRadio].forEach(radio => {
            radio.addEventListener('change', () => this.updateCalculations());
        });
        
        // Calculate button for detailed view
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                if (this.resultsContainer.classList.contains('active')) {
                    this.resultsContainer.classList.remove('active');
                    calculateBtn.textContent = ' View Detailed Comparison';
                } else {
                    this.resultsContainer.classList.add('active');
                    calculateBtn.textContent = ' Hide Detailed Comparison';
                }
            });
        }

        // Initialize calculations
        setTimeout(() => this.updateCalculations(), 100);
    }

    togglePropertyInputs() {
        if (this.propertyYesRadio.checked) {
            this.propertyInputsContainer.style.display = 'block';
            this.propertyInputsContainer.classList.add('show');
        } else {
            this.propertyInputsContainer.style.display = 'none';
            this.propertyInputsContainer.classList.remove('show');
        }
        this.updateCalculations();
    }

    setupNumberFormatting() {
        const inputs = [
            this.salaryIncomeInput,
            this.propertyIncomeInput,
            this.propertyDeductionsInput,
            this.investmentAmountInput
        ];
        
        inputs.forEach(input => {
            if (input) {
                // Format number when user finishes typing (on blur)
                input.addEventListener('blur', (e) => {
                    let value = e.target.value.replace(/,/g, '');
                    if (!isNaN(value) && value !== '' && value !== '0') {
                        e.target.value = parseInt(value).toLocaleString();
                    }
                });
                
                // Remove formatting when user starts typing (on focus)
                input.addEventListener('focus', (e) => {
                    let value = e.target.value.replace(/,/g, '');
                    if (!isNaN(value) && value !== '') {
                        e.target.value = value;
                    }
                });
            }
        });
    }

    updateCalculations() {
        const salaryIncome = this.parseInput(this.salaryIncomeInput.value);
        const hasProperty = this.propertyYesRadio.checked;
        const propertyIncome = hasProperty ? this.parseInput(this.propertyIncomeInput.value) : 0;
        const propertyDeductions = hasProperty ? this.parseInput(this.propertyDeductionsInput.value) : 0;
        const investmentAmount = this.parseInput(this.investmentAmountInput.value);
        
        if (salaryIncome > 0) {
            const calculations = this.performCalculations(salaryIncome, propertyIncome, propertyDeductions, investmentAmount);
            this.updateTaxSummary(calculations);
            this.updateResults(calculations);
        } else {
            this.taxSummaryContainer.style.display = 'none';
            this.resultsContainer.classList.remove('active');
        }
    }

    parseInput(value) {
        return parseFloat((value || '').replace(/,/g, '')) || 0;
    }

    performCalculations(salaryIncome, propertyIncome, propertyDeductions, investmentAmount) {
        // Calculate total taxable income
        const netPropertyIncome = Math.max(0, propertyIncome - propertyDeductions);
        const totalTaxableIncome = salaryIncome + netPropertyIncome;
        
        // Traditional scenario calculations
        const traditional = this.calculateTraditionalScenario(totalTaxableIncome, investmentAmount);
        
        // TheyBuild scenario calculations
        const theybuild = this.calculateTheyBuildScenario(salaryIncome, netPropertyIncome, investmentAmount);
        
        return {
            salaryIncome,
            propertyIncome,
            propertyDeductions,
            netPropertyIncome,
            totalTaxableIncome,
            investmentAmount,
            traditional,
            theybuild,
            savings: traditional.totalTax - theybuild.totalTax,
            netBenefit: (traditional.afterTaxTotal + traditional.investmentAfterTax) - (theybuild.afterTaxTotal + theybuild.investmentAfterTax)
        };
    }

    calculateTraditionalScenario(totalTaxableIncome, investmentAmount) {
        const incomeTax = this.calculateAustralianTax(totalTaxableIncome);
        const medicareLevy = totalTaxableIncome * this.medicareLevy;
        const totalTax = incomeTax + medicareLevy;
        const afterTaxIncome = totalTaxableIncome - totalTax;
        
        // Investment returns (40% growth) taxed at marginal rate
        const investmentGrowth = investmentAmount * 0.40;
        const marginalRate = this.getPersonalMarginalTaxRate(totalTaxableIncome);
        const investmentTax = investmentGrowth * marginalRate;
        const investmentAfterTax = investmentGrowth - investmentTax;
        
        return {
            totalTaxableIncome,
            incomeTax,
            medicareLevy,
            totalTax,
            afterTaxIncome,
            afterTaxTotal: afterTaxIncome,
            investmentGrowth,
            investmentTax,
            investmentAfterTax,
            marginalRate
        };
    }

    calculateTheyBuildScenario(salaryIncome, netPropertyIncome, investmentAmount) {
        // Salary still taxed personally
        const salaryTax = this.calculateAustralianTax(salaryIncome);
        const salaryMedicareLevy = salaryIncome * this.medicareLevy;
        const salaryAfterTax = salaryIncome - salaryTax - salaryMedicareLevy;
        
        // Property income distributed optimally through trust (assume low-rate beneficiaries at 19%)
        const trustDistributionRate = 0.16; // Distributed to beneficiaries in 16% bracket
        const propertyTaxOptimized = netPropertyIncome * trustDistributionRate;
        const propertyAfterTax = netPropertyIncome - propertyTaxOptimized;
        
        // Investment returns (40% growth) through company structure (25% tax)
        const investmentGrowth = investmentAmount * 0.40;
        const companyTax = investmentGrowth * this.companyTaxRate;
        const investmentAfterTax = investmentGrowth - companyTax;
        
        // TheyBuild fees (tax deductible at company rate)
        const theybuildFeesAfterTax = this.totalAnnualTheybuildCost * (1 - this.companyTaxRate);
        
        const totalPersonalTax = salaryTax + salaryMedicareLevy + propertyTaxOptimized;
        const totalCompanyTax = companyTax;
        const totalTax = totalPersonalTax + totalCompanyTax + theybuildFeesAfterTax;
        
        const afterTaxTotal = salaryAfterTax + propertyAfterTax;
        
        return {
            salaryIncome,
            salaryTax,
            salaryMedicareLevy,
            salaryAfterTax,
            netPropertyIncome,
            propertyTaxOptimized,
            propertyAfterTax,
            investmentGrowth,
            companyTax,
            investmentAfterTax,
            theybuildFeesAfterTax,
            totalPersonalTax,
            totalCompanyTax,
            totalTax,
            afterTaxTotal
        };
    }

    calculateAustralianTax(income) {
        let tax = 0;
        for (const bracket of this.auTaxBrackets) {
            if (income > bracket.min) {
                const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min;
                tax += taxableInThisBracket * bracket.rate;
            }
        }
        return tax;
    }

    updateTaxSummary(calculations) {
        if (!calculations.totalTaxableIncome) {
            this.taxSummaryContainer.style.display = 'none';
            return;
        }

        this.taxSummaryContainer.style.display = 'block';
        
        const { traditional, theybuild, savings, netBenefit } = calculations;
        
        this.taxSummaryContainer.innerHTML = `
            <div class="summary-section">
                <div class="summary-title">Your Income Breakdown</div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Salary Income:</span>
                        <span class="summary-value">$${calculations.salaryIncome.toLocaleString()}</span>
                    </div>
                    ${calculations.netPropertyIncome > 0 ? `
                    <div class="summary-item">
                        <span class="summary-label">Net Property Income:</span>
                        <span class="summary-value">$${calculations.netPropertyIncome.toLocaleString()}</span>
                    </div>` : ''}
                    <div class="summary-item">
                        <span class="summary-label">Total Taxable Income:</span>
                        <span class="summary-value highlight">$${calculations.totalTaxableIncome.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Marginal Tax Rate:</span>
                        <span class="summary-value">${(traditional.marginalRate * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="summary-section">
                <div class="summary-title">Tax Comparison</div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Traditional Total Tax:</span>
                        <span class="summary-value">$${(traditional.totalTax + traditional.investmentTax).toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">TheyBuild Total Tax:</span>
                        <span class="summary-value">$${theybuild.totalTax.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Annual Tax Savings:</span>
                        <span class="summary-value highlight">$${Math.max(0, savings + traditional.investmentTax - theybuild.theybuildFeesAfterTax).toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">TheyBuild Fees (After Tax):</span>
                        <span class="summary-value">$${theybuild.theybuildFeesAfterTax.toLocaleString()}</span>
                    </div>
                                 </div>
             </div>
         `;

        // Show calculate button if there's investment amount
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn && calculations.investmentAmount > 0) {
            calculateBtn.style.display = 'block';
        }
    }

    updateResults(calculations) {
        if (!calculations.investmentAmount || calculations.investmentAmount === 0) {
            this.resultsContainer.classList.remove('active');
            return;
        }

        this.resultsContainer.classList.add('active');
        
        const { traditional, theybuild } = calculations;
        
        // Calculate multi-year scenarios for 40% growth
        const multiYear = this.calculateMultiYearScenarios(calculations);
        
        // Update chart with investment tax comparison
        this.updateChartProgressive(traditional.investmentTax, theybuild.companyTax);
        
        // Update display values
        document.getElementById('traditional-value').textContent = `$${traditional.investmentTax.toLocaleString()}`;
        document.getElementById('optimized-value').textContent = `$${theybuild.companyTax.toLocaleString()}`;
        document.getElementById('year-1-savings').textContent = `$${multiYear.year1Savings.toLocaleString()}`;
        document.getElementById('year-3-savings').textContent = `$${multiYear.year3Savings.toLocaleString()}`;
        document.getElementById('year-5-savings').textContent = `$${multiYear.year5Savings.toLocaleString()}`;
        document.getElementById('roi-improvement').textContent = `${multiYear.roiImprovement.toFixed(1)}%`;
        
        // Show better off popup
        setTimeout(() => {
            this.showBetterOffPopup(calculations, multiYear);
        }, 2000);
        
        // Animate results
        this.animateResults();
        
        // Set up show flow button
        const showFlowBtn = document.getElementById('show-flow-btn');
        if (showFlowBtn) {
            showFlowBtn.onclick = () => {
                this.scrollToProcess();
                this.updateProcessWithUserData(calculations);
            };
        }
    }

    calculateMultiYearScenarios(calculations) {
        const { investmentAmount, traditional, theybuild } = calculations;
        const growthRate = 0.40; // 40% annual growth
        
        const scenarios = {};
        
        [1, 3, 5].forEach(years => {
            let traditionalValue = investmentAmount;
            let theybuildValue = investmentAmount;
            let traditionalTotalTax = 0;
            let theybuildTotalTax = 0;
            
            for (let year = 1; year <= years; year++) {
                // Traditional: Growth taxed at personal marginal rate
                const traditionalGrowth = traditionalValue * growthRate;
                const traditionalTaxOnGrowth = traditionalGrowth * traditional.marginalRate;
                traditionalValue += traditionalGrowth - traditionalTaxOnGrowth;
                traditionalTotalTax += traditionalTaxOnGrowth;
                
                // TheyBuild: Growth taxed at company rate (25%)
                const theybuildGrowth = theybuildValue * growthRate;
                const theybuildTaxOnGrowth = theybuildGrowth * this.companyTaxRate;
                theybuildValue += theybuildGrowth - theybuildTaxOnGrowth;
                theybuildTotalTax += theybuildTaxOnGrowth;
            }
            
            scenarios[`year${years}`] = {
                traditionalTax: traditionalTotalTax,
                theybuildTax: theybuildTotalTax + (theybuild.theybuildFeesAfterTax * years),
                savings: traditionalTotalTax - (theybuildTotalTax + (theybuild.theybuildFeesAfterTax * years)),
                traditionalFinalValue: traditionalValue,
                theybuildFinalValue: theybuildValue
            };
        });
        
        const roiImprovement = ((scenarios.year5.theybuildFinalValue - scenarios.year5.traditionalFinalValue) / scenarios.year5.traditionalFinalValue) * 100;
        
        return {
            year1Savings: scenarios.year1.savings,
            year3Savings: scenarios.year3.savings,
            year5Savings: scenarios.year5.savings,
            roiImprovement: roiImprovement
        };
    }

    getPersonalMarginalTaxRate(income) {
        // Find the marginal tax rate for the given income
        for (const bracket of this.auTaxBrackets) {
            if (income >= bracket.min && income <= bracket.max) {
                return bracket.rate;
            }
        }
        return 0.45; // Highest rate if above all brackets
    }



    updateChartProgressive(traditionalTax, theybuildTax) {
        const maxValue = Math.max(traditionalTax, theybuildTax);
        const traditionalPercentage = (traditionalTax / maxValue) * 80; // Max 80% of container
        const theybuildPercentage = (theybuildTax / maxValue) * 80; // Max 80% of container
        
        const traditionalBar = document.getElementById('traditional-bar');
        const optimizedBar = document.getElementById('optimized-bar');
        
        // Reset bars
        traditionalBar.style.width = '0%';
        optimizedBar.style.width = '0%';
        
        // Show traditional tax (higher amount)
        setTimeout(() => {
            traditionalBar.style.width = `${traditionalPercentage}%`;
            traditionalBar.style.animation = 'shake 0.5s ease-in-out';
        }, 300);
        
        // Show Theybuild tax (lower amount)
        setTimeout(() => {
            optimizedBar.style.width = `${theybuildPercentage}%`;
            optimizedBar.style.animation = 'popIn 0.6s ease-out';
        }, 1000);
    }

    updateChart(traditionalLoss, theybuildGain) {
        // Fallback to progressive method
        this.updateChartProgressive(traditionalLoss, theybuildGain);
    }

    showBetterOffPopup(calculations, multiYear) {
        const popup = document.getElementById('better-off-popup');
        const amountElement = document.getElementById('better-off-amount');
        const percentageElement = document.getElementById('better-off-percentage');
        
        if (popup && amountElement && percentageElement) {
            const annualSavings = multiYear.year1Savings;
            const traditionalTax = calculations.traditional.investmentTax;
            const percentageImprovement = traditionalTax > 0 ? ((annualSavings / traditionalTax) * 100) : 0;
            
            amountElement.textContent = `$${Math.max(0, annualSavings).toLocaleString()}`;
            percentageElement.textContent = `${Math.max(0, percentageImprovement).toFixed(0)}% tax reduction`;
            
            popup.classList.add('show');
        }
    }

    scrollToProcess() {
        const processSection = document.getElementById('process');
        if (processSection) {
            processSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateProcessWithUserData(calculations) {
        // Store calculations for the process animation to use
        window.userCalculationResults = calculations;
        
        // Update the personal amount in the process section
        const personalAmount = document.getElementById('personal-amount');
        const investmentAmount = calculations.investmentAmount;
        
        if (personalAmount) {
            personalAmount.textContent = `$${investmentAmount.toLocaleString()}`;
        }
        
        // Trigger a visual indication that this is their personalized flow
        const processSection = document.querySelector('.process-section');
        if (processSection) {
            processSection.style.background = 'linear-gradient(135deg, rgba(199, 243, 255, 0.1) 0%, rgba(250, 254, 255, 1) 100%)';
            
            // Add a personalized message
            const subtitle = processSection.querySelector('.section-subtitle');
            if (subtitle) {
                const personalRate = (calculations.traditional.marginalRate * 100).toFixed(1);
                const totalSavings = Math.max(0, calculations.traditional.investmentTax - calculations.theybuild.companyTax);
                subtitle.innerHTML = `Watch your personalized money flow with $${investmentAmount.toLocaleString()} investment<br>
                <span style="font-size: 0.9em; color: var(--dark);">Personal tax rate: ${personalRate}% vs Company rate: 25% = $${totalSavings.toLocaleString()} investment tax savings</span>`;
                subtitle.style.color = 'var(--secondary-cyan)';
                subtitle.style.fontWeight = '600';
            }
        }
    }

    animateResults() {
        const items = document.querySelectorAll('.savings-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100 + 400);
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.benefit-card, .process-animation, .calculator-container');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    
    floatingCards.forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize Particles.js
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#c7f3ff', '#94e8ff', '#111111']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.3,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#94e8ff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Hero Animation Class
class HeroAnimation {
    constructor() {
        this.isAnimating = false;
        this.taxmanHero = document.getElementById('taxman-hero');
        this.personalHero = document.getElementById('personal-hero');
        this.companyHero = document.getElementById('company-hero');
        this.trustHero = document.getElementById('trust-hero');
        this.familyHero = document.getElementById('family-hero');
        
        this.playBtn = document.getElementById('hero-play-btn');
        this.resetBtn = document.getElementById('hero-reset-btn');
        
        this.initializeHeroAnimation();
    }

    initializeHeroAnimation() {
        this.playBtn.addEventListener('click', () => this.startHeroFlow());
        this.resetBtn.addEventListener('click', () => this.resetHeroFlow());
        
        // Auto-start animation after 2 seconds
        setTimeout(() => {
            this.startHeroFlow();
        }, 2000);
    }

    startHeroFlow() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.playBtn.disabled = true;
        this.resetHeroFlow();
        
        // Step 1: Show personal starting with $100K (minus what tax man will take)
        setTimeout(() => {
            this.showElement(this.personalHero);
            this.highlightNode(this.personalHero);
            this.updateAmount(this.personalHero, '$100K');
        }, 1000);
        
        // Step 2: Show tax man and takes 22.5K
        setTimeout(() => {
            this.showElement(this.taxmanHero);
            this.highlightNode(this.taxmanHero);
            this.updateAmount(this.taxmanHero, '$22.5K');
            this.updateAmount(this.personalHero, '$77.5K');
        }, 2500);
        
        // Step 3: Tax man reduced to 12.5K (Theybuild optimization)
        setTimeout(() => {
            this.updateAmount(this.taxmanHero, '$12.5K');
            this.updateAmount(this.personalHero, '$87.5K');
        }, 4000);
        
        // Step 4: Show company and gets 5K
        setTimeout(() => {
            this.showElement(this.companyHero);
            this.highlightNode(this.companyHero);
            this.updateAmount(this.companyHero, '$5K');
            this.updateAmount(this.personalHero, '$82.5K');
        }, 5500);
        
        // Step 5: Show trust and gets 5K
        setTimeout(() => {
            this.showElement(this.trustHero);
            this.highlightNode(this.trustHero);
            this.updateAmount(this.trustHero, '$5K');
            this.updateAmount(this.personalHero, '$77.5K');
        }, 7000);
        
        // Step 6: Show family and gets 5K
        setTimeout(() => {
            this.showElement(this.familyHero);
            this.highlightNode(this.familyHero);
            this.updateAmount(this.familyHero, '$5K');
            this.updateAmount(this.trustHero, '$0');
        }, 8500);
        
        // Step 7: Final personal amount
        setTimeout(() => {
            this.highlightNode(this.personalHero);
            this.updateAmount(this.personalHero, '$50K');
            this.isAnimating = false;
            this.playBtn.disabled = false;
        }, 10000);
    }

    showElement(node) {
        node.classList.add('visible');
    }

    highlightNode(node) {
        // Remove highlight from all nodes
        document.querySelectorAll('.hero-flow-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Add highlight to current node
        node.classList.add('highlighted');
    }

    updateAmount(node, amount) {
        const amountElement = node.querySelector('.hero-amount');
        if (amountElement) {
            amountElement.style.transform = 'scale(1.2)';
            amountElement.style.color = 'var(--secondary-cyan)';
            setTimeout(() => {
                amountElement.textContent = amount;
                amountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    resetHeroFlow() {
        // Remove highlights and hide all elements
        document.querySelectorAll('.hero-flow-item').forEach(item => {
            item.classList.remove('highlighted');
            item.classList.remove('visible');
        });
        
        // Reset amounts
        this.updateAmount(this.taxmanHero, '$0');
        this.updateAmount(this.personalHero, '$77.5K');
        this.updateAmount(this.companyHero, '$0');
        this.updateAmount(this.trustHero, '$0');
        this.updateAmount(this.familyHero, '$0');
        
        this.isAnimating = false;
        this.playBtn.disabled = false;
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles
    initParticles();
    
    new HeroAnimation();
    new MoneyFlowAnimation();
    new TaxCalculator();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    const cards = document.querySelectorAll('.benefit-card, .floating-card');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #94e8ff 0%, #c7f3ff 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out;
    `;
    
    const logo = document.createElement('div');
    logo.style.cssText = `
        font-size: 2rem;
        font-weight: 700;
        color: #111111;
        animation: pulse 1s ease-in-out infinite;
    `;
    logo.textContent = 'Theybuild.io';
    
    loadingScreen.appendChild(logo);
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loadingScreen);
        }, 500);
    }, 1000);
});

// Add typing animation to hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
});

// Add counter animation for stats
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, finalText, targetNumber, suffix = '', duration = 2000) => {
        const start = 0;
        const increment = targetNumber / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current >= targetNumber) {
                element.textContent = finalText;
                return;
            }
            
            if (finalText.includes('~$') && finalText.includes('M')) {
                element.textContent = `~$${(current / 1000).toFixed(1)}M`;
            } else if (finalText.includes('$') && finalText.includes('K')) {
                element.textContent = `$${Math.round(current)}K`;
            } else {
                element.textContent = `${Math.round(current)}+`;
            }
            
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    };
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent;
                
                if (target.includes('~$2.5M')) {
                    animateCounter(entry.target, '~$2.5M', 2500);
                } else if (target.includes('$120K')) {
                    animateCounter(entry.target, '$120K', 120);
                } else if (target.includes('20+')) {
                    animateCounter(entry.target, '20+', 20);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
});