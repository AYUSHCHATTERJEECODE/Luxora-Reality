/**
 * LUXORA REALTY - Refined Investment Parameter Checker
 * Institutional-grade advisory calculator with direct WhatsApp integration
 * Direct Desk: +91 85869 76911
 */

const NCR_MARKET_DATABASE = {
  gurgaon_gce: {
    name: "Gurgaon - Golf Course Ext. Rd",
    avgBasePrice: "₹19,000 - ₹25,500 / sq.ft",
    cagr3Yr: "17.4%",
    rentalYieldRes: "4.4%",
    rentalYieldComm: "7.9%",
    topDeveloper: "Oberoi Realty / DLF / M3M",
    flagshipMatch: "Three Sixty North by Oberoi & The Camellias Sector 58"
  },
  gurgaon_dxp: {
    name: "Gurgaon - Dwarka Expressway",
    avgBasePrice: "₹15,000 - ₹21,000 / sq.ft",
    cagr3Yr: "20.2%",
    rentalYieldRes: "4.0%",
    rentalYieldComm: "7.4%",
    topDeveloper: "Experion / Sobha / Godrej",
    flagshipMatch: "Experion Windchants & Prime Sector 103 Reserve"
  },
  noida_150_151: {
    name: "Noida - Sector 150 / 151 Expressway",
    avgBasePrice: "₹12,000 - ₹17,500 / sq.ft",
    cagr3Yr: "19.5%",
    rentalYieldRes: "4.6%",
    rentalYieldComm: "8.3%",
    topDeveloper: "Max Estates / Experion FDI",
    flagshipMatch: "Max Estate 105 & Experion Saatori (Sector 151)"
  },
  delhi_central_south: {
    name: "Delhi - Central / South Luxury Enclaves",
    avgBasePrice: "₹42,000 - ₹80,000 / sq.ft",
    cagr3Yr: "12.0%",
    rentalYieldRes: "3.2%",
    rentalYieldComm: "6.8%",
    topDeveloper: "Direct Builder Consortia & Institutional Alliances",
    flagshipMatch: "Vasant Vihar & Golf Links Super-Luxury Floor Plates"
  },
  greater_noida: {
    name: "Greater Noida & Yamuna Expressway",
    avgBasePrice: "₹8,000 - ₹12,500 / sq.ft",
    cagr3Yr: "23.0%",
    rentalYieldRes: "4.9%",
    rentalYieldComm: "8.8%",
    topDeveloper: "Reputed FDI & National Developers",
    flagshipMatch: "Jewar International Airport Corridor Prime Mixed-Use"
  }
};

class InvestmentParameterChecker {
  constructor() {
    this.currentBudget = 10;
    this.currentLocation = 'gurgaon_gce';
    this.currentAsset = 'residence';
    this.currentHorizon = '4_6_yr';
    this.currentTier = 'fdi_tier1';

    this.initElements();
    this.bindEvents();
    this.calculateProjections();
  }

  initElements() {
    this.budgetSlider = document.getElementById('param-budget-slider');
    this.budgetValueDisplay = document.getElementById('param-budget-val');

    this.folderTabs = document.querySelectorAll('.folder-tab-btn');
    this.folderPanes = document.querySelectorAll('.folder-pane');

    this.locationChips = document.querySelectorAll('[data-param="location"]');
    this.assetChips = document.querySelectorAll('[data-param="asset"]');
    this.horizonChips = document.querySelectorAll('[data-param="horizon"]');
    this.tierChips = document.querySelectorAll('[data-param="tier"]');

    this.outputCapitalAppr = document.getElementById('output-capital-appreciation');
    this.outputRentalYield = document.getElementById('output-rental-yield');
    this.outputAdvantage = document.getElementById('output-developer-advantage');
    this.outputProjectName = document.getElementById('output-project-name');
    this.outputProjectSub = document.getElementById('output-project-sub');
    this.outputProjectPrice = document.getElementById('output-project-price');
  }

