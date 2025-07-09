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
        this.animationSpeed = 2000; // 2 seconds per step
        this.personalNode = document.getElementById('personal-node');
        this.companyNode = document.getElementById('company-node');
        this.trustNode = document.getElementById('trust-node');
        this.personalAmount = document.getElementById('personal-amount');
        this.companyAmount = document.getElementById('company-amount');
        this.trustAmount = document.getElementById('trust-amount');
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
        
        // Step 1: Personal to Company (Loan)
        setTimeout(() => {
            this.animateTransfer(this.personalNode, this.companyNode, 100000, 0);
            this.updateAmounts(50000, 50000, 0);
        }, 500);
        
        // Step 2: Company to Trust (Investment)
        setTimeout(() => {
            this.animateTransfer(this.companyNode, this.trustNode, 50000, 0);
            this.updateAmounts(50000, 0, 50000);
        }, this.animationSpeed + 500);
        
        // Step 3: Trust back to Company (Interest to Family)
        setTimeout(() => {
            this.animateReturn(this.trustNode, this.companyNode);
            this.updateAmounts(50000, 8000, 42000);
        }, this.animationSpeed * 2 + 500);
        
        // Step 4: Company back to Personal (Principal + Interest)
        setTimeout(() => {
            this.animateReturn(this.companyNode, this.personalNode);
            this.updateAmounts(108000, 0, 42000);
            this.isAnimating = false;
            this.startBtn.disabled = false;
        }, this.animationSpeed * 3 + 500);
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

    updateAmounts(personal, company, trust) {
        this.animateValueChange(this.personalAmount, personal);
        this.animateValueChange(this.companyAmount, company);
        this.animateValueChange(this.trustAmount, trust);
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
        // Remove active classes
        document.querySelectorAll('.flow-node').forEach(node => {
            node.classList.remove('active');
        });
        
        // Reset amounts
        this.personalAmount.textContent = '$100,000';
        this.companyAmount.textContent = '$0';
        this.trustAmount.textContent = '$0';
        
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
        
        this.taxRates = {
            au: { personal: 0.37, company: 0.25, trusts: 0.15 },
            us: { personal: 0.35, company: 0.21, trusts: 0.18 },
            uk: { personal: 0.40, company: 0.19, trusts: 0.20 },
            ca: { personal: 0.33, company: 0.26, trusts: 0.16 }
        };
        
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

    calculateSavings() {
        const annualIncome = parseFloat(this.annualIncomeInput.value) || 0;
        const investmentAmount = parseFloat(this.investmentAmountInput.value) || 0;
        const location = this.locationSelect.value;
        
        if (annualIncome === 0 || investmentAmount === 0) {
            alert('Please enter valid income and investment amounts');
            return;
        }
        
        const rates = this.taxRates[location];
        
        // Traditional setup calculation
        const traditionalTax = investmentAmount * rates.personal;
        const traditionalAfterTax = investmentAmount - traditionalTax;
        
        // Optimized setup calculation (with trust and company structure)
        const companyTax = investmentAmount * rates.company;
        const trustTax = (investmentAmount - companyTax) * rates.trusts;
        const optimizedTax = companyTax + trustTax;
        const optimizedAfterTax = investmentAmount - optimizedTax;
        
        // Savings calculation
        const annualSavings = traditionalTax - optimizedTax;
        const decadeSavings = annualSavings * 10;
        const roiImprovement = ((optimizedAfterTax - traditionalAfterTax) / traditionalAfterTax) * 100;
        
        this.displayResults({
            traditionalTax,
            optimizedTax,
            traditionalAfterTax,
            optimizedAfterTax,
            annualSavings,
            decadeSavings,
            roiImprovement
        });
    }

    displayResults(results) {
        // Show results container
        this.resultsContainer.classList.add('active');
        
        // Update chart bars
        this.updateChart(results.traditionalTax, results.optimizedTax);
        
        // Update values
        document.getElementById('traditional-value').textContent = `$${results.traditionalTax.toLocaleString()}`;
        document.getElementById('optimized-value').textContent = `$${results.optimizedTax.toLocaleString()}`;
        document.getElementById('annual-savings').textContent = `$${results.annualSavings.toLocaleString()}`;
        document.getElementById('decade-savings').textContent = `$${results.decadeSavings.toLocaleString()}`;
        document.getElementById('roi-improvement').textContent = `${results.roiImprovement.toFixed(1)}%`;
        
        // Animate the results
        this.animateResults();
    }

    updateChart(traditionalTax, optimizedTax) {
        const maxValue = Math.max(traditionalTax, optimizedTax);
        const traditionalPercentage = (traditionalTax / maxValue) * 100;
        const optimizedPercentage = (optimizedTax / maxValue) * 100;
        
        const traditionalBar = document.getElementById('traditional-bar');
        const optimizedBar = document.getElementById('optimized-bar');
        
        // Animate bars
        setTimeout(() => {
            traditionalBar.style.width = `${traditionalPercentage}%`;
        }, 200);
        
        setTimeout(() => {
            optimizedBar.style.width = `${optimizedPercentage}%`;
        }, 600);
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

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
});