"use strict";


const LINK_URL = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=-9QpTaaMSk-E8ltFvQxunz1G0_oipptKp3M_sk3ROadUQVY2SEg0TVFSTjk4RFlSMVNUMDhWOFJQTS4u"; // 
const CLICKS_NEEDED = 40;

const TEETH = ["img/muela1.png", "img/muela2.png", "img/muela3.png"];
const STAGES = [
  { h: "Haz tu trabajo mas facil", s: "y ayudanos a completar la transformacion tecnologica", top: "trabajo mas facil", tile: 3 },
  { h: "Vamos arrancando, no pares", s: "la transformacion tecnologica esta cerca.", top: "Continua, no pares", tile: 1 },
  { h: "¡Has completado la tarea con exito!", tile: 0 }
];

const byId = (id) => document.getElementById(id);
const tiles = [...document.querySelectorAll(".side img")];
let clicks = 0;
let currentStage = -1;

const targetLink = byId("link");
targetLink.href = LINK_URL;

function render() {
  const progress = Math.min(clicks / CLICKS_NEEDED, 1);
  const nextStage = progress >= 1 ? 2 : progress >= 0.3 ? 1 : 0;

  byId("fill").style.height = `${progress * 100}%`;
  byId("bar").setAttribute("aria-valuenow", String(Math.round(progress * 100)));

  if (nextStage === currentStage) return;
  currentStage = nextStage;

  const state = STAGES[nextStage];
  const completed = nextStage === 2;

  byId("h1").textContent = state.h;
  byId("tooth").src = TEETH[nextStage];
  byId("brand").hidden = completed;
  byId("sub").hidden = completed;
  byId("key").hidden = completed;
  byId("win").hidden = !completed;

  if (!completed) {
    byId("sub").textContent = state.s;
    byId("top").textContent = state.top;
  }

  tiles.forEach((tile, index) => tile.classList.toggle("on", index === state.tile));
  document.querySelectorAll(".spark").forEach((spark) => spark.remove());

  if (completed) {
    [[8, 18], [88, 30], [12, 70], [84, 76]].forEach(([x, y]) => {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.textContent = "★";
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
      byId("stage").appendChild(spark);
    });
    targetLink.focus({ preventScroll: true });
  }
}

function hit() {
  if (clicks >= CLICKS_NEEDED) return;

  clicks += 1;
  render();

  const keyRect = byId("key").getBoundingClientRect();
  const mainRect = document.querySelector(".main").getBoundingClientRect();
  const point = document.createElement("span");
  point.className = "plus";
  point.textContent = "+1";
  point.style.left = `${keyRect.left - mainRect.left + keyRect.width * (0.25 + Math.random() * 0.5)}px`;
  point.style.top = `${keyRect.top - mainRect.top - 8}px`;
  document.querySelector(".main").appendChild(point);
  window.setTimeout(() => point.remove(), 700);

  const stage = byId("stage");
  stage.classList.remove("pop");
  void stage.offsetWidth;
  stage.classList.add("pop");
}

byId("key").addEventListener("click", hit);
byId("stage").addEventListener("click", () => {
  if (currentStage < 2) hit();
});
byId("again").addEventListener("click", () => {
  clicks = 0;
  currentStage = -1;
  render();
});

render();
