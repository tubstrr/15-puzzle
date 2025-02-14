<script setup>
import { computed, onBeforeMount, ref } from "vue";

// State
const solvedList = ref([]);
const solved = ref(false);
const tiles = ref([]);
const emptyTilePosition = ref(15);
const emptyTileRow = ref(3);
const ham = ref(false);
const colors = ref(true);
const startTime = ref("");
const endTime = ref("");
const totalMoves = ref(0);
const touch = ref({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
});

// Constants
const rows = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

const legalMoves = [
  [2, 5],
  [1, 6, 3],
  [2, 7, 4],
  [3, 8],
  [1, 6, 9],
  [2, 5, 7, 10],
  [3, 6, 8, 11],
  [4, 7, 12],
  [5, 10, 13],
  [6, 9, 11, 14],
  [7, 10, 12, 15],
  [8, 11, 16],
  [9, 14],
  [10, 13, 15],
  [11, 14, 16],
  [12, 15],
];

// Methods
const defineLegalClasses = (position) => {
  if (
    emptyTilePosition.value === position + 4 ||
    emptyTilePosition.value === position + 8 ||
    emptyTilePosition.value === position + 12 ||
    emptyTilePosition.value === position - 4 ||
    emptyTilePosition.value === position - 8 ||
    emptyTilePosition.value === position - 12 ||
    emptyTileRow.value === findRow(position)
  ) {
    return true;
  }
  return false;
};

const checkLegalMove = (clickedTile) => {
  const relativePosition = emptyTilePosition.value - clickedTile;

  if (totalMoves.value === 0) {
    startTime.value = new Date();
  }

  switch (relativePosition) {
    // Cases where tile is directly next to the empty tile
    case 1:
    case -1:
      if (rows[emptyTileRow.value].includes(clickedTile)) {
        swapTiles(clickedTile);
        emptyTilePosition.value = clickedTile;
      }
      break;
    case 4:
    case -4:
      Math.sign(relativePosition) === 1
        ? updateEmptyTileRow(-1)
        : updateEmptyTileRow(1);
      swapTiles(clickedTile);
      emptyTilePosition.value = clickedTile;
      break;

    // Cases where tile is 2 positions away from the empty tile
    case 2:
    case -2:
      if (rows[emptyTileRow.value].includes(clickedTile)) {
        swapMultipleTiles(clickedTile, relativePosition, 2);
        emptyTilePosition.value = clickedTile;
      }
      break;

    case 8:
    case -8:
      Math.sign(relativePosition) === 1
        ? updateEmptyTileRow(-2)
        : updateEmptyTileRow(2);
      swapMultipleTiles(clickedTile, relativePosition, 2);
      emptyTilePosition.value = clickedTile;
      break;

    case 3:
    case -3:
      if (rows[emptyTileRow.value].includes(clickedTile)) {
        swapMultipleTiles(clickedTile, relativePosition, 3);
        emptyTilePosition.value = clickedTile;
      }
      break;
    case 12:
    case -12:
      Math.sign(relativePosition) === 1
        ? updateEmptyTileRow(-3)
        : updateEmptyTileRow(3);
      swapMultipleTiles(clickedTile, relativePosition, 3);
      emptyTilePosition.value = clickedTile;
      break;

    default:
      console.log("This is not a valid tile");
      break;
  }

  totalMoves.value++;

  if (totalMoves.value > 15) {
    endTime.value = new Date();
    checkIfSolved();
  }
};

const updateEmptyTileRow = (moves) => {
  emptyTileRow.value = emptyTileRow.value + moves;
};

const updateTiles = (clickedTile) => {
  tiles.value.splice(
    emptyTilePosition.value,
    1,
    buildUpdatedClickedTile(clickedTile),
  );
  tiles.value.splice(
    clickedTile,
    1,
    buildUpdatedEmptyTile(clickedTile),
  );
};

const swapTiles = (clickedTile) => {
  tiles.value.splice(
    emptyTilePosition.value,
    1,
    buildUpdatedClickedTile(clickedTile),
  );
  tiles.value.splice(
    clickedTile,
    1,
    buildUpdatedEmptyTile(clickedTile),
  );
};

const swapMultipleTiles = (clickedTile, relativePosition, numberOfSwaps) => {
  for (let index = 1; index <= numberOfSwaps; index++) {
    if (index === numberOfSwaps) {
      swapTiles(clickedTile);
    } else if (index === 1 && numberOfSwaps === 3) {
      swapTiles(clickedTile + (relativePosition / numberOfSwaps) * 2);
      emptyTilePosition.value = clickedTile +
        (relativePosition / numberOfSwaps) * 2;
    } else {
      swapTiles(clickedTile + relativePosition / numberOfSwaps);
      emptyTilePosition.value = clickedTile + relativePosition / numberOfSwaps;
    }
  }
};

