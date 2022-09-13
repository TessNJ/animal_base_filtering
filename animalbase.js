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
  star: "",
  star: false,
  winner: false,
};

//Start / Init
function start() {
  console.log("ready");

  // Add event-listeners to filter and sort buttons

  registerButtons();
  loadJSON();
}

//Register Buttons
function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((th) => th.addEventListener("click", selectSorting));
}

//Load json
async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

//Prepare animals
function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  filterList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.isStar = false;
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

//Filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  filterList(filter);
}

function filterList(animalType) {
  filteredList = allAnimals;
  if (animalType === "cat") {
    //Create a filteredlist of only cats
    filteredList = filteredList.filter(isCat);
  } else if (animalType === "dog") {
    //Create a filteredlist of only dogs
    filteredList = filteredList.filter(isDog);
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
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //Toggle Direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(sortBy, sortDir);
  sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir) {
  let sortedList = filteredList;
  let direction = 1;
  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);
  function sortByProperty(animalA, animalB) {
    if (animalA[sortBy] < animalB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  displayList(sortedList);
}

function sortStarAcending(a, b) {
  if (a.isStar < b.isStar) {
    return -1;
  } else {
    return 1;
  }
}

function sortStarDecending(a, b) {
  if (a.isStar > b.isStar) {
    return -1;
  } else {
    return 1;
  }
}

function sortWinnerAcending(a, b) {
  if (a.winner < b.winner) {
    return -1;
  } else {
    return 1;
  }
}

function sortWinnerDecending(a, b) {
  if (a.winner > b.winner) {
    return -1;
  } else {
    return 1;
  }
}

//Displaying, Stars and Winners
function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // console.log(animal);
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);
  // set clone data

  // Easy content
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  //Stars
  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  clone.querySelector("[data-field=star]").addEventListener("click", clickStar);
  function clickStar() {
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    sortList(allAnimals);
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

/* //
function filterWinner(animal) {
  return animal.winner === true;
}
 */
