async function require(path) {
  const response = await fetch(path);
  return response.json();
}

function nameToDataAttribute(name) {
  return 'data-' + name.replace(/ /g, '-');
}

function buildHeader([ firstResturant ]) {
  const container = document.getElementById('header-container');
  const headerTemplate = document.querySelector("#header-item");
  const headerFragment = document.createDocumentFragment();
  const headerNames = Object.keys(firstResturant);

  headerNames.forEach(name => {
    const clone = headerTemplate.content.cloneNode(true);
    const cloneButton = clone.querySelector('.header-item-button');
    cloneButton.innerText = name;
    cloneButton.setAttribute(nameToDataAttribute(name),  name);
    headerFragment.appendChild(cloneButton);
  });

  container.appendChild(headerFragment);
}

async function exec() {
  const resturants = await require('assets/resturants.json');
  buildHeader(resturants);
  console.log(resturants);
}

exec();