const buildUpdatedClickedTile = (clickedTile) => {
  const clickedTileJSON = tiles.value[clickedTile];
  return {
    value: clickedTileJSON.value,
    position: emptyTilePosition.value,
    id: clickedTileJSON.id,
  };
};

const buildUpdatedEmptyTile = (clickedTile) => {
  return {
    value: 15,
    position: clickedTile,
    id: "empty",
  };
};

const checkIfSolved = () => {
  if (JSON.stringify(tiles.value) === JSON.stringify(solvedList.value)) {
    solved.value = true;
    return;
  }
  solved.value = false;
};

const scramble = () => {
  for (let index = 0; index < 500; index++) {
    findRandomMove();
  }
  ham.value = false;
  solved.value = false;
  totalMoves.value = 0;
  emptyTileRow.value = findRow(emptyTilePosition.value);
};

const findRandomMove = () => {
  const moves = legalMoves[emptyTilePosition.value];
  const randomIndex = Math.floor(Math.random() * moves.length);
  updateTiles(moves[randomIndex] - 1);
  emptyTilePosition.value = moves[randomIndex] - 1;
};

const findRow = (tilePosition) => {
  if (tilePosition >= 0 && tilePosition <= 3) return 0;
  if (tilePosition >= 4 && tilePosition <= 7) return 1;
  if (tilePosition >= 8 && tilePosition <= 11) return 2;
  if (tilePosition >= 12 && tilePosition <= 15) return 3;
};

const buildList = () => {
  solvedList.value = [];
  tiles.value = [];
  emptyTilePosition.value = 15;

  for (let index = 0; index <= 15; index++) {
    if (index !== emptyTilePosition.value) {
      solvedList.value.push({
        value: index + 1,
        position: index,
        id: index + 1,
      });
      tiles.value.push({ value: index + 1, position: index, id: index + 1 });
    } else {
      solvedList.value.push({
        value: 15,
        position: emptyTilePosition.value,
        id: "empty",
      });
      tiles.value.push({
        value: 15,
        position: emptyTilePosition.value,
        id: "empty",
      });
    }
  }
  ham.value = false;
};

const detectSwipeDirection = (xDiff, yDiff, orthogonalDirection) => {
  if (orthogonalDirection === "horizontal") {
    return xDiff > 0 ? "left" : "right";
  }

  return yDiff > 0 ? "up" : "down";
};

const handleGesture = () => {
  const xDiff = touch.value.start.x - touch.value.end.x;
  const yDiff = touch.value.start.y - touch.value.end.y;

  const swipeThreshold = 50;
  const swipeDistance = Math.abs(xDiff) > Math.abs(yDiff)
    ? Math.abs(xDiff)
    : Math.abs(yDiff);

  if (swipeDistance < swipeThreshold) return;

  const orthogonalDirection = Math.abs(xDiff) > Math.abs(yDiff)
    ? "horizontal"
    : "vertical";
  const swipeDirection = detectSwipeDirection(
    xDiff,
    yDiff,
    orthogonalDirection,
  );

  console.log("🍤 ~ handleGesture ~ swipeDirection:", swipeDirection);

  console.log(
    "🍤 ~ handleGesture ~ emptyTilePosition:",
    emptyTilePosition.value,
  );
  console.log("🍤 ~ handleGesture ~ emptyTileRow:", emptyTileRow.value);

  const columnModulus = emptyTilePosition.value % 4;
  let invertedColumnModulus = 0;
  switch (columnModulus) {
    case 0:
      invertedColumnModulus = 3;
      break;
    case 1:
      invertedColumnModulus = 2;
      break;
    case 2:
      invertedColumnModulus = 1;
      break;
    case 3:
      invertedColumnModulus = 0;
      break;
  }

  const rowModulus = findRow(emptyTilePosition.value) % 4;
  console.log("🍤 ~ handleGesture ~ rowModulus:", rowModulus);
  let invertedRowModulus = 0;
  switch (rowModulus) {
    case 0:
      invertedRowModulus = 3;
      break;
    case 1:
      invertedRowModulus = 2;
      break;
    case 2:
      invertedRowModulus = 1;
      break;
    case 3:
      invertedRowModulus = 0;
      break;
  }

  switch (swipeDirection) {
    case "left":
      checkLegalMove(emptyTilePosition.value + invertedColumnModulus);
      break;
    case "right":
      checkLegalMove(emptyTilePosition.value - columnModulus);
      break;
    case "up":
      checkLegalMove(emptyTilePosition.value + (invertedRowModulus * 4));
      break;
    case "down":
      checkLegalMove(emptyTilePosition.value - (rowModulus * 4));
      // checkLegalMove(emptyTilePosition.value - 4);
      break;
  }
};

