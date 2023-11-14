const MIN_COMMIT_SIZE = 1;

window.onload = async function () {
  const bar = createBar();
  const btnWrapper = createButtonWrapper(bar);
  const currentHref = window.location.href;
  const uri = new URL(currentHref);

  if (currentHref.includes("/pull-requests/")) {
    let uriSlice = uri.pathname.split("/pull-requests/");
    if (uriSlice.length <= 1) {
      return;
    }

    const [repo, pull_request_id] = uriSlice;

    const response = await fetch(
      `https://bitbucket.org/!api/2.0/repositories${repo}/pullrequests/${pull_request_id}/commits`
    );
    const data = await response.json();
    const commitIds = data.values.map((obj) => obj.hash);

    if (commitIds.length > MIN_COMMIT_SIZE) {
      let button = document.createElement("button");
      button.innerText = "Review by commits";
      button.style.color = "red";
      button.style.margin = "20px";
      button.style.width = "200px";
      button.style.height = "30px";
      button.style.fontSize = "20px";

      const lastCommit = commitIds[commitIds.length - 1];
      const lastCommitLink = `https://bitbucket.org${repo}/commits/${lastCommit}`;
      const openLink =
        lastCommitLink + "?cids=" + commitIds.reverse().join(",");

      button.onclick = function () {
        window.open(openLink, "_blank");
      };

      btnWrapper.appendChild(button);

      showBar(bar);
    }
  }

  if (currentHref.includes("/commits/") && uri.searchParams.has("cids")) {
    let cidArray = uri.searchParams.get("cids").split(",");
    let id = uri.pathname.split("/commits/")[1];
    let indexOfCurrentId = cidArray.indexOf(id);

    let prevId = indexOfCurrentId > 0 ? cidArray[indexOfCurrentId - 1] : null;
    let nextId =
      indexOfCurrentId < cidArray.length - 1
        ? cidArray[indexOfCurrentId + 1]
        : null;

    let shouldShowBar = false;
    if (prevId !== null) {
      generateButton(
        {
          name: "Prev commit",
          color: "red",
          commitId: prevId,
        },
        currentHref,
        cidArray,
        btnWrapper
      );
      shouldShowBar = true;
    }

    if (nextId !== null) {
      generateButton(
        {
          name: "Next commit",
          color: "red",
          commitId: nextId,
        },
        currentHref,
        cidArray,
        btnWrapper
      );
      shouldShowBar = true;
    }

    if (shouldShowBar) {
      showBar(bar);
    }
  }
};

const createBar = () => {
  let bar = document.createElement("div");
  bar.style.position = "fixed";
  bar.style.bottom = "0px";
  bar.style.left = "0px";
  bar.style.width = "100%";
  bar.style.height = "7%";
  bar.style.backgroundColor = "black";
  bar.style.display = "hide";
  bar.style.justifyContent = "center";
  bar.style.zIndex = "9999";

  return bar;
};

const createButtonWrapper = (bar) => {
  let btnWrapper = document.createElement("div");
  bar.appendChild(btnWrapper);

  return btnWrapper;
};

const showBar = (bar) => {
  bar.style.display = "flex";
  document.body.appendChild(bar);
};

const generateButton = (params, currentHref, cidArray, btnWrapper) => {
  let button = document.createElement("button");
  button.innerText = params.name;
  button.style.color = params.color;
  button.style.margin = "20px";
  button.style.width = "200px";
  button.style.height = "30px";
  button.style.fontSize = "20px";

  openNextLink =
    currentHref.split("/commits/")[0] +
    "/commits/" +
    params.commitId +
    "?cids=" +
    cidArray.join(",");

  button.onclick = function () {
    window.location.href = openNextLink;
  };

  btnWrapper.appendChild(button);
};
