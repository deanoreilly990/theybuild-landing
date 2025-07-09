// Wealth Builder Platform v0.2 - Main JavaScript

jQuery(document).ready(function() {
    // Initialize animations on page load
    initializeAnimations();
    
    // Add smooth scrolling for navigation
    initializeSmoothScrolling();
    
    // Initialize counter animations for stats
    animateCounters();
    
    // Add form validation
    initializeFormValidation();
});

// Animation initialization
function initializeAnimations() {
    // Reset all animation states
    resetAnimation();
    
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeInUp');
                }
            });
        });
        
        document.querySelectorAll('.stat-card, .flow-step, .calculator-card').forEach(function(el) {
            observer.observe(el);
        });
    }
}

// Smooth scrolling functions
function initializeSmoothScrolling() {
    window.scrollToCalculator = function() {
        document.getElementById('taxCalculator').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };
    
    window.scrollToMoneyFlow = function() {
        document.getElementById('moneyFlow').scrollIntoView({ 
            behavior: 'smooth' 
        });
    };
}

// Counter animations for stats
function animateCounters() {
    function animateValue(element, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.innerHTML = current + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animate stats when page loads
    setTimeout(() => {
        animateValue(document.getElementById('capitalStat'), 0, 400, 2000, 'K');
        animateValue(document.getElementById('savingsStat'), 0, 150, 2000, 'K');
        animateValue(document.getElementById('clientsStat'), 0, 25, 2000, '');
    }, 1000);
}

// Money Flow Animation Functions
window.startMoneyFlowAnimation = function() {
    resetAnimation();
    
    const steps = [
        { id: 'step1', desc: 'stepDesc1', delay: 0 },
        { id: 'arrow1', desc: null, delay: 1000 },
        { id: 'step2', desc: 'stepDesc2', delay: 2000 },
        { id: 'arrow2', desc: null, delay: 3000 },
        { id: 'step3', desc: 'stepDesc3', delay: 4000 },
        { id: 'returnArrow1', desc: 'stepDesc4', delay: 5000 },
        { id: 'returnArrow2', desc: 'stepDesc5', delay: 6000 },
        { id: 'familyWealth', desc: null, delay: 7000 }
    ];
    
    steps.forEach(step => {
        setTimeout(() => {
            activateStep(step.id);
            if (step.desc) {
                activateDescription(step.desc);
            }
            
            // Add money animation for arrows
            if (step.id.includes('arrow')) {
                animateMoneyFlow(step.id);
            }
        }, step.delay);
    });
};

window.resetAnimation = function() {
    // Reset all steps
    document.querySelectorAll('.flow-step, .flow-arrow, .return-arrow, .family-wealth').forEach(el => {
        el.classList.remove('active');
    });
    
    // Reset all descriptions
    document.querySelectorAll('.step-description').forEach(el => {
        el.classList.remove('active');
    });
    
    // Reset money animations
    document.querySelectorAll('.money-animation').forEach(el => {
        el.classList.remove('moving');
    });
};

function activateStep(stepId) {
    const element = document.getElementById(stepId);
    if (element) {
        element.classList.add('active');
        element.classList.add('pulse');
        
        // Remove pulse after animation
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 1000);
    }
}

function activateDescription(descId) {
    // Deactivate all descriptions first
    document.querySelectorAll('.step-description').forEach(el => {
        el.classList.remove('active');
    });
    
    // Activate current description
    const element = document.getElementById(descId);
    if (element) {
        element.classList.add('active');
    }
}

function animateMoneyFlow(arrowId) {
    const arrow = document.getElementById(arrowId);
    if (arrow) {
        const moneyElement = arrow.querySelector('.money-animation');
        if (moneyElement) {
            moneyElement.classList.add('moving');
            
            // Remove animation class after completion
            setTimeout(() => {
                moneyElement.classList.remove('moving');
            }, 2000);
        }
    }
}