  bindEvents() {
    if (this.budgetSlider) {
      this.budgetSlider.addEventListener('input', (e) => {
        this.currentBudget = parseFloat(e.target.value);
        if (this.budgetValueDisplay) {
          this.budgetValueDisplay.innerText = `₹${this.currentBudget} Cr`;
        }
        this.calculateProjections();
      });
    }

    this.folderTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        this.folderTabs.forEach(t => t.classList.remove('active'));
        this.folderPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    this.setupChipGroup(this.locationChips, (val) => {
      this.currentLocation = val;
      this.calculateProjections();
    });

    this.setupChipGroup(this.assetChips, (val) => {
      this.currentAsset = val;
      this.calculateProjections();
    });

    this.setupChipGroup(this.horizonChips, (val) => {
      this.currentHorizon = val;
      this.calculateProjections();
    });

    this.setupChipGroup(this.tierChips, (val) => {
      this.currentTier = val;
      this.calculateProjections();
    });

    const applyToConsultationBtn = document.getElementById('btn-apply-parameters');
    if (applyToConsultationBtn) {
      applyToConsultationBtn.addEventListener('click', () => {
        this.prefillConsultationForm();
      });
    }

    const whatsappBtn = document.getElementById('btn-whatsapp-parameters');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        this.launchWhatsAppWithParameters();
      });
    }
  }

  setupChipGroup(chips, callback) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-value');
        callback(val);
      });
    });
  }

  calculateProjections() {
    const market = NCR_MARKET_DATABASE[this.currentLocation] || NCR_MARKET_DATABASE['gurgaon_gce'];

    let baseAppreciation = 40;
    let baseYield = 4.4;

    if (this.currentLocation === 'gurgaon_dxp') {
      baseAppreciation += 15;
      baseYield = 4.0;
    } else if (this.currentLocation === 'noida_150_151') {
      baseAppreciation += 14;
      baseYield = 4.7;
    } else if (this.currentLocation === 'greater_noida') {
      baseAppreciation += 19;
      baseYield = 5.2;
    } else if (this.currentLocation === 'delhi_central_south') {
      baseAppreciation -= 6;
      baseYield = 3.3;
    }

    if (this.currentAsset === 'commercial') {
      baseYield += 3.5;
      baseAppreciation -= 5;
    } else if (this.currentAsset === 'prelaunch') {
      baseAppreciation += 16;
    } else if (this.currentAsset === 'penthouse') {
      baseAppreciation += 9;
    }

    let horizonMultiplier = 1.0;
    if (this.currentHorizon === '2_3_yr') {
      horizonMultiplier = 0.85;
    } else if (this.currentHorizon === '7_10_yr') {
      horizonMultiplier = 1.68;
    }

    const calculatedAppreciationMin = Math.round((baseAppreciation * 0.88) * horizonMultiplier);
    const calculatedAppreciationMax = Math.round((baseAppreciation * 1.28) * horizonMultiplier);
    const calculatedYield = baseYield.toFixed(1);

    if (this.outputCapitalAppr) {
      this.outputCapitalAppr.innerText = `+${calculatedAppreciationMin}% to +${calculatedAppreciationMax}%`;
    }
    if (this.outputRentalYield) {
      this.outputRentalYield.innerText = `${calculatedYield}% - ${(parseFloat(calculatedYield) + 1.5).toFixed(1)}% p.a.`;
    }

    let advantageMsg = "Direct developer allotment ensures zero secondary mark-ups, bespoke payment construction milestones (e.g. 25:25:50), and priority unit selection via Deepika Bhardwaj's developer relationships.";
    if (this.currentTier === 'fdi_tier1') {
      advantageMsg = "Tier-1 Listed / FDI Developer Assurance (Max Estates, Oberoi Realty, Experion). 100% RERA compliant, impeccable escrow governance, and superior delivery track record.";
    }
    if (this.outputAdvantage) {
      this.outputAdvantage.innerText = advantageMsg;
    }

    if (this.outputProjectName) this.outputProjectName.innerText = market.flagshipMatch;
    if (this.outputProjectSub) this.outputProjectSub.innerText = `${market.name} • Direct Developer Inventory`;
    if (this.outputProjectPrice) this.outputProjectPrice.innerText = `Allocation: ₹${this.currentBudget} Cr Allotment`;
  }

  prefillConsultationForm() {
    const market = NCR_MARKET_DATABASE[this.currentLocation] || NCR_MARKET_DATABASE['gurgaon_gce'];
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    const budgetInput = document.getElementById('form-budget');
    const locationInput = document.getElementById('form-location');
    const notesInput = document.getElementById('form-notes');

    if (budgetInput) budgetInput.value = `₹${this.currentBudget} Crores`;
    if (locationInput) locationInput.value = market.name;
    if (notesInput) {
      notesInput.value = `Interested in ${this.currentAsset.toUpperCase()} in ${market.name} with a ${this.currentHorizon.replace(/_/g, ' ')} horizon under Tier-1 / FDI developer inventory. Requesting Deepika Bhardwaj's direct consultation.`;
    }
  }

  launchWhatsAppWithParameters() {
    const market = NCR_MARKET_DATABASE[this.currentLocation] || NCR_MARKET_DATABASE['gurgaon_gce'];
    const msg = `Hello Deepika Ma'am (Luxora Realty), I am interested in exploring ${this.currentAsset.toUpperCase()} opportunities in ${market.name} with an allocation of ₹${this.currentBudget} Crores. Could you please share the curated developer-direct dossier?`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918586976911?text=${encoded}`, '_blank');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.luxoraChecker = new InvestmentParameterChecker();
});
