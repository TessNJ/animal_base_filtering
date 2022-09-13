"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let isAcending = false;
let filteredList;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");

  // Add event-listeners to filter and sort buttons

  registerButtons();
  loadJSON();
}

function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((th) => th.addEventListener("click", selectSorting));
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}
//Filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(filter);
  filterList(filter);
}

function filterList(animalType) {
  let filteredList = allAnimals;
  if (animalType === "cat") {
    //Create a filteredlist of only cats
    filteredList = allAnimals.filter(isCat);
  } else if (animalType === "dog") {
    //Create a filteredlist of only dogs
    filteredList = allAnimals.filter(isDog);
  }
  displayList(filteredList);
}

function isCat(animal) {
  return animal.type === "cat";
}

function isDog(animal) {
  return animal.type === "dog";
}

//Sorting
function selectSorting(event) {
  const sort = event.target.dataset.sort;
  // console.log("here", sort);
  // let allAnimals = filteredList;
  let varItem;
  if (sort === "name") {
    if (isAcending) {
      allAnimals.sort(sortNameAcending);
    } else {
      allAnimals.sort(sortNameDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "type") {
    if (isAcending) {
      allAnimals.sort(sortTypeAcending);
    } else {
      allAnimals.sort(sortTypeDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "desc") {
    if (isAcending) {
      allAnimals.sort(sortDescAcending);
    } else {
      allAnimals.sort(sortDescDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "age") {
    if (isAcending) {
      allAnimals.sort(sortAgeAcending);
    } else {
      allAnimals.sort(sortAgeDecending);
    }
    isAcending = !isAcending;
  }
  /*  const sort = event.target.dataset.sort;
  // console.log("here", sort);
  let varItem = sort;

  //OR
  let varItem;
  if (sort === "name") {
    varItem = sort;
    if (isAcending) {
      allAnimals.sort(sortAcending);
    } else {
      allAnimals.sort(sortDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "type") {
    varItem = sort;
    if (isAcending) {
      allAnimals.sort(sortAcending);
    } else {
      allAnimals.sort(sortDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "desc") {
    varItem = "desc";
    if (isAcending) {
      allAnimals.sort(sortAcending);
    } else {
      allAnimals.sort(sortDecending);
    }
    isAcending = !isAcending;
  } else if (sort === "age") {
    varItem = "age";
    if (isAcending) {
      allAnimals.sort(sortAcending);
    } else {
      allAnimals.sort(sortDecending);
    }
    isAcending = !isAcending;
  } */
  displayList(allAnimals);
}

function sortNameAcending(a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}
function sortNameDecending(a, b) {
  if (a.name > b.name) {
    return -1;
  } else {
    return 1;
  }
}
function sortTypeAcending(a, b) {
  if (a.type < b.type) {
    return -1;
  } else {
    return 1;
  }
}
function sortTypeDecending(a, b) {
  if (a.type > b.type) {
    return -1;
  } else {
    return 1;
  }
}
function sortDescAcending(a, b) {
  if (a.desc < b.desc) {
    return -1;
  } else {
    return 1;
  }
}
function sortDescDecending(a, b) {
  if (a.desc > b.desc) {
    return -1;
  } else {
    return 1;
  }
}
function sortAgeAcending(a, b) {
  if (a.age < b.age) {
    return -1;
  } else {
    return 1;
  }
}
function sortAgeDecending(a, b) {
  if (a.age > b.age) {
    return -1;
  } else {
    return 1;
  }
}

/* function sortAcending(a, b) {
  if (a.varItem < b.var) {
    return -1;
  } else {
    return 1;
  }
}
function sortDecending(a, b) {
  if (a.varItem > b.var) {
    return -1;
  } else {
    return 1;
  }
} */

//Displaying
function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
