const searchInput = document.getElementById('search-input');
const displayContainer = document.getElementById('display-container');

async function require(path) {
  const response = await fetch(path);
  return response.json();
}

function debounce(fn, delay = 300) {
  let timeout = null;
  return function (...args) {
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function nameToDataAttribute(name) {
  return 'data-' + name.replace(/ /g, '-');
}

function getHeaderNames([ firstResturant ]) {
  return Object.keys(firstResturant);
}

function buildHeaderFragment(resturants) {
  const headerTemplate = document.querySelector("#header-item");
  const headerFragment = document.createDocumentFragment();
  const headerNames = getHeaderNames(resturants);

  headerNames.forEach(name => {
    const clone = headerTemplate.content.cloneNode(true);
    const cloneButton = clone.querySelector('.header-item-button');
    cloneButton.innerText = name;
    cloneButton.setAttribute('data-type',  name);
    headerFragment.appendChild(cloneButton);
  });

  return headerFragment;
}

function buildRowItem(key, val) {
  const rowItemTemplate = document.getElementById('row-item-template');
  const rowItemClone = rowItemTemplate.content.cloneNode(true);
  const rowNode = rowItemClone.querySelector('.row-item');
  rowNode.innerText = val;
  rowNode.setAttribute(nameToDataAttribute(key), key);

  return rowNode;
}

function buildView(resturants) {
  const headerNames = getHeaderNames(resturants);
  const displaySection = document.createDocumentFragment();
  displaySection.appendChild(buildHeaderFragment(resturants));

  resturants.forEach(resturant => {
    headerNames.forEach(header => {
      displaySection.appendChild(buildRowItem(header, resturant[header]));
    });
  })

  displayContainer.appendChild(displaySection);
}

function updateResturants(resturants, regex) {
  displayContainer.innerHTML = '';
  if(regex)
    buildView(resturants.filter(resturant => resturant['Restaurant Name'].match(regex)));
  else
    buildView(resturants);
}

const debouncedUpdateResturants = debounce(updateResturants);

function resturantSorter(resturants, key, mul) {
  if(resturants.length <= 1) return;
  resturants.sort((a,b) => {
    const aVal = isNaN(Number(a[key])) ? a[key] : Number(a[key]);
    const bVal = isNaN(Number(b[key])) ? b[key] : Number(b[key]);
    if(aVal < bVal) {
      return -1*mul;
    } else if(aVal > bVal) {
      return mul;
    }

    return 0;
  });
  updateResturants(resturants);
}

async function exec() {
  const resturants = await require('assets/resturants.json');
  const sort = {};
  updateResturants(resturants);

  searchInput.addEventListener('keyup', (e) => {
    e.stopPropagation();
    if( e.target.value )
      debouncedUpdateResturants(resturants, e.target.value);
    else
      debouncedUpdateResturants(resturants, /.*/);
  });

  displayContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const { target } = e;
    if(target.nodeName === 'BUTTON' && target.classList.contains('header-item-button')) {
      const type = target.dataset['type'];
      const mul = sort[type] || 1;
      resturantSorter(resturants, type, -1 * mul);
      sort[type] = -1*mul;
    }
  }, false);
}

exec();