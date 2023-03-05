let scriptActivated = false;
let tabDetails;
let status_updates = {};

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender, "background_script received a msg");
  if (message.id !== "irctc") {
    sendResponse("Invalid Id");
    return;
  }
  const type = message.msg.type;
  const data = message.msg.data;
  if (type === "activate_script") {
    chrome.tabs.create(
      {
        url: "https://www.irctc.co.in/nget/train-search",
      },
      (tab) => {
        tabDetails = tab;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["./content_script.js","./tesseract.js"]
        });
      }
    );
    sendResponse("Script activated");
  } else if (type === "status_update") {
    if (!status_updates[sender.id]) status_updates[sender.id] = [];

    status_updates[sender.id].push({
      sender: sender,
      data,
    });
  } else {
    sendResponse("Something went wrong");
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tabId, changeInfo, tab);
  if (tabId === tabDetails?.id && changeInfo?.status === "complete") {
    if (tab.url.includes("booking/train-list")) {
      chrome.tabs.sendMessage(tabDetails.id, getMsg("selectJourney"));
    }
    if (tab.url.includes("booking/psgninput")) {
      console.log("asdasdasdasdss");
      chrome.tabs.sendMessage(tabDetails.id, getMsg("fillPassengerDetails"));
    }
  }
});

// On installing the extension
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  }
});
// chrome.tabs.create(
//   createProperties: object,
//   callback?: function,
// )

// open irctc page  - https://www.irctc.co.in/nget/train-search
// set localStorage for search history of journey
// reload the page
// login the users at 11.00 / 10.00
// set journey details
// click Search

// route changes to - https://www.irctc.co.in/nget/booking/train-list
// select journey class
// select date
// click book now

// route changes - https://www.irctc.co.in/nget/booking/psgninput
// Fill passenger details, contact_details, other details

// route changes - https://www.irctc.co.in/nget/booking/reviewBooking
// Fill captach

// route changes - https://www.irctc.co.in/nget/payment/bkgPaymentOptions
// Fill captach
