//live time ---------------------------------------------------------------------------------------------------------------------
var span = document.getElementById("span");
function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  span.textContent =
    ("0" + h).substr(-2) +
    ":" +
    ("0" + m).substr(-2) +
    ":" +
    ("0" + s).substr(-2);
}
//live time ---------------------------------------------------------------------------------------------------------------------
setInterval(time, 1000);
let finalData = {
  irctc_credentials: {},
  journey_details: {},
  extension_data: {
    book_at_tatkal_time: true,
  },
  passenger_details: [],
  infant_details: [],
  contact_details: {},
  gst_details: {},
  payment_preferences: {},
  travel_preferences: {},
  other_preferences: {},
};

const defaultValue = {
  gender: "M",
  nationality: "IN",
};

const errors = [];
let port;

window.addEventListener("load", () => {
  addDropdownOption(
    "from-station-input",
    "from-station-list",
    setFromStation,
    stationList,
    (q) => {
      return `<li data-english-label="${q.english_label}" data-hindi-label="${q.hindi_label}" data-station-code="${q.value}"  class="dropdown-list-item">${q.english_label} - ${q.value}</li>`;
    }
  );

  addDropdownOption(
    "destination-station-input",
    "destination-station-list",
    setDestinationStation,
    stationList,
    (q) => {
      return `<li data-english-label="${q.english_label}" data-hindi-label="${q.hindi_label}" data-station-code="${q.value}" class="dropdown-list-item">${q.english_label} - ${q.value}</li>`;
    }
  );

  addDropdownOption(
    "journey-class-input",
    "journey-class-list",
    setJourneyClass,
    classList,
    (q) => {
      return `<li class="dropdown-list-item" data-label="${q.label}" data-class="${q.value}">${q.label}</li>`;
    }
  );

  addDropdownOption("quota-input", "quota-list", setQuota, quotaList, (q) => {
    return `<li class="dropdown-list-item" data-label="${q.label}" data-quota="${q.value}">${q.label}</li>`;
  });

  addSelectOption("passenger-gender-1", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-2", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-3", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-4", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });

  addSelectOption("passenger-nationality-1", countryList, (q, i) => {
    return `<option class="dropdown-list-item" selected=${
      q.countryCode === "IN"
    } value="${q.countryCode}" data-label="${
      q.country
    }" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-2", countryList, (q, i) => {
    if (q.countryCode === "IN") tempIndex = i;
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-3", countryList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-4", countryList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });

  addSelectOption("reservationChoice", reservationChoiceList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });

  let indiaIndex = countryList.findIndex((c) => c.countryCode === "IN");
  document.querySelector("#passenger-nationality-1").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-2").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-3").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-4").selectedIndex = indiaIndex;
  document.querySelector("#book_at_tatkal_time").checked = true;

  addSelectOption("infant-gender-1", infantGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-gender-2", infantGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-age-1", infantAge, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-age="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-age-2", infantAge, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-age="${q.value}"><span>${q.label}</span></li>`;
  });

  document
    .querySelector("#irctc-login")
    .addEventListener("change", setIRCTCUsername);
  document
    .querySelector("#irctc-password")
    .addEventListener("change", setIRCTCPassword);
  document
    .querySelector("#book_at_tatkal_time")
    .addEventListener("change", setFeatureDetails);
  document
    .querySelector("#from-station-input")
    .addEventListener("keyup", fromStationFilter);
  document
    .querySelector("#destination-station-input")
    .addEventListener("keyup", destinationStationFilter);
  document
    .querySelector("#journey-date")
    .addEventListener("change", journeyDateChanged);
  document
    .querySelector("#journey-class-input")
    .addEventListener("keyup", journeyClassFilter);
  document
    .querySelector("#quota-input")
    .addEventListener("keyup", journeyQuotaFilter);
  document
    .querySelector("#train-no")
    .addEventListener("change", setTrainNumber);
  for (let i = 0; i < 4; i++) {
    document
      .querySelector(`#passenger-name-${i + 1}`)
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector(`#age-${i + 1}`)
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector(`#passenger-gender-${i + 1}`)
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector(`#passenger-berth-${i + 1}`)
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector(`#passenger-nationality-${i + 1}`)
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
  }
  for (let i = 0; i < 2; i++) {
    document
      .querySelector(`#infant-name-${i + 1}`)
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
    document
      .querySelector(`#age-${i + 1}`)
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
    document
      .querySelector(`#infant-gender-${i + 1}`)
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
  }

  document
    .querySelector("#gstin-number")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-name")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-flat")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-street")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-area")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-PIN")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-City")
    .addEventListener("change", setGSTINDetails);

  document
    .querySelector("#mobileNumber")
    .addEventListener("change", setContactDetails);
  document
    .querySelector("#email")
    .addEventListener("change", setContactDetails);

  document
    .querySelector("#autoUpgradation")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#confirmberths")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#reservationChoice")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#coachId")
    .addEventListener("change", setOtherPreferences);

  document
    .querySelector("#travelInsuranceOpted-1")
    .addEventListener("change", setTravelPreferences);
  document
    .querySelector("#travelInsuranceOpted-2")
    .addEventListener("change", setTravelPreferences);

  document
    .querySelector("#paymentType-1")
    .addEventListener("change", setPaymentPreferences);
  document
    .querySelector("#paymentType-2")
    .addEventListener("change", setPaymentPreferences);