const handleSwipe = (event, method) => {
  e.preventDefault();

  switch (method) {
    case "start":
      touch.value.start.x = event.changedTouches[0].clientX;
      touch.value.start.y = event.changedTouches[0].clientY;
      break;
    case "end":
      touch.value.end.x = event.changedTouches[0].clientX;
      touch.value.end.y = event.changedTouches[0].clientY;
      handleGesture();
      break;
  }
};

// Computed
const time = computed(() => {
  const timeInMili = endTime.value - startTime.value;
  const miliToMinutes = 60000;
  const miliToSeconds = 1000;

  const minutes = Math.floor(timeInMili / miliToMinutes);
  const seconds = (timeInMili % miliToMinutes) / miliToSeconds;
  console.log("🍤 ~ time ~ seconds:", seconds);

  return `${minutes}:${
    seconds.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  }`;
});

// Lifecycle hooks
buildList();

onMounted(() => {
  window.addEventListener("touchstart", (event) => {
    handleSwipe(event, "start");
  });
  window.addEventListener("touchend", (event) => {
    handleSwipe(event, "end");
  });
});

onUnmounted(() => {
  window.removeEventListener("touchstart", (event) => {
    handleSwipe(event, "start");
  });
  window.removeEventListener("touchend", (event) => {
    handleSwipe(event, "end");
  });
});
</script>

<template>
  <div id="app">
    <button
      class="hamburger hamburger--squeeze"
      :class='{ "is-active": ham }'
      type="button"
      @click="ham = !ham"
    >
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>
    <div class="solve-inside" :class="{ showing: solved }">
      <span>You solved it!</span>
      <div class="stats">
        <p>
          Time <br />
          <span>{{ time }}</span>
        </p>
        <p>
          Moves <br />
          <span>{{ totalMoves }}</span>
        </p>
      </div>
      <div class="solvedBTNS">
        <button class="scrmble" @click="scramble">Scramble</button>
        <button
          class="scrmble"
          style="margin-left: 1em"
          @click="(solved = !solved), (totalMoves = 0)"
        >
          Close Window
        </button>
      </div>
    </div>
    <transition-group tag="ul" class="board">
      <li
        class="tile"
        v-for="tile in tiles"
        :id="tile.id"
        :key="tile.id"
        :class="
          [
            { legal: defineLegalClasses(tile.position) },
            { red: findRow(tile.id - 1) === 0 && colors },
            { yellow: findRow(tile.id - 1) === 1 && colors },
            { blue: findRow(tile.id - 1) === 2 && colors },
            { green: findRow(tile.id - 1) === 3 && colors },
          ]
        "
        enter-active-class="opacity"
        @click="checkLegalMove(tile.position)"
      >
        <span>{{ tile.value }}</span>
      </li>
    </transition-group>
    <div class="buttons" :class="{ showing: ham }">
      <button class="scrmble" @click="scramble">Scramble</button>
      <button class="solve" @click="buildList">Solve</button>
      <button class="colors" @click="(colors = !colors), (ham = !ham)">
        Turn tile colors <span v-if="colors">off</span>
        <span v-else>on</span>
      </button>
    </div>
  </div>
</template>

<style>
* {
  font-family: "Ubuntu", sans-serif;
}

body {
  margin: 0;
}

#app {
  background: #004643;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
}

.board {
  background: #0f3433;
  width: clamp(50vw, 750px, 80vw);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5em;
  padding: 0.5em;
  box-shadow: 0px 6px 10px -5px rgba(0, 0, 0, 0.1);
  border-radius: 0.3em;
  overflow: hidden;
}

.tile {
  position: relative;
  padding-bottom: 100%;
  border-radius: 0.3em;
  transition: 175ms;
  background: white;
  user-select: none;
  cursor: pointer;
  box-shadow: 0px 4px 6px -3px rgba(0, 0, 0, 0.1);
  list-style: none;
}
.red {
  background: #b76e6e;
}
.blue {
  background: #6e81b7;
}
.green {
  background: #6eb784;
}
.yellow {
  background: #a5b76e;
}

.tile.legal {
  cursor: pointer;
}
.tile.legal:hover {
  opacity: 0.95;
}

.tile span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(2em, 10vw, 4em);
}

#empty {
  opacity: 0;
  cursor: default;
  visibility: hidden;
}

