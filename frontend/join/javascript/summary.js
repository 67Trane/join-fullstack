let Status = "http://127.0.0.1:8000/api/Status/";
let amounts = {};

/**
 * Loads account data and updates the summary section with various metrics.
 * This function fetches account data and then updates various counters and metrics on the page.
 * It should be called when the summary page is loaded or refreshed.
 *
 * @async
 */
async function loadSummary() {
  await loadTasks();
  await loadAccounts()
  setToDoNumbers();
  setDoneNumbers();
  setUrgent();
  setTaskInProgress();
  setAwaitFeedback();
  setTaskInBoard();
  getGreeting();
}

async function loadTasks() {

  await fetch(BASE_URL + "addTask/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN ? `Token ${TOKEN}` : "",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      let values = result && typeof result === "object" ? Object.values(result) : "";
      setTaskInBoard(values.length);
      amounts.todo = values.filter((t) => t.status === "todo").length;
      amounts.awaitfeedback = values.filter((t) => t.status === "awaitfeedback").length;
      amounts.inprogress = values.filter((t) => t.status === "inprogress").length;
      amounts.done = values.filter((t) => t.status === "done").length;
      amounts.urgent = values.filter((t) => t.prio === "urgent").length;
      updateStatus(amounts);
    });
}

async function updateStatus(nr) {
  fetch(BASE_URL + "Status/1/", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nr),
  });
}

/**
 * Fetches account data from the server and stores it in the `amounts` variable.
 * @async
 * @throws {Error} Throws an error if the network request fails.
 */
async function loadAccounts() {
  await fetch(Status)
    .then((response) => response.json())
    .then((result) => {
      amounts = result[0];
    })
    .catch((error) => console.log("Error fetching data:", error));
}

/**
 * Displays a greeting message based on the current time of day.
 * The greeting message will be either "Good morning", "Good afternoon", or "Good evening".
 */
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  showGreeting(greeting);
}

/**
 * Updates the greeting message displayed on the page.
 * @param {string} greeting - The greeting message to be displayed.
 */
function showGreeting(greeting) {
  document.getElementById("greeting").innerHTML = `${greeting}`;
}

/**
 * Updates the number of to-do tasks displayed on the page.
 */
function setToDoNumbers() {
  let todo = amounts.todo;
  document.getElementById("to-do-counter").innerHTML = `${todo}`;
}

/**
 * Updates the number of completed tasks displayed on the page.
 */
function setDoneNumbers() {
  let done = amounts.done;
  document.getElementById("done-counter").innerHTML = `${done}`;
}

/**
 * Updates the number of urgent tasks displayed on the page.
 */
function setUrgent() {
  let urgent = amounts.urgent;
  document.getElementById("urgent-counter").innerHTML = `${urgent}`;
}

/**
 * Updates the number of tasks currently in progress displayed on the page.
 */
function setTaskInProgress() {
  let progress = amounts.inprogress;
  document.getElementById("tasks-in-progress-counter").innerHTML = `${progress}`;
}

/**
 * Updates the number of tasks awaiting feedback displayed on the page.
 */
function setAwaitFeedback() {
  let feedback = amounts.awaitfeedback;
  document.getElementById("awaiting-feedback-counter").innerHTML = `${feedback}`;
}

/**
 * Updates the total number of tasks in the board by summing up the to-do, done, in-progress, and awaiting feedback tasks.
 */
function setTaskInBoard(amountTask) {
  let todo = amounts.todo;
  let done = amounts.done;
  let progress = amounts.inprogress;
  let feedback = amounts.awaitfeedback;
  let Tasks = +todo + +done + +progress + +feedback;
  document.getElementById("tasks-in-board-counter").innerHTML = `${amountTask | Tasks}`;
}
