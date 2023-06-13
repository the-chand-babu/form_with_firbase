const form = document.getElementsByClassName("form");
const fallback = document.getElementsByClassName("fallback");
const succesStore = document.getElementsByClassName("succesMessge");
const updateName = document.getElementById("updateName");
const updateEmail = document.getElementById("updateEmail");
const updateMessage = document.getElementById("updateMessage");
const updateDiv = document.getElementsByClassName("updateDiv");

let success = false;
let tbody = document.getElementById("tbody");
let updatekey = "";

async function handleSubmit(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let message = document.getElementById("message").value;

  name = name.trim(" ");
  email = email.trim(" ");
  message = message.trim(" ");

  if (name.length === 0 || email.length === 0 || message.length === 0) {
    fallback[0].classList.add("active");
    fallback[0].classList.remove("remove");
    return;
  }
  try {
    let res = await fetch(
      "https://userdata-4a4de-default-rtdb.firebaseio.com/.json",
      {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      }
    );
    let data = await res.json();
    if (data) {
      success = true;
    }
  } catch (error) {
    console.log("error", error);
  }

  if (success) {
    succesStore[0].classList.add("active");
    succesStore[0].classList.remove("inactive");
    getData();
  } else {
    alert("something went wrong");
  }
}

function removefallback() {
  fallback[0].classList.add("remove");
  fallback[0].classList.remove("active");
}

function succesOK() {
  succesStore[0].classList.add("inactive");
  succesStore[0].classList.remove("active");
  let name = (document.getElementById("name").value = "");
  let email = (document.getElementById("email").value = "");
  let message = (document.getElementById("message").value = "");
}

getData();

async function getData() {
  try {
    let res = await fetch(
      "https://userdata-4a4de-default-rtdb.firebaseio.com/.json"
    );
    let data = await res.json();
    appendData(data);
  } catch (error) {
    console.log("error", error);
  }
}

function appendData(data) {
  tbody.innerHTML = null;
  const dataArr = [];
  for (key in data) {
    dataArr.push({ ...data[key], key });
  }

  dataArr.forEach((ele) => {
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");

    td1.innerHTML = ele.name;
    td2.innerHTML = ele.email;
    td3.innerHTML = ele.message;
    td4.innerText = "Update";
    td5.innerText = "Delete";

    td5.addEventListener("click", () => {
      deleteData(ele.key);
    });

    td4.addEventListener("click", () => {
      udateData(ele.key, ele);
      console.log(ele);
    });

    tr.append(td1, td2, td3, td4, td5);
    tbody.append(tr);
  });

  console.log(dataArr);
}

async function deleteData(key) {
  //   console.log(key);
  try {
    let res = await fetch(
      `https://userdata-4a4de-default-rtdb.firebaseio.com/${key}.json`,
      {
        method: "DELETE",
      }
    );

    getData();

    let deleteMessage = document.getElementsByClassName("deletemessage");
    deleteMessage[0].classList.add("active");
    deleteMessage[0].classList.remove("inactive");
  } catch (error) {
    console.log("Error", error);
  }
}

function udateData(key, ele) {
  updateDiv[0].classList.add("active");
  updateDiv[0].classList.remove("inactive");
  updateEmail.value = ele.email;
  updateName.value = ele.name;
  updateMessage.value = ele.message;
  updatekey = key;
}

async function handleUpdate(e) {
  e.preventDefault();
  let updateName = document.getElementById("updateName").value;
  let updateEmail = document.getElementById("updateEmail").value;
  let updateMessage = document.getElementById("updateMessage").value;
  console.log({ updateEmail, updateMessage, updateName });

  if (
    updateEmail.length === 0 ||
    updateMessage.length == 0 ||
    updateName.length == 0
  ) {
    alert("please Fill all the Field");
    return;
  }
  try {
    let res = await fetch(
      `https://userdata-4a4de-default-rtdb.firebaseio.com/${updatekey}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: updateName,
          email: updateEmail,
          message: updateMessage,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    console.log(data);
    getData();

    updateDiv[0].classList.add("inactive");
    updateDiv[0].classList.remove("active");
    let updatemessga = document.getElementsByClassName("updatemessage");
    updatemessga[0].classList.add("active");
    updatemessga[0].classList.remove("inactive");
  } catch (error) {
    console.log("error", error);
  }
}

function updateOk() {
  let updatemessga = document.getElementsByClassName("updatemessage");
  updatemessga[0].classList.add("inactive");
  updatemessga[0].classList.remove("active");
}

function deleteOk() {
  let deleteMessage = document.getElementsByClassName("deletemessage");
  deleteMessage[0].classList.add("inactive");
  deleteMessage[0].classList.add("active");
}
