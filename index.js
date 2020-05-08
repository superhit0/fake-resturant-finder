async function require(path) {
  const response = await fetch(path);
  return response.json();
}

function nameToDataAttribute(name) {
  return 'data-' + name.replace(/ /g, '-');
}

function getHeaderNames([ firstResturant ]) {
  return Object.keys(firstResturant);
}

function buildHeader(resturants) {
  const container = document.getElementById('header-container');
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

  container.appendChild(headerFragment);
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
  const displayContainer = document.getElementById('display-container');
  const headerNames = getHeaderNames(resturants);
  const displaySection = document.createDocumentFragment();

  resturants.forEach(resturant => {
    headerNames.forEach(header => {
      displaySection.appendChild(buildRowItem(header, resturant[header]));
    });
  })

  displayContainer.appendChild(displaySection);
}

async function exec() {
  const resturants = await require('assets/resturants.json');
  buildHeader(resturants);
  buildView(resturants);
  console.log(resturants);
}

exec();