let cont = document.getElementById("container");

const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let isDragging = false,
  prevPagex,
  prevScrollLeft,
  positionDiff;

cont.scrollLeft = cont.children[2].offsetLeft;



function handleScrollEnd() {
  if (this.scrollWidth - 2 <= this.scrollLeft + cont.offsetWidth) {
    this.removeEventListener("scroll", handleScrollEnd);

    appendItems(this);
  }
}

function handleScrollBeg() {
  if (this.scrollLeft === 0) {
    this.removeEventListener("scroll", handleScrollBeg);

    prependItems(this);
  }
}

function appendItems(element) {
  element.append(element.children[0]);
  element.append(element.children[0]);
  element.scrollLeft = cont.children[2].offsetLeft;
  movingEnd();
}

function prependItems(element) {
  element.prepend(element.children[element.children.length - 1]);
  element.prepend(element.children[element.children.length - 1]);
  element.scrollLeft = cont.children[2].offsetLeft;
  movingEnd();
}

function movingForward() {
  cont.scrollTo({ left: cont.scrollWidth +5, behavior: "smooth" });
  movingStart();

  cont.addEventListener("scroll", handleScrollEnd, { passive: true });
  
}

function movingBackward() {
  cont.scrollTo({ left: 0, behavior: "smooth" });

  movingStart();

  cont.addEventListener("scroll", handleScrollBeg, { passive: true });
}

next.addEventListener("click", function () {
  movingForward();
});

prev.addEventListener("click", function () {
  movingBackward();
});

cont.addEventListener(
  "touchstart",
  function (e) {
    isDragging = true;
    prevPagex = e.touches[0].clientX;
    prevScrollLeft = this.scrollLeft;
  },
  { passive: true }
);

cont.addEventListener(
  "touchend",
  function (e) {
    let ScrollEnd = Math.ceil(this.offsetWidth + this.scrollLeft);
    isDragging = false;

    if (!positionDiff) return;

    movingStart();

    if (ScrollEnd === this.scrollWidth) {
      appendItems(this);
      return;
    } else if (this.scrollLeft === 0) {
      prependItems(this);
      return;
    }
    autoSlide();
    positionDiff = 0;
  },
  { passive: true }
);

cont.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    //e.preventDefault();
    let x = e.touches[0].clientX;

    positionDiff = x - prevPagex;
    this.scrollLeft = prevScrollLeft - positionDiff;
  },
  { passive: true }
);

const autoSlide = () => {
  if (
    cont.scrollLeft - (cont.scrollWidth - cont.clientWidth) > -1 ||
    cont.scrollLeft <= 0
  )
    return;

  positionDiff = Math.abs(positionDiff);
  let imageWidth = cont.clientWidth;
  theDifference = imageWidth - positionDiff;

  if (cont.scrollLeft > prevScrollLeft) {
    positionDiff < imageWidth / 5 ? goback(positionDiff) : movingForward();
    return;
  } else {
    positionDiff > imageWidth / 5 ? movingBackward() : goback(-positionDiff);
    return;
  }
};

let stillScolling;
function gobackEvent() {
  if (stillScolling) {
    clearTimeout(stillScolling);
  }
  stillScolling = setTimeout(() => {
    this.removeEventListener("scroll", gobackEvent);
    movingEnd();
    dragDone = true;
  }, 50);
}

function goback(back) {
  cont.addEventListener("scroll", gobackEvent, { passive: true });

  cont.scrollBy({
    top: 0,
    left: -back,
    behavior: "smooth",
  });
}

function movingStart() {
  //cont.style.backgroundColor = "purple";
  cont.style.zIndex = "-1";
  next.disabled = true;
  prev.disabled = true;
}

function movingEnd() {
  //cont.style.backgroundColor = "";
  cont.style.zIndex = "";
  next.disabled = false;
  prev.disabled = false;
  console.log('end')
}


window.addEventListener("resize", function () {
  cont.scrollLeft = cont.children[2].offsetLeft;
  movingEnd();
});