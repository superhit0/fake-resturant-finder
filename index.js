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
    cloneButton.setAttribute(nameToDataAttribute(name),  name);
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
  buildView(resturants.filter(resturant => resturant['Restaurant Name'].match(regex)));
}

const debouncedUpdateResturants = debounce(updateResturants);

async function exec() {
  const resturants = await require('assets/resturants.json');
  buildView(resturants);
  searchInput.addEventListener('keyup', (e) => {
    if( e.target.value )
      debouncedUpdateResturants(resturants, e.target.value);
    else
      debouncedUpdateResturants(resturants, /.*/);
  });
}

exec();