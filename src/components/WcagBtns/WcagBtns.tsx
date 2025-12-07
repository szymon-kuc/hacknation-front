"use client";
import ContrastIcon from "@mui/icons-material/Contrast";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import "@/components/WcagBtns/style/wcagBtns.css";

export default function WcagBtns() {
  const contrastToggle = () => {
    document.body.classList.toggle("wcag-contrast");
    document.querySelector(".btn-wcag--contrast")?.classList.toggle("active");
  };

  const fontSizeToggle = (increase: boolean) => {
    const currentFontSize = window
      .getComputedStyle(document.body)
      .getPropertyValue("font-size");
    let currentSizeNumber = parseFloat(currentFontSize);

    if (increase) {
      currentSizeNumber += 2;
      document.body.style.fontSize = `${Math.min(currentSizeNumber, 20)}px`;
    } else {
      currentSizeNumber -= 2;
      document.body.style.fontSize = `${Math.max(currentSizeNumber, 12)}px`;
    }

    if (currentSizeNumber > 16) {
      document
        .querySelector(".btn-wcag--font-size-increse")
        ?.classList.add("active");
      document
        .querySelector(".btn-wcag--font-size-decrese")
        ?.classList.remove("active");
    } else if (currentSizeNumber < 16) {
      document
        .querySelector(".btn-wcag--font-size-increse")
        ?.classList.remove("active");
      document
        .querySelector(".btn-wcag--font-size-decrese")
        ?.classList.add("active");
    } else {
      document
        .querySelector(".btn-wcag--font-size-increse")
        ?.classList.remove("active");
      document
        .querySelector(".btn-wcag--font-size-decrese")
        ?.classList.remove("active");
    }
  };

  return (
    <div className="wcag-btns">
      <button
        onClick={contrastToggle}
        className="btn-wcag btn-secondary-reverse btn-wcag--contrast"
      >
        <ContrastIcon fontSize="small" />
      </button>
      <button
        onClick={() => fontSizeToggle(false)}
        className="btn-wcag btn-secondary-reverse btn-wcag--font-size-decrese"
      >
        <TextDecreaseIcon fontSize="small" />
      </button>
      <button
        onClick={() => fontSizeToggle(true)}
        className="btn-wcag btn-secondary-reverse btn-wcag--font-size-increse"
      >
        <TextIncreaseIcon fontSize="small" />
      </button>
    </div>
  );
}
