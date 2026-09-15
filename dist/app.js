const benchmark = {
  biohash: {
    title: 'BioHashing',
    summary: 'Best saved result: SVM at 95.27%',
    values: [['Random Forest', 94.60], ['SVM', 95.27], ['KNN', 93.47], ['XGBoost', 93.15]],
  },
  projection: {
    title: 'Random projection',
    summary: 'Best saved result: SVM at 94.92%',
    values: [['Random Forest', 94.32], ['SVM', 94.92], ['KNN', 93.93], ['XGBoost', 93.58]],
  },
  iom: {
    title: 'IoM hashing',
    summary: 'Best saved result: Random Forest at 75.11%',
    values: [['Random Forest', 75.11], ['SVM', 63.93], ['KNN', 61.63], ['XGBoost', 70.21]],
  },
};

const bars = document.querySelector('#bars');
const title = document.querySelector('#method-title');
const summary = document.querySelector('#method-summary');
const tabs = [...document.querySelectorAll('[data-method]')];

function render(method) {
  const result = benchmark[method];
  title.textContent = result.title;
  summary.textContent = result.summary;
  bars.replaceChildren(...result.values.map(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `<span class="bar-label">${label}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--value:${value}%"></div></div><span class="bar-value">${value.toFixed(2)}%</span>`;
    row.setAttribute('aria-label', `${label}: ${value.toFixed(2)} percent accuracy`);
    return row;
  }));
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  render(tab.dataset.method);
}));

render('biohash');
