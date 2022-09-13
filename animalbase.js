"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let isAcending = false;
let filteredList;
let isStar = false;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: "",
  isStar: isStar,
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
  const sort = event.target.dataset.sort;
  console.log(sort);
  sortList(sort);
}
function sortList(sortType) {
  let sortedList = filteredList;
  if (sortType === "name") {
    if (isAcending) {
      sortedList = sortedList.sort(sortNameAcending);
    } else {
      sortedList = sortedList.sort(sortNameDecending);
    }
    isAcending = !isAcending;
  } else if (sortType === "type") {
    if (isAcending) {
      sortedList = sortedList.sort(sortTypeAcending);
    } else {
      sortedList = sortedList.sort(sortTypeDecending);
    }
    isAcending = !isAcending;
  } else if (sortType === "desc") {
    if (isAcending) {
      sortedList = sortedList.sort(sortDescAcending);
    } else {
      sortedList = sortedList.sort(sortDescDecending);
    }
    isAcending = !isAcending;
  } else if (sortType === "age") {
    if (isAcending) {
      sortedList = sortedList.sort(sortAgeAcending);
    } else {
      sortedList = sortedList.sort(sortAgeDecending);
    }
    isAcending = !isAcending;
  } else if (sortType === "star") {
    if (isAcending) {
      sortedList = sortedList.sort(sortStarAcending);
    } else {
      sortedList = sortedList.sort(sortStarDecending);
    }
    isAcending = !isAcending;
  }
  displayList(sortedList);
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

//Displaying
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
  // clone.querySelector("[data-field='star']").textContent = "☆";
  // clone
  //   .querySelector("[data-field='star']")
  //   .addEventListener("click", (event) => {
  //     animal.isStared = !animal.isStared;
  //     let starText;
  //     if (animal.isStared) {
  //       starText = "⭐";
  //     } else {
  //       starText = "☆";
  //     }
  //     event.target.textContent = starText;
  //   });

  animal.isStar
    ? (clone.querySelector("[data-field='star']").textContent = "⭐")
    : (clone.querySelector("[data-field='star']").textContent = "☆");
  clone
    .querySelector("[data-field='star']")
    .addEventListener("click", (event) => {
      animal.isStar = !animal.isStar;
      console.log(animal.isStar);
      if (animal.isStar) {
        event.target.textContent = "⭐";
      } else {
        event.target.textContent = "☆";
      }

      sortList(allAnimals);
    });

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