// Australian Tax Calculator Functions
window.calculateTaxSavings = function() {
    const income = parseFloat(document.getElementById('annualIncome').value) || 0;
    const investment = parseFloat(document.getElementById('investmentAmount').value) || 0;
    const returnRate = parseFloat(document.getElementById('expectedReturn').value) || 0;
    const years = parseInt(document.getElementById('timeHorizon').value) || 1;
    
    if (income === 0 || investment === 0 || returnRate === 0) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Australian tax brackets 2024
    const taxBrackets = [
        { min: 0, max: 18200, rate: 0 },
        { min: 18201, max: 45000, rate: 0.19 },
        { min: 45001, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: Infinity, rate: 0.45 }
    ];
    
    // Calculate personal tax rate
    let personalTaxRate = 0;
    for (let bracket of taxBrackets) {
        if (income >= bracket.min && income <= bracket.max) {
            personalTaxRate = bracket.rate;
            break;
        }
    }
    
    // Company tax rate in Australia
    const companyTaxRate = 0.25; // 25%
    
    // Calculate annual returns
    const annualReturn = investment * (returnRate / 100);
    
    // Traditional investment tax (personal rate on returns)
    const traditionalAnnualTax = annualReturn * personalTaxRate;
    const traditionalTotalTax = traditionalAnnualTax * years;
    
    // Structure tax (company rate on returns)
    const structureAnnualTax = annualReturn * companyTaxRate;
    const structureTotalTax = structureAnnualTax * years;
    
    // Total savings
    const totalSavings = traditionalTotalTax - structureTotalTax;
    const savingsPercentage = ((totalSavings / traditionalTotalTax) * 100).toFixed(1);
    
    // Setup and ongoing costs
    const setupCost = 650;
    const monthlyCost = 20;
    const annualSubscription = monthlyCost * 12;
    const totalSubscriptionCosts = annualSubscription * years;
    
    // Tax deduction savings (costs are deductible)
    const totalDeductibleCosts = setupCost + totalSubscriptionCosts;
    const deductionSavings = totalDeductibleCosts * personalTaxRate;
    
    // Net savings after costs
    const netSavings = totalSavings + deductionSavings - setupCost - totalSubscriptionCosts;
    
    // Display results
    document.getElementById('traditionalTax').textContent = '$' + formatNumber(traditionalTotalTax);
    document.getElementById('structureTax').textContent = '$' + formatNumber(structureTotalTax + setupCost + totalSubscriptionCosts);
    document.getElementById('totalSavings').textContent = '$' + formatNumber(Math.max(0, netSavings));
    document.getElementById('savingsPercentage').textContent = savingsPercentage + '% saved';
    document.getElementById('deductionSavings').textContent = '$' + formatNumber(deductionSavings);
    
    // Show results
    document.getElementById('calculatorResults').style.display = 'block';
    
    // Animate the results
    animateResults();
};

function formatNumber(num) {
    return Math.round(num).toLocaleString();
}

function animateResults() {
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate__fadeInUp');
            card.style.animationDelay = `${index * 0.2}s`;
        }, 100);
    });
}

// Form validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('#taxCalculatorForm input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    
    if (input.id === 'annualIncome' && value < 0) {
        input.setCustomValidity('Income must be positive');
    } else if (input.id === 'investmentAmount' && value <= 0) {
        input.setCustomValidity('Investment amount must be positive');
    } else if (input.id === 'expectedReturn' && (value < 0 || value > 100)) {
        input.setCustomValidity('Return rate must be between 0 and 100%');
    } else if (input.id === 'timeHorizon' && (value < 1 || value > 30)) {
        input.setCustomValidity('Investment period must be between 1 and 30 years');
    } else {
        input.setCustomValidity('');
    }
}

// Auto-start demo animation when money flow section comes into view
function initializeAutoAnimation() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('animation-started')) {
                    entry.target.classList.add('animation-started');
                    setTimeout(() => {
                        startMoneyFlowAnimation();
                    }, 1000);
                }
            });
        }, { threshold: 0.5 });
        
        const moneyFlowSection = document.getElementById('moneyFlow');
        if (moneyFlowSection) {
            observer.observe(moneyFlowSection);
        }
    }
}

// Initialize auto animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoAnimation();
});

// Utility function for number animations with easing
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Enhanced counter animation with easing
function animateValueWithEasing(element, start, end, duration, suffix = '', prefix = '') {
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        const current = Math.floor(easedProgress * (end - start) + start);
        
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Add loading states
function showLoadingState() {
    document.getElementById('calculatorResults').style.display = 'none';
    document.querySelector('.btn[onclick="calculateTaxSavings()"]').innerHTML = 
        '<i class="fa fa-spinner fa-spin"></i> Calculating...';
}

function hideLoadingState() {
    document.querySelector('.btn[onclick="calculateTaxSavings()"]').innerHTML = 
        'Calculate Savings';
}

// Update calculate function to include loading states
const originalCalculate = window.calculateTaxSavings;
window.calculateTaxSavings = function() {
    showLoadingState();
    setTimeout(() => {
        originalCalculate();
        hideLoadingState();
    }, 500);
};