.buttons {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: hsl(0, 0%, 20%);
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  /* left:200vw; */
  opacity: 0;
  visibility: hidden;
  transition: 300ms ease-in-out;
}
.buttons.showing {
  visibility: visible;
  opacity: 1;
}
.buttons button {
  background: transparent;
  border: 0;
  font-size: calc(1vw + 2em);
  color: white;
  font-weight: 900;
  line-height: 1.4em;
  transition: 275ms ease-in-out;
  cursor: pointer;
}
.buttons button:hover {
  opacity: 0.5;
  transform: scale(1.1);
  color: cyan;
}
.hamburger {
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
}
.hamburger,
.hamburger * {
  color: white;
}
.hamburger .hamburger-inner:before,
.hamburger .hamburger-inner:after,
.hamburger .hamburger-inner {
  background-color: white !important;
}

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */

.solve-inside.showing {
  opacity: 1;
  visibility: visible;
}

.solve-inside {
  opacity: 0;
  visibility: hidden;
  position: fixed;
  background: hsl(66deg 100% 14% / 96%);
  z-index: 1;
  width: clamp(50vw, 750px, 80vw);
  height: clamp(50vw, 750px, 80vw);
  border-radius: 0.3em;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 275ms ease-in-out;
}
.solve-inside button {
  background: transparent;
  color: white;
  border: 1px solid;
  padding: 0.5em 1em;
  margin-top: 2em;
  font-size: 1em;
  cursor: pointer;
  transition: 200ms ease-in-out;
}
.solve-inside button:hover {
  transform: scale(1.1);
  opacity: 0.85;
}

.solve-inside span {
  font-size: 2em;
  font-weight: 900;
  color: white;
  font-size: calc(1vw + 2em);
}

.stats {
  display: flex;
  justify-content: space-between;
  width: 24em;
  background: white;
  border-radius: 0.3em;
  box-shadow: 0px 10px 14px -10px black;
  overflow: hidden;
  padding: 3rem;
  margin-top: 1rem;
  max-width: 80%;
}

.stats p {
  font-size: 1.2em;
  font-weight: bold;
  color: #6e81b7;
}
.stats p span {
  color: #6e81b7;
}

