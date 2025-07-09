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
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsContainer = document.getElementById('calculator-results');
        this.annualIncomeInput = document.getElementById('annual-income');
        this.locationSelect = document.getElementById('location');
        this.investmentAmountInput = document.getElementById('investment-amount');
        
        // Australian Tax Brackets 2024
        this.auTaxBrackets = [
            { min: 0, max: 18200, rate: 0 },
            { min: 18201, max: 45000, rate: 0.19 },
            { min: 45001, max: 120000, rate: 0.325 },
            { min: 120001, max: 180000, rate: 0.37 },
            { min: 180001, max: Infinity, rate: 0.45 }
        ];

        this.companyTaxRate = 0.25; // Australian company tax rate
        this.theybuildSetupCost = 650;
        this.theybuildMonthlyCost = 20;
        this.annualTheybuildCost = this.theybuildSetupCost + (this.theybuildMonthlyCost * 12);
        
        this.initializeCalculator();
    }

    initializeCalculator() {
        this.calculateBtn.addEventListener('click', () => this.calculateSavings());
        
        // Auto-calculate when inputs change
        [this.annualIncomeInput, this.locationSelect, this.investmentAmountInput].forEach(input => {
            input.addEventListener('change', () => {
                if (this.annualIncomeInput.value && this.investmentAmountInput.value) {
                    this.calculateSavings();
                }
            });
        });
    }

    calculateAustralianTax(income) {
        let tax = 0;
        for (const bracket of this.auTaxBrackets) {
            if (income > bracket.min) {
                const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min + 1;
                tax += taxableInThisBracket * bracket.rate;
            }
        }
        return tax;
    }

    calculateSavings() {
        const annualIncome = parseFloat(this.annualIncomeInput.value) || 0;
        const investmentAmount = parseFloat(this.investmentAmountInput.value) || 0;
        
        if (annualIncome === 0 || investmentAmount === 0) {
            alert('Please enter valid income and investment amounts');
            return;
        }
        
        // Calculate multi-year scenarios
        const results = this.calculateMultiYearScenarios(annualIncome, investmentAmount);
        
        this.displayResults(results);
    }

    calculateMultiYearScenarios(annualIncome, investmentAmount) {
        const growthRate = 0.20; // 20% annual growth
        const netTheybuildCost = this.annualTheybuildCost - (this.annualTheybuildCost * this.companyTaxRate);
        
        // Calculate for 1, 3, and 5 years
        const scenarios = {};
        
        [1, 3, 5].forEach(years => {
            let traditionalTotal = 0;
            let theybuildTotal = 0;
            let currentInvestment = investmentAmount;
            
            for (let year = 1; year <= years; year++) {
                // Traditional scenario: 20% growth taxed at personal rate
                const traditionalGrowth = currentInvestment * growthRate;
                const traditionalTaxOnGrowth = this.calculateAustralianTax(annualIncome + traditionalGrowth) - this.calculateAustralianTax(annualIncome);
                const traditionalAfterTax = traditionalGrowth - traditionalTaxOnGrowth;
                traditionalTotal += traditionalAfterTax;
                
                // Theybuild scenario: 20% growth taxed at company rate (25%)
                const theybuildGrowth = currentInvestment * growthRate;
                const theybuildTaxOnGrowth = theybuildGrowth * this.companyTaxRate;
                const theybuildAfterTax = theybuildGrowth - theybuildTaxOnGrowth - netTheybuildCost;
                theybuildTotal += theybuildAfterTax;
                
                // Compound the investment for next year
                currentInvestment += theybuildAfterTax;
            }
            
            scenarios[`year${years}`] = {
                traditionalTotal: traditionalTotal,
                theybuildTotal: theybuildTotal,
                savings: theybuildTotal - traditionalTotal
            };
        });
        
        // Calculate basic values for chart display
        const year1Traditional = scenarios.year1.traditionalTotal - scenarios.year1.theybuildTotal;
        const year1Theybuild = scenarios.year1.savings;
        const roiImprovement = ((scenarios.year5.theybuildTotal - scenarios.year5.traditionalTotal) / scenarios.year5.traditionalTotal) * 100;
        
        return {
            traditionalTax: Math.abs(year1Traditional),
            optimizedTax: 0,
            annualSavings: year1Theybuild,
            year1Savings: scenarios.year1.savings,
            year3Savings: scenarios.year3.savings,
            year5Savings: scenarios.year5.savings,
            roiImprovement: roiImprovement,
            netTheybuildCost: netTheybuildCost
        };
    }

    displayResults(results) {
        // Show results container
        this.resultsContainer.classList.add('active');
        
        // Progressive chart loading - first show loss, then gain
        this.updateChartProgressive(results.traditionalTax, results.annualSavings);
        
        // Update values
        document.getElementById('traditional-value').textContent = `-$${results.traditionalTax.toLocaleString()}`;
        document.getElementById('optimized-value').textContent = `+$${Math.abs(results.annualSavings).toLocaleString()}`;
        document.getElementById('year-1-savings').textContent = `$${results.year1Savings.toLocaleString()}`;
        document.getElementById('year-3-savings').textContent = `$${results.year3Savings.toLocaleString()}`;
        document.getElementById('year-5-savings').textContent = `$${results.year5Savings.toLocaleString()}`;
        document.getElementById('roi-improvement').textContent = `${results.roiImprovement.toFixed(1)}%`;
        
        // Show better off popup after chart animation
        setTimeout(() => {
            this.showBetterOffPopup(results);
        }, 2000);
        
        // Animate the results
        this.animateResults();
        
        // Set up show flow button
        const showFlowBtn = document.getElementById('show-flow-btn');
        if (showFlowBtn) {
            showFlowBtn.onclick = () => {
                this.scrollToProcess();
                this.updateProcessWithUserData(results);
            };
        }
    }

    updateChartProgressive(traditionalLoss, theybuildGain) {
        const maxValue = Math.max(Math.abs(traditionalLoss), Math.abs(theybuildGain));
        const traditionalPercentage = (Math.abs(traditionalLoss) / maxValue) * 45; // Max 45% of container
        const theybuildPercentage = (Math.abs(theybuildGain) / maxValue) * 45; // Max 45% of container
        
        const traditionalBar = document.getElementById('traditional-bar');
        const optimizedBar = document.getElementById('optimized-bar');
        
        // Reset bars
        traditionalBar.style.width = '0%';
        optimizedBar.style.width = '0%';
        
        // First show traditional loss with dramatic effect
        setTimeout(() => {
            traditionalBar.style.width = `${traditionalPercentage}%`;
            traditionalBar.style.animation = 'shake 0.5s ease-in-out';
        }, 300);
        
        // Then show Theybuild gain with positive effect
        setTimeout(() => {
            optimizedBar.style.width = `${theybuildPercentage}%`;
            optimizedBar.style.animation = 'popIn 0.6s ease-out';
        }, 1000);
    }

    updateChart(traditionalLoss, theybuildGain) {
        // Fallback to progressive method
        this.updateChartProgressive(traditionalLoss, theybuildGain);
    }

    showBetterOffPopup(results) {
        const popup = document.getElementById('better-off-popup');
        const amountElement = document.getElementById('better-off-amount');
        const percentageElement = document.getElementById('better-off-percentage');
        
        if (popup && amountElement && percentageElement) {
            const totalBenefit = Math.abs(results.traditionalTax) + Math.abs(results.annualSavings);
            const percentageImprovement = ((Math.abs(results.annualSavings) / Math.abs(results.traditionalTax)) * 100);
            
            amountElement.textContent = `$${totalBenefit.toLocaleString()}`;
            percentageElement.textContent = `${percentageImprovement.toFixed(0)}% improvement`;
            
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

    updateProcessWithUserData(results) {
        // Store results for the process animation to use
        window.userCalculationResults = results;
        
        // Update the personal amount in the process section
        const personalAmount = document.getElementById('personal-amount');
        const investmentAmount = parseFloat(document.getElementById('investment-amount').value) || 100000;
        
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
                subtitle.innerHTML = `Watch your personalized money flow with $${investmentAmount.toLocaleString()} investment and $${Math.abs(results.annualSavings).toLocaleString()} annual savings`;
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
        this.startHero = document.getElementById('start-hero');
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
        
        // Step 1: Show start tile with 100K
        setTimeout(() => {
            this.showElement(this.startHero);
            this.highlightNode(this.startHero);
        }, 1000);
        
        // Step 2: Show tax man and takes 22.5K
        setTimeout(() => {
            this.showElement(this.taxmanHero);
            this.highlightNode(this.taxmanHero);
            this.updateAmount(this.taxmanHero, '$22.5K');
            this.updateAmount(this.startHero, '$77.5K');
        }, 2500);
        
        // Step 3: Tax man reduced to 12.5K (Theybuild optimization)
        setTimeout(() => {
            this.updateAmount(this.taxmanHero, '$12.5K');
            this.updateAmount(this.startHero, '$87.5K');
        }, 4000);
        
        // Step 4: Show company and gets 5K
        setTimeout(() => {
            this.showElement(this.companyHero);
            this.highlightNode(this.companyHero);
            this.updateAmount(this.companyHero, '$5K');
            this.updateAmount(this.startHero, '$82.5K');
        }, 5500);
        
        // Step 5: Show trust and gets 5K
        setTimeout(() => {
            this.showElement(this.trustHero);
            this.highlightNode(this.trustHero);
            this.updateAmount(this.trustHero, '$5K');
            this.updateAmount(this.startHero, '$77.5K');
        }, 7000);
        
        // Step 6: Show family and gets 5K
        setTimeout(() => {
            this.showElement(this.familyHero);
            this.highlightNode(this.familyHero);
            this.updateAmount(this.familyHero, '$5K');
            this.updateAmount(this.trustHero, '$0');
        }, 8500);
        
        // Step 7: Show personal and gets remaining 50K
        setTimeout(() => {
            this.showElement(this.personalHero);
            this.highlightNode(this.personalHero);
            this.updateAmount(this.personalHero, '$50K');
            this.updateAmount(this.startHero, '$27.5K');
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
        this.updateAmount(this.startHero, '$100K');
        this.updateAmount(this.taxmanHero, '$0');
        this.updateAmount(this.personalHero, '$0');
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
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target.includes('%') ? target : target;
                return;
            }
            
            if (target.includes('$')) {
                element.textContent = `$${Math.round(current * 1000) / 1000}M+`;
            } else if (target.includes('%')) {
                element.textContent = `${Math.round(current)}%`;
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
                    animateCounter(entry.target, '~$2.5M');
                } else if (target.includes('$120K')) {
                    animateCounter(entry.target, '$120K');
                } else if (target.includes('20+')) {
                    animateCounter(entry.target, '20+');
                } else {
                    animateCounter(entry.target, target);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
});