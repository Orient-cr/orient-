/* =====================================================
   ANOWEB
   JAVASCRIPT
===================================================== */


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

  const pages =
    document.querySelectorAll(".page");


  pages.forEach(function(page) {

    page.classList.remove("active");

  });

  const selectedPage =
    document.getElement
ById(pageId);


  if (selectedPage) {

    const selectedPage = document.getElementById(pageId);

  }


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });


  /* Refresh remarks when opening
     the remarks page */

  if (pageId === "remarksPage") {

    displayRemarks();

  }

}


/* =====================================================
   REMARK TYPE
===================================================== */

let selectedType = "";


function selectType(type) {

  selectedType = type;


  const positive =
    document.getElementById("positiveBtn");


  const negative =
    document.getElementById("negativeBtn");


  positive.classList.remove("selected");

  negative.classList.remove("selected");


  if (type === "positive") {

    positive.classList.add("selected");

  }


  if (type === "negative") {

    negative.classList.add("selected");

  }

}


/* =====================================================
   REMARK STORAGE
===================================================== */

let remarks =
  JSON.parse(
    localStorage.getItem("anowebRemarks")
  ) || [];


/* =====================================================
   SUBMIT REMARK
===================================================== */

function submitRemark() {

  const remarkBox =
    document.getElementById("remark");


  const remark =
    remarkBox.value.trim();


  const message =
    document.getElementById("successMessage");


  /* Check type */

  if (selectedType === "") {

    message.style.color =
      "#dc2626";

    message.textContent =
      "Please choose Positive or Negative.";

    return;

  }


  /* Check empty remark */

  if (remark === "") {

    message.style.color =
      "#dc2626";

    message.textContent =
      "Please write a remark before submitting.";

    return;

  }


  /* Create remark */

  const newRemark = {

    id: Date.now(),

    type: selectedType,

    text: remark,

    likes: 0,

    dislikes: 0

  };


  /* Add remark */

  remarks.push(newRemark);


  /* Save */

  localStorage.setItem(

    "anowebRemarks",

    JSON.stringify(remarks)

  );


  /* Success */

  message.style.color =
    "#16a34a";


  message.textContent =
    "✓ Your remark has been submitted anonymously.";


  /* Clear */

  remarkBox.value = "";


  selectedType = "";


  document
    .getElementById("positiveBtn")
    .classList.remove("selected");


  document
    .getElementById("negativeBtn")
    .classList.remove("selected");


  /* Refresh */

  displayRemarks();

}


/* =====================================================
   DISPLAY REMARKS
===================================================== */

function displayRemarks() {

  const container =
    document.getElementById("allRemarks");


  if (!container) {

    return;

  }


  container.innerHTML = "";


  /* ================= EMPTY ================= */

  if (remarks.length === 0) {

    container.innerHTML = `

      <div class="no-remarks">

        <div class="no-remarks-icon">
          💬
        </div>

        <h2>
          No remarks yet
        </h2>

        <p>
          Be the first student to share
          an experience.
        </p>

        <button
          class="main-button"
          onclick="showPage('remarkPage')">

          Leave a Remark

        </button>

      </div>

    `;

    return;

  }


  /* ================= REMARKS ================= */

  remarks.forEach(function(item, index) {

    const post =
      document.createElement("div");


    post.className =
      "remark-post";


    /*
      Check if this browser session
      already reacted.
    */

    const alreadyVoted =
      sessionStorage.getItem(
        "voted_" + item.id
      );


    /* ================= HTML ================= */

    post.innerHTML = `

      <div class="anonymous-number">

        Anonymous #${index + 1}

      </div>


      <span class="remark-type ${item.type}">

        ${
          item.type === "positive"
          ? "👍 Positive"
          : "👎 Negative"
        }

      </span>


      <div class="remark-text">

        ${escapeHTML(item.text)}

      </div>


      <div class="reactions">


        <!-- LIKE -->

        <button

          class="reaction-button like-button ${
            alreadyVoted === "like"
              ? "voted"
              : ""
          }"

          ${
            alreadyVoted
              ? "disabled"
              : ""
          }

          onclick="
            react(${item.id}, 'like')
          "

        >

          👍 Like

          <span class="reaction-count">

            ${item.likes}

          </span>

        </button>


        <!-- DISLIKE -->

        <button

          class="reaction-button dislike-button ${
            alreadyVoted === "dislike"
              ? "voted"
              : ""
          }"

          ${
            alreadyVoted
              ? "disabled"
              : ""
          }

          onclick="
            react(${item.id}, 'dislike')
          "

        >

          👎 Dislike

          <span class="reaction-count">

            ${item.dislikes}

          </span>

        </button>


      </div>

    `;


    container.appendChild(post);

  });

}


/* =====================================================
   REACTION SYSTEM
===================================================== */

function react(id, reaction) {

  /*
    Unique key for this remark.
  */

  const voteKey =
    "voted_" + id;


  /*
    Check whether this session
    already reacted.
  */

  if (
    sessionStorage.getItem(voteKey)
  ) {

    return;

  }


  /*
    Find remark.
  */

  const remark =
    remarks.find(function(item) {

      return item.id === id;

    });


  if (!remark) {

    return;

  }


  /* ================= LIKE ================= */

  if (reaction === "like") {

    remark.likes++;

  }


  /* ================= DISLIKE ================= */

  if (reaction === "dislike") {

    remark.dislikes++;

  }


  /*
    Remember reaction for
    this browser session.
  */

  sessionStorage.setItem(

    voteKey,

    reaction

  );


  /*
    Save updated counts.
  */

  localStorage.setItem(

    "anowebRemarks",

    JSON.stringify(remarks)

  );


  /*
    Refresh display.

    This makes the selected
    button become blue or red
    and triggers the pop animation.
  */

  displayRemarks();

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(text) {

  const div =
    document.createElement("div");


  div.textContent =
    text;


  return div.innerHTML;

}


/* =====================================================
   LOAD REMARKS
===================================================== */

displayRemarks()