//================================================================================================================================
  document.querySelector("#submit-btn-top").addEventListener("click", saveForm);
  document
    .querySelector("#load-btn-1-top")
    .addEventListener("click", () => loadUserData());
  document
    .querySelector("#clear-btn-top")
    .addEventListener("click", () => clearData());
  document
    .querySelector("#connect-btn-top")
    .addEventListener("click", connectWithBg);
  //================================================================================================================================
  document.querySelector("#submit-btn").addEventListener("click", saveForm);
  document
    .querySelector("#load-btn-1")
    .addEventListener("click", () => loadUserData());
  document
    .querySelector("#clear-btn")
    .addEventListener("click", () => clearData());
  document
    .querySelector("#connect-btn")
    .addEventListener("click", connectWithBg);
});

//
// Filter functions for all dropdown
//
function fromStationFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("from-station-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("from-station-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function destinationStationFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("destination-station-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("destination-station-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function journeyClassFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("journey-class-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("journey-class-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function journeyQuotaFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("quota-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("quota-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//
// Add options to all dropdowns
//
function addDropdownOption(
  inputId,
  optionListId,
  optionOnClick,
  options,
  renderOption
) {
  let dropdown;
  dropdown = document.querySelector(`#${inputId}`).parentElement;
  dropdown.querySelector(`#${optionListId}`).innerHTML = options
    .map(renderOption)
    .join("");
  [...(dropdown.querySelectorAll(`#${optionListId} li`) ?? [])].forEach((e) =>
    e.addEventListener("click", optionOnClick)
  );
}

function addSelectOption(selectId, options, renderOption) {
  let select;
  select = document.querySelector(`#${selectId}`);
  select.innerHTML = options.map(renderOption).join("");
}

function setBerthOptions(selectedClass) {
  addSelectOption(
    "passenger-berth-1",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-2",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-3",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-4",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
}

//
// Update Final Data
//

function setIRCTCUsername(e) {
  if (!finalData["irctc_credentials"]) finalData["irctc_credentials"] = {};
  finalData["irctc_credentials"]["user_name"] = e.target.value;
  console.log("data-update", finalData);
}

function setIRCTCPassword(e) {
  finalData["irctc_credentials"]["password"] = e.target.value;
  console.log("data-update", finalData);
}

function setFromStation(e) {
  finalData["journey_details"]["from"] = {
    hindi_label: e.target.dataset["hindiLabel"],
    english_label: e.target.dataset["englishLabel"],
    station_code: e.target.dataset["stationCode"],
  };
  document.querySelector(
    "#from-station-input"
  ).value = `${e.target.dataset["englishLabel"]} - ${e.target.dataset["stationCode"]}`;
}
function setDestinationStation(e) {
  finalData["journey_details"]["destination"] = {
    hindi_label: e.target.dataset["hindiLabel"],
    english_label: e.target.dataset["englishLabel"],
    station_code: e.target.dataset["stationCode"],
  };
  document.querySelector(
    "#destination-station-input"
  ).value = `${e.target.dataset["englishLabel"]} - ${e.target.dataset["stationCode"]}`;
}
function setJourneyClass(e) {
  finalData["journey_details"]["class"] = {
    label: e.target.dataset["label"],
    value: e.target.dataset["class"],
  };
  document.querySelector(
    "#journey-class-input"
  ).value = `${e.target.dataset["label"]}`;
  setBerthOptions(e.target.dataset["class"]);
}
function setQuota(e) {
  finalData["journey_details"]["quota"] = {
    label: e.target.dataset["label"],
    value: e.target.dataset["quota"],
  };
  document.querySelector("#quota-input").value = `${e.target.dataset["label"]}`;
}

function journeyDateChanged(e) {
  finalData["journey_details"]["date"] = e.target.value;
}
function setTrainNumber(e) {
  finalData["journey_details"]["train-no"] = e.target.value;
}

function setPassengerDetails(e, index, type) {
  if (type === "infant") {
    if (!finalData["infant_details"][index])
      finalData["infant_details"][index] = {};
    finalData["infant_details"][index][e.target.name] = e.target.value;
  } else {
    if (!finalData["passenger_details"][index])
      finalData["passenger_details"][index] = {};
    finalData["passenger_details"][index][e.target.name] = e.target.value;
  }
}
function setContactDetails(e) {
  if (!finalData["contact_details"]) finalData["contact_details"] = {};
  finalData["contact_details"][e.target.name] = e.target.value;
}
function setGSTINDetails(e) {
  if (!finalData["gst_details"]) finalData["gst_details"] = {};
  finalData["gst_details"][e.target.name] = e.target.value;
}
function setOtherPreferences(e) {
  if (!finalData["other_preferences"]) finalData["other_preferences"] = {};
  finalData["other_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}
function setPaymentPreferences(e) {
  if (!finalData["payment_preferences"]) finalData["payment_preferences"] = {};
  finalData["payment_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}
function setTravelPreferences(e) {
  if (!finalData["travel_preferences"]) finalData["travel_preferences"] = {};
  finalData["travel_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}
function setFeatureDetails(e) {
  if (!finalData["extension_data"]) finalData["extension_data"] = {};
  finalData["extension_data"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}

// function setData(i) {
//   const temp_data = i == 1 ? user_data : user_data_with_gst;
//   finalData["irctc_credentials"] = temp_data["irctc_credentials"] ?? {};
//   finalData["journey_details"] = temp_data["journey_details"] ?? {};
//   finalData["passenger_details"] = temp_data["passenger_details"] ?? [];
//   finalData["infant_details"] = temp_data["infant_details"] ?? [];
//   finalData["contact_details"] = temp_data["contact_details"] ?? {};
//   finalData["gst_details"] = temp_data["gst_details"] ?? {};
//   finalData["payment_preferences"] = temp_data["payment_preferences"] ?? {};
//   finalData["travel_preferences"] = temp_data["travel_preferences"] ?? {};
//   finalData["other_preferences"] = temp_data["other_preferences"] ?? {};
// }

function modifyUserData() {
  // finalData["irctc_credentials"]
  // finalData["journey_details"]
  finalData["passenger_details"] =
    finalData["passenger_details"]
      ?.filter((p) => p.name?.length > 0 && p.age?.length > 0)
      ?.map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender ?? "M",
        berth:
          p.berth ??
          berthChoiceList[finalData["journey_details"].class.value][0].value,
        nationality: "IN",
      })) ?? [];
  finalData["infant_details"] =
    finalData["infant_details"]
      ?.filter((p) => p.name?.length > 0)
      ?.map((p) => ({
        name: p.name,
        age: p.age ?? infantAge[0].value,
        gender: p.gender ?? "M",
      })) ?? [];
  // finalData["contact_details"];
  finalData["gst_details"] = finalData["gst_details"]?.["gstin-number"]
    ? finalData["gst_details"]
    : undefined;
}

function loadUserData() {
  chrome.storage.local.get(null, (loadData) => {
    debugger;
    if (Object.keys(loadData).length === 0) return;
    document.querySelector("#irctc-login").value =
      loadData.irctc_credentials.user_name;
    document.querySelector("#irctc-password").value =
      loadData.irctc_credentials.password;

    document.querySelector(
      "#from-station-input"
    ).value = `${loadData.journey_details.from.english_label} - ${loadData.journey_details.from.station_code}`;
    document.querySelector(
      "#destination-station-input"
    ).value = `${loadData.journey_details.destination.english_label} - ${loadData.journey_details.destination.station_code}`;
    document.querySelector(
      "#journey-date"
    ).value = `${loadData.journey_details.date}`;
    document.querySelector(
      "#journey-class-input"
    ).value = `${loadData.journey_details.class.label}`;
    setBerthOptions(loadData.journey_details.class.value);
    document.querySelector(
      "#quota-input"
    ).value = `${loadData.journey_details.quota.label}`;
    document.querySelector(
      "#train-no"
    ).value = `${loadData.journey_details["train-no"]}`;

    loadData.passenger_details.forEach((passenger, index) => {
      document.querySelector(`#passenger-name-${index + 1}`).value =
        passenger.name ?? "";
      document.querySelector(`#age-${index + 1}`).value = passenger.age ?? "";
      document.querySelector(`#passenger-gender-${index + 1}`).value =
        passenger.gender ?? "M";
      document.querySelector(`#passenger-berth-${index + 1}`).value =
        passenger.berth ?? "";
      document.querySelector(`#passenger-nationality-${index + 1}`).value =
        passenger.nationality ?? "IN";
    });

    loadData.infant_details.forEach((infant, index) => {
      document.querySelector(`#infant-name-${index + 1}`).value =
        infant.name ?? "";
      document.querySelector(`#age-${index + 1}`).value =
        infant.age ?? infantAge[0].value;
      document.querySelector(`#infant-gender-${index + 1}`).value =
        infant.gender ?? "M";
    });

    document.querySelector("#mobileNumber").value =
      loadData.contact_details.mobileNumber ?? "";
    document.querySelector("#email").value =
      loadData.contact_details.email ?? "";

    if (loadData.gst_details?.["gstin-number"]) {
      document.querySelector("#gstin-number").value =
        loadData.gst_details["gstin-number"];
      document.querySelector("#gstin-name").value =
        loadData.gst_details["gstin-name"];
      document.querySelector("#gstin-flat").value =
        loadData.gst_details["gstin-flat"];
      document.querySelector("#gstin-street").value =
        loadData.gst_details["gstin-street"];
      document.querySelector("#gstin-area").value =
        loadData.gst_details["gstin-area"];
      document.querySelector("#gstin-PIN").value =
        loadData.gst_details["gstin-PIN"];
      document.querySelector("#gstin-City").value =
        loadData.gst_details["gstin-City"];
    }

    if (loadData.payment_preferences?.paymentType) {
      document.querySelector(
        `#paymentType-${
          loadData.payment_preferences?.paymentType === "card" ? 1 : 2
        }`
      ).checked = true;
    }
    if (loadData.travel_preferences?.travelInsuranceOpted) {
      document.querySelector(
        `#travelInsuranceOpted-${
          loadData.travel_preferences?.travelInsuranceOpted === "yes" ? 1 : 2
        }`
      ).checked = true;
    }
    if (Object.keys(loadData.other_preferences).length > 0) {
      document.querySelector("#autoUpgradation").checked =
        loadData.other_preferences.autoUpgradation ?? false;
      document.querySelector("#confirmberths").checked =
        loadData.other_preferences.confirmberths ?? false;
      document.querySelector("#coachId").checked =
        loadData.other_preferences.coachId ?? "";
      if (loadData.other_preferences.reservationChoice) {
        document.querySelector("#reservationChoice").value =
          loadData.other_preferences.reservationChoice ?? "";
      }
    }
    finalData = loadData;
  });
}

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "popup",
    id: "irctc",
  };
}

function saveForm() {
  modifyUserData();
  debugger;
  chrome.storage.local.set(finalData);
}
function clearData() {
  chrome.storage.local.clear();
}

function connectWithBg() {
  startScript();
}

function startScript() {
  chrome.runtime.sendMessage(
    getMsg("activate_script", finalData),
    (response) => {
      console.log(response, "activate_script response");
    }
  );
}

// EA, FC, VC, VS  - no berth preference available