.hamburger {
  font: inherit;
  display: inline-block;
  overflow: visible;
  margin: 0;
  padding: 15px;
  cursor: pointer;
  transition-timing-function: linear;
  transition-duration: 0.15s;
  transition-property: opacity, filter;
  text-transform: none;
  color: inherit;
  border: 0;
  background-color: transparent;
}
.hamburger.is-active:hover,
.hamburger:hover {
  opacity: 0.7;
}
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner:after,
.hamburger.is-active .hamburger-inner:before {
  background-color: #000;
}
.hamburger-box {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}
.hamburger-inner {
  top: 50%;
  display: block;
  margin-top: -2px;
}
.hamburger-inner,
.hamburger-inner:after,
.hamburger-inner:before {
  position: absolute;
  width: 40px;
  height: 4px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform;
  border-radius: 4px;
  background-color: #000;
}
.hamburger-inner:after,
.hamburger-inner:before {
  display: block;
  content: "";
}
.hamburger-inner:before {
  top: -10px;
}
.hamburger-inner:after {
  bottom: -10px;
}
.hamburger--3dx .hamburger-box {
  perspective: 80px;
}
.hamburger--3dx .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dx .hamburger-inner:after,
.hamburger--3dx .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dx.is-active .hamburger-inner {
  transform: rotateY(180deg);
  background-color: transparent !important;
}
.hamburger--3dx.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dx.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--3dx-r .hamburger-box {
  perspective: 80px;
}
.hamburger--3dx-r .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dx-r .hamburger-inner:after,
.hamburger--3dx-r .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dx-r.is-active .hamburger-inner {
  transform: rotateY(-180deg);
  background-color: transparent !important;
}
.hamburger--3dx-r.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dx-r.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--3dy .hamburger-box {
  perspective: 80px;
}
.hamburger--3dy .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dy .hamburger-inner:after,
.hamburger--3dy .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dy.is-active .hamburger-inner {
  transform: rotateX(-180deg);
  background-color: transparent !important;
}
.hamburger--3dy.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dy.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--3dy-r .hamburger-box {
  perspective: 80px;
}
.hamburger--3dy-r .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dy-r .hamburger-inner:after,
.hamburger--3dy-r .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dy-r.is-active .hamburger-inner {
  transform: rotateX(180deg);
  background-color: transparent !important;
}
.hamburger--3dy-r.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dy-r.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--3dxy .hamburger-box {
  perspective: 80px;
}
.hamburger--3dxy .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dxy .hamburger-inner:after,
.hamburger--3dxy .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dxy.is-active .hamburger-inner {
  transform: rotateX(180deg) rotateY(180deg);
  background-color: transparent !important;
}
.hamburger--3dxy.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dxy.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--3dxy-r .hamburger-box {
  perspective: 80px;
}
.hamburger--3dxy-r .hamburger-inner {
  transition:
    transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    background-color 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dxy-r .hamburger-inner:after,
.hamburger--3dxy-r .hamburger-inner:before {
  transition: transform 0s cubic-bezier(0.645, 0.045, 0.355, 1) 0.1s;
}
.hamburger--3dxy-r.is-active .hamburger-inner {
  transform: rotateX(180deg) rotateY(180deg) rotate(-180deg);
  background-color: transparent !important;
}
.hamburger--3dxy-r.is-active .hamburger-inner:before {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--3dxy-r.is-active .hamburger-inner:after {
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--arrow.is-active .hamburger-inner:before {
  transform: translate3d(-8px, 0, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrow.is-active .hamburger-inner:after {
  transform: translate3d(-8px, 0, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--arrow-r.is-active .hamburger-inner:before {
  transform: translate3d(8px, 0, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--arrow-r.is-active .hamburger-inner:after {
  transform: translate3d(8px, 0, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrowalt .hamburger-inner:before {
  transition:
    top 0.1s ease 0.1s,
    transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hamburger--arrowalt .hamburger-inner:after {
  transition:
    bottom 0.1s ease 0.1s,
    transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hamburger--arrowalt.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s ease,
    transform 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22) 0.1s;
  transform: translate3d(-8px, -10px, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrowalt.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 0.1s ease,
    transform 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22) 0.1s;
  transform: translate3d(-8px, 10px, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--arrowalt-r .hamburger-inner:before {
  transition:
    top 0.1s ease 0.1s,
    transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hamburger--arrowalt-r .hamburger-inner:after {
  transition:
    bottom 0.1s ease 0.1s,
    transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hamburger--arrowalt-r.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s ease,
    transform 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22) 0.1s;
  transform: translate3d(8px, -10px, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--arrowalt-r.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 0.1s ease,
    transform 0.1s cubic-bezier(0.895, 0.03, 0.685, 0.22) 0.1s;
  transform: translate3d(8px, 10px, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrowturn.is-active .hamburger-inner {
  transform: rotate(-180deg);
}
.hamburger--arrowturn.is-active .hamburger-inner:before {
  transform: translate3d(8px, 0, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--arrowturn.is-active .hamburger-inner:after {
  transform: translate3d(8px, 0, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrowturn-r.is-active .hamburger-inner {
  transform: rotate(-180deg);
}
.hamburger--arrowturn-r.is-active .hamburger-inner:before {
  transform: translate3d(-8px, 0, 0) rotate(-45deg) scaleX(0.7);
}
.hamburger--arrowturn-r.is-active .hamburger-inner:after {
  transform: translate3d(-8px, 0, 0) rotate(45deg) scaleX(0.7);
}
.hamburger--boring .hamburger-inner,
.hamburger--boring .hamburger-inner:after,
.hamburger--boring .hamburger-inner:before {
  transition-property: none;
}
.hamburger--boring.is-active .hamburger-inner {
  transform: rotate(45deg);
}
.hamburger--boring.is-active .hamburger-inner:before {
  top: 0;
  opacity: 0;
}
.hamburger--boring.is-active .hamburger-inner:after {
  bottom: 0;
  transform: rotate(-90deg);
}
.hamburger--collapse .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-delay: 0.13s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.13s;
}
.hamburger--collapse .hamburger-inner:after {
  top: -20px;
  transition:
    top 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    opacity 0.1s linear;
}
.hamburger--collapse .hamburger-inner:before {
  transition:
    top 0.12s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--collapse.is-active .hamburger-inner {
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--collapse.is-active .hamburger-inner:after {
  top: 0;
  transition:
    top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
    opacity 0.1s linear 0.22s;
  opacity: 0;
}
.hamburger--collapse.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s cubic-bezier(0.33333, 0, 0.66667, 0.33333) 0.16s,
    transform 0.13s cubic-bezier(0.215, 0.61, 0.355, 1) 0.25s;
  transform: rotate(-90deg);
}
.hamburger--collapse-r .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-delay: 0.13s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.13s;
}
.hamburger--collapse-r .hamburger-inner:after {
  top: -20px;
  transition:
    top 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    opacity 0.1s linear;
}
.hamburger--collapse-r .hamburger-inner:before {
  transition:
    top 0.12s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--collapse-r.is-active .hamburger-inner {
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translate3d(0, -10px, 0) rotate(45deg);
}
.hamburger--collapse-r.is-active .hamburger-inner:after {
  top: 0;
  transition:
    top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
    opacity 0.1s linear 0.22s;
  opacity: 0;
}
.hamburger--collapse-r.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s cubic-bezier(0.33333, 0, 0.66667, 0.33333) 0.16s,
    transform 0.13s cubic-bezier(0.215, 0.61, 0.355, 1) 0.25s;
  transform: rotate(90deg);
}
.hamburger--elastic .hamburger-inner {
  top: 2px;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-duration: 0.275s;
}
.hamburger--elastic .hamburger-inner:before {
  top: 10px;
  transition: opacity 0.125s ease 0.275s;
}
.hamburger--elastic .hamburger-inner:after {
  top: 20px;
  transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.hamburger--elastic.is-active .hamburger-inner {
  transition-delay: 75ms;
  transform: translate3d(0, 10px, 0) rotate(135deg);
}
.hamburger--elastic.is-active .hamburger-inner:before {
  transition-delay: 0s;
  opacity: 0;
}
.hamburger--elastic.is-active .hamburger-inner:after {
  transition-delay: 75ms;
  transform: translate3d(0, -20px, 0) rotate(-270deg);
}
.hamburger--elastic-r .hamburger-inner {
  top: 2px;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-duration: 0.275s;
}
.hamburger--elastic-r .hamburger-inner:before {
  top: 10px;
  transition: opacity 0.125s ease 0.275s;
}
.hamburger--elastic-r .hamburger-inner:after {
  top: 20px;
  transition: transform 0.275s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.hamburger--elastic-r.is-active .hamburger-inner {
  transition-delay: 75ms;
  transform: translate3d(0, 10px, 0) rotate(-135deg);
}
.hamburger--elastic-r.is-active .hamburger-inner:before {
  transition-delay: 0s;
  opacity: 0;
}
.hamburger--elastic-r.is-active .hamburger-inner:after {
  transition-delay: 75ms;
  transform: translate3d(0, -20px, 0) rotate(270deg);
}
.hamburger--emphatic {
  overflow: hidden;
}
.hamburger--emphatic .hamburger-inner {
  transition: background-color 0.125s ease-in 0.175s;
}
.hamburger--emphatic .hamburger-inner:before {
  left: 0;
  transition:
    transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
    top 0.05s linear 0.125s,
    left 0.125s ease-in 0.175s;
}
.hamburger--emphatic .hamburger-inner:after {
  top: 10px;
  right: 0;
  transition:
    transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
    top 0.05s linear 0.125s,
    right 0.125s ease-in 0.175s;
}
.hamburger--emphatic.is-active .hamburger-inner {
  transition-delay: 0s;
  transition-timing-function: ease-out;
  background-color: transparent !important;
}
.hamburger--emphatic.is-active .hamburger-inner:before {
  top: -80px;
  left: -80px;
  transition:
    left 0.125s ease-out,
    top 0.05s linear 0.125s,
    transform 0.125s cubic-bezier(0.075, 0.82, 0.165, 1) 0.175s;
  transform: translate3d(80px, 80px, 0) rotate(45deg);
}
.hamburger--emphatic.is-active .hamburger-inner:after {
  top: -80px;
  right: -80px;
  transition:
    right 0.125s ease-out,
    top 0.05s linear 0.125s,
    transform 0.125s cubic-bezier(0.075, 0.82, 0.165, 1) 0.175s;
  transform: translate3d(-80px, 80px, 0) rotate(-45deg);
}
.hamburger--emphatic-r {
  overflow: hidden;
}
.hamburger--emphatic-r .hamburger-inner {
  transition: background-color 0.125s ease-in 0.175s;
}
.hamburger--emphatic-r .hamburger-inner:before {
  left: 0;
  transition:
    transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
    top 0.05s linear 0.125s,
    left 0.125s ease-in 0.175s;
}
.hamburger--emphatic-r .hamburger-inner:after {
  top: 10px;
  right: 0;
  transition:
    transform 0.125s cubic-bezier(0.6, 0.04, 0.98, 0.335),
    top 0.05s linear 0.125s,
    right 0.125s ease-in 0.175s;
}
.hamburger--emphatic-r.is-active .hamburger-inner {
  transition-delay: 0s;
  transition-timing-function: ease-out;
  background-color: transparent !important;
}
.hamburger--emphatic-r.is-active .hamburger-inner:before {
  top: 80px;
  left: -80px;
  transition:
    left 0.125s ease-out,
    top 0.05s linear 0.125s,
    transform 0.125s cubic-bezier(0.075, 0.82, 0.165, 1) 0.175s;
  transform: translate3d(80px, -80px, 0) rotate(-45deg);
}
.hamburger--emphatic-r.is-active .hamburger-inner:after {
  top: 80px;
  right: -80px;
  transition:
    right 0.125s ease-out,
    top 0.05s linear 0.125s,
    transform 0.125s cubic-bezier(0.075, 0.82, 0.165, 1) 0.175s;
  transform: translate3d(-80px, -80px, 0) rotate(45deg);
}
.hamburger--minus .hamburger-inner:after,
.hamburger--minus .hamburger-inner:before {
  transition:
    bottom 0.08s ease-out 0s,
    top 0.08s ease-out 0s,
    opacity 0s linear;
}
.hamburger--minus.is-active .hamburger-inner:after,
.hamburger--minus.is-active .hamburger-inner:before {
  transition:
    bottom 0.08s ease-out,
    top 0.08s ease-out,
    opacity 0s linear 0.08s;
  opacity: 0;
}
.hamburger--minus.is-active .hamburger-inner:before {
  top: 0;
}
.hamburger--minus.is-active .hamburger-inner:after {
  bottom: 0;
}
.hamburger--slider .hamburger-inner {
  top: 2px;
}
.hamburger--slider .hamburger-inner:before {
  top: 10px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform, opacity;
}
.hamburger--slider .hamburger-inner:after {
  top: 20px;
}
.hamburger--slider.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--slider.is-active .hamburger-inner:before {
  transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
  opacity: 0;
}
.hamburger--slider.is-active .hamburger-inner:after {
  transform: translate3d(0, -20px, 0) rotate(-90deg);
}
.hamburger--slider-r .hamburger-inner {
  top: 2px;
}
.hamburger--slider-r .hamburger-inner:before {
  top: 10px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform, opacity;
}
.hamburger--slider-r .hamburger-inner:after {
  top: 20px;
}
.hamburger--slider-r.is-active .hamburger-inner {
  transform: translate3d(0, 10px, 0) rotate(-45deg);
}
.hamburger--slider-r.is-active .hamburger-inner:before {
  transform: rotate(45deg) translate3d(5.71429px, -6px, 0);
  opacity: 0;
}
.hamburger--slider-r.is-active .hamburger-inner:after {
  transform: translate3d(0, -20px, 0) rotate(90deg);
}
.hamburger--spin .hamburger-inner {
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.22s;
}
.hamburger--spin .hamburger-inner:before {
  transition: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
}
.hamburger--spin .hamburger-inner:after {
  transition:
    bottom 0.1s ease-in 0.25s,
    transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--spin.is-active .hamburger-inner {
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: rotate(225deg);
}
.hamburger--spin.is-active .hamburger-inner:before {
  top: 0;
  transition: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
  opacity: 0;
}
.hamburger--spin.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 0.1s ease-out,
    transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  transform: rotate(-90deg);
}
.hamburger--spin-r .hamburger-inner {
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.22s;
}
.hamburger--spin-r .hamburger-inner:before {
  transition: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
}
.hamburger--spin-r .hamburger-inner:after {
  transition:
    bottom 0.1s ease-in 0.25s,
    transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--spin-r.is-active .hamburger-inner {
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: rotate(-225deg);
}
.hamburger--spin-r.is-active .hamburger-inner:before {
  top: 0;
  transition: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
  opacity: 0;
}
.hamburger--spin-r.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 0.1s ease-out,
    transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  transform: rotate(90deg);
}
.hamburger--spring .hamburger-inner {
  top: 2px;
  transition: background-color 0s linear 0.13s;
}
.hamburger--spring .hamburger-inner:before {
  top: 10px;
  transition:
    top 0.1s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--spring .hamburger-inner:after {
  top: 20px;
  transition:
    top 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--spring.is-active .hamburger-inner {
  transition-delay: 0.22s;
  background-color: transparent !important;
}
.hamburger--spring.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s cubic-bezier(0.33333, 0, 0.66667, 0.33333) 0.15s,
    transform 0.13s cubic-bezier(0.215, 0.61, 0.355, 1) 0.22s;
  transform: translate3d(0, 10px, 0) rotate(45deg);
}
.hamburger--spring.is-active .hamburger-inner:after {
  top: 0;
  transition:
    top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
    transform 0.13s cubic-bezier(0.215, 0.61, 0.355, 1) 0.22s;
  transform: translate3d(0, 10px, 0) rotate(-45deg);
}
.hamburger--spring-r .hamburger-inner {
  top: auto;
  bottom: 0;
  transition-delay: 0s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.13s;
}
.hamburger--spring-r .hamburger-inner:after {
  top: -20px;
  transition:
    top 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    opacity 0s linear;
}
.hamburger--spring-r .hamburger-inner:before {
  transition:
    top 0.1s cubic-bezier(0.33333, 0.66667, 0.66667, 1) 0.2s,
    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--spring-r.is-active .hamburger-inner {
  transition-delay: 0.22s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translate3d(0, -10px, 0) rotate(-45deg);
}
.hamburger--spring-r.is-active .hamburger-inner:after {
  top: 0;
  transition:
    top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
    opacity 0s linear 0.22s;
  opacity: 0;
}
.hamburger--spring-r.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 0.1s cubic-bezier(0.33333, 0, 0.66667, 0.33333) 0.15s,
    transform 0.13s cubic-bezier(0.215, 0.61, 0.355, 1) 0.22s;
  transform: rotate(90deg);
}
.hamburger--stand .hamburger-inner {
  transition:
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.15s,
    background-color 0s linear 75ms;
}
.hamburger--stand .hamburger-inner:before {
  transition:
    top 75ms ease-in 75ms,
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s;
}
.hamburger--stand .hamburger-inner:after {
  transition:
    bottom 75ms ease-in 75ms,
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s;
}
.hamburger--stand.is-active .hamburger-inner {
  transition:
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s,
    background-color 0s linear 0.15s;
  transform: rotate(90deg);
  background-color: transparent !important;
}
.hamburger--stand.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 75ms ease-out 0.1s,
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0.15s;
  transform: rotate(-45deg);
}
.hamburger--stand.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 75ms ease-out 0.1s,
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0.15s;
  transform: rotate(45deg);
}
.hamburger--stand-r .hamburger-inner {
  transition:
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0.15s,
    background-color 0s linear 75ms;
}
.hamburger--stand-r .hamburger-inner:before {
  transition:
    top 75ms ease-in 75ms,
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s;
}
.hamburger--stand-r .hamburger-inner:after {
  transition:
    bottom 75ms ease-in 75ms,
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19) 0s;
}
.hamburger--stand-r.is-active .hamburger-inner {
  transition:
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s,
    background-color 0s linear 0.15s;
  transform: rotate(-90deg);
  background-color: transparent !important;
}
.hamburger--stand-r.is-active .hamburger-inner:before {
  top: 0;
  transition:
    top 75ms ease-out 0.1s,
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0.15s;
  transform: rotate(-45deg);
}
.hamburger--stand-r.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 75ms ease-out 0.1s,
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0.15s;
  transform: rotate(45deg);
}
.hamburger--squeeze .hamburger-inner {
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 75ms;
}
.hamburger--squeeze .hamburger-inner:before {
  transition: top 75ms ease 0.12s, opacity 75ms ease;
}
.hamburger--squeeze .hamburger-inner:after {
  transition:
    bottom 75ms ease 0.12s,
    transform 75ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--squeeze.is-active .hamburger-inner {
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: rotate(45deg);
}
.hamburger--squeeze.is-active .hamburger-inner:before {
  top: 0;
  transition: top 75ms ease, opacity 75ms ease 0.12s;
  opacity: 0;
}
.hamburger--squeeze.is-active .hamburger-inner:after {
  bottom: 0;
  transition:
    bottom 75ms ease,
    transform 75ms cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  transform: rotate(-90deg);
}
.hamburger--vortex .hamburger-inner {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 0.2s;
}
.hamburger--vortex .hamburger-inner:after,
.hamburger--vortex .hamburger-inner:before {
  transition-delay: 0.1s;
  transition-timing-function: linear;
  transition-duration: 0s;
}
.hamburger--vortex .hamburger-inner:before {
  transition-property: top, opacity;
}
.hamburger--vortex .hamburger-inner:after {
  transition-property: bottom, transform;
}
.hamburger--vortex.is-active .hamburger-inner {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(765deg);
}
.hamburger--vortex.is-active .hamburger-inner:after,
.hamburger--vortex.is-active .hamburger-inner:before {
  transition-delay: 0s;
}
.hamburger--vortex.is-active .hamburger-inner:before {
  top: 0;
  opacity: 0;
}
.hamburger--vortex.is-active .hamburger-inner:after {
  bottom: 0;
  transform: rotate(90deg);
}
.hamburger--vortex-r .hamburger-inner {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 0.2s;
}
.hamburger--vortex-r .hamburger-inner:after,
.hamburger--vortex-r .hamburger-inner:before {
  transition-delay: 0.1s;
  transition-timing-function: linear;
  transition-duration: 0s;
}
.hamburger--vortex-r .hamburger-inner:before {
  transition-property: top, opacity;
}
.hamburger--vortex-r .hamburger-inner:after {
  transition-property: bottom, transform;
}
.hamburger--vortex-r.is-active .hamburger-inner {
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  transform: rotate(-765deg);
}
.hamburger--vortex-r.is-active .hamburger-inner:after,
.hamburger--vortex-r.is-active .hamburger-inner:before {
  transition-delay: 0s;
}
.hamburger--vortex-r.is-active .hamburger-inner:before {
  top: 0;
  opacity: 0;
}
.hamburger--vortex-r.is-active .hamburger-inner:after {
  bottom: 0;
  transform: rotate(-90deg);
}
</style>
