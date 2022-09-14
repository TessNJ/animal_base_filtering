"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
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

  buildList();
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
  setFilter(filter);
}

function setFilter(filter) {
  settings.filter = filter;
  buildList();
}

function filterList(filteredList) {
  // filteredList = allAnimals;
  if (settings.filter === "cat") {
    //Create a filteredlist of only cats
    filteredList = filteredList.filter(isCat);
  } else if (settings.filter === "dog") {
    //Create a filteredlist of only dogs
    filteredList = filteredList.filter(isDog);
  }
  return filteredList;
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
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);
  function sortByProperty(animalA, animalB) {
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allAnimals);
  const sortedList = sortList(currentList);
  displayList(sortedList);
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
    buildList();
  }
  //Winner
  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;

  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", clickWinner);
  function clickWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeAWinner(animal);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeAWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);
  const numberOfWinners = winners.length;
  const other = winners
    .filter((animal) => animal.type === selectedAnimal.type)
    .shift();

  //If there is another of the same type
  if (other !== undefined) {
    removeOther(other);
  } else if (numberOfWinners >= 2) {
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  console.log(winners);

  //just for testing
  makeWinner(selectedAnimal);

  function removeOther(other) {
    //Ask user to ignore or remove "other"
    document.querySelector("#remove_other").classList.remove("hidden");

    document
      .querySelector("#remove_other .closeButton")
      .addEventListener("click", closeDialog);

    document
      .querySelector("#remove_other #removeother")
      .addEventListener("click", clickRemoveOther);

    //If ignore - so nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hidden");
      document
        .querySelector("#remove_other #removeother")
        .removeEventListener("click", clickRemoveOther);

      document
        .querySelector("#remove_other .closeButton")
        .removeEventListener("click", closeDialog);
    }

    //if remove other:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }
  function removeAorB(winnerA, winnerB) {
    //ask user to ignore or remove, a or b
    document.querySelector("#remove_aorb").classList.remove("hidden");

    document
      .querySelector("#remove_aorb .closeButton")
      .addEventListener("click", closeDialog);

    document
      .querySelector("#remove_aorb #removea")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove_aorb #removeb")
      .addEventListener("click", clickRemoveB);

    //if user ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hidden");
      document
        .querySelector("#remove_aorb .closeButton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }
    //if user remove a:
    function clickRemoveA() {
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
    //else if user remove b:
    function clickRemoveB() {
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }
  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }
  function makeWinner(animal) {
    animal.winner = true;
  }
}
