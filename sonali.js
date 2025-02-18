let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle Mouse Move
    document.addEventListener("mousemove", (e) => this.movePaper(e));

    // Handle Touch Move
    document.addEventListener("touchmove", (e) => this.movePaper(e));

    // Mouse Down Event
    paper.addEventListener("mousedown", (e) => this.startDrag(e));

    // Touch Start Event
    paper.addEventListener("touchstart", (e) => this.startDrag(e));

    // Mouse Up Event
    window.addEventListener("mouseup", () => this.endDrag());

    // Touch End Event
    window.addEventListener("touchend", () => this.endDrag());
  }

  movePaper(e) {
    let clientX, clientY;

    if (e.type.includes("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (!this.rotating) {
      this.mouseX = clientX;
      this.mouseY = clientY;
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = clientX - this.touchX;
    const dirY = clientY - this.touchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;
    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  startDrag(e) {
    e.preventDefault(); // Prevents scrolling while dragging on touch

    if (this.holdingPaper) return;

    let clientX, clientY;

    if (e.type.includes("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    this.holdingPaper = true;
    e.target.style.zIndex = highestZ++;
    this.touchX = clientX;
    this.touchY = clientY;
    this.prevMouseX = clientX;
    this.prevMouseY = clientY;

    if (e.button === 2) {
      this.rotating = true;
    }
  }

  endDrag() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
