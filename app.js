const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FTB-MT-WEB-PT/events";

//********************Initial State *********/

const state = {
  events: [],
};

//********************* Selectors ************/

const eventsList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);
//console.log(addEventForm);

//********************** Methods *************/

//fetch all events
async function render() {
  await getEvents();
  //render events to UI
  renderEvents();
}
render();

//GET request -> read
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
    console.log("json", json.data);
  } catch (error) {
    console.error(error, "There was an error /GET events");
  }
}

// create request
async function createEvent(name, date, location, description) {
  try {
    const formattedDate = new Date(date);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        date: formattedDate.toISOString(),
        description,
        location,
      }),
    });

    const json = await response.json();
    console.log(json);
    if (json.error) {
      throw new Error(json.message);
    }
  } catch (error) {
    console.error(error, "There was an error /POST event");
  }
  render();
}

//update - PUT

async function updateEvent(id, name, date, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, description }),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error, "There was an error /PUT event");
  }
}

//delete

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Event could not be deleted!");
    }
    render();
  } catch (error) {
    console.error(error, "There was an error /DELETE event");
  }
}

function renderEvents() {
  if (state.events.length === 0) {
    eventsList.innerHTML = `<li> No Events Found </li>`;
  }
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = `
        <h2>${event.name}</h2>
        <h3>${event.date}</h3>
        <p>${event.description}</p>
        <p>${event.location}</p>
        `;

    // create delete button

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteEvent(event.id));
    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}

async function addEvent(event) {
  event.preventDefault();
  console.log(event);
  console.log(addEventForm);
  console.log(addEventForm.Description.value);
  console.log(addEventForm.dateInput.value);
  await createEvent(
    addEventForm.title.value,
    addEventForm.dateInput.value,

    addEventForm.location.value,
    addEventForm.Description.value
  );
}
