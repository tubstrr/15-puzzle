<script setup>
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
    <!-- <NuxtPwaManifest /> -->
    <VitePwaManifest />
    <main>
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
    </main>
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
