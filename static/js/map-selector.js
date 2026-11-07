(() => {
  'use strict';
  const form = document.getElementById('map-form');
  const picker = document.getElementById('state-picker');
  const search = document.getElementById('state-search');
  const error = document.getElementById('selection-error');
  const regions = [...form.querySelectorAll('[name="region"]')];
  const views = [...form.querySelectorAll('[name="view_type"]')];
  const params = new URLSearchParams(location.search);
  const requested = views.find(input => input.value === params.get('view_type'));
  if (requested) requested.checked = true;
  if (params.get('mode') === 'select') form.querySelector('[name="mode"][value="select"]').checked = true;
  const restored = new Set(params.getAll('region'));
  regions.forEach(input => { input.checked = restored.has(input.value); });
  const selected = () => regions.filter(input => input.checked);
  function update() {
    const currentView = views.find(input => input.checked);
    document.getElementById('open-map-label').textContent = `Open ${currentView.dataset.title.toLowerCase()}`;
    picker.hidden = form.elements.mode.value !== 'select';
    document.getElementById('state-count').textContent = `${selected().length} ${selected().length === 1 ? 'state' : 'states'} selected`;
    error.hidden = true;
    search.removeAttribute('aria-invalid');
    search.removeAttribute('aria-describedby');
  }
  form.addEventListener('change', update);
  search.addEventListener('input', () => {
    let visible = 0;
    regions.forEach(input => {
      const label = input.closest('label');
      label.hidden = !label.textContent.toLowerCase().includes(search.value.trim().toLowerCase());
      if (!label.hidden) visible++;
    });
    document.getElementById('no-matches').hidden = visible > 0;
  });
  document.getElementById('clear-states').addEventListener('click', () => {
    regions.forEach(input => { input.checked = false; });
    update();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const mode = form.elements.mode.value;
    if (mode === 'select' && !selected().length) {
      error.hidden = false;
      search.setAttribute('aria-invalid', 'true');
      search.setAttribute('aria-describedby', 'selection-error');
      search.focus();
      return;
    }
    const view = views.find(input => input.checked);
    const query = new URLSearchParams({ mode, view_type: view.value });
    if (mode === 'select') selected().forEach(input => query.append('region', input.value));
    location.href = `${view.dataset.target}?${query}`;
  });
  window.addEventListener('pageshow', update);
  update();
})();
