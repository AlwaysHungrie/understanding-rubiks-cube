import * as THREE from "three";

export interface AlgorithmContent {
  content: {
    main: string;
    pointers: string[];
    secondaryActionLabel: string;
    nextActionLabel: string;
  }[];
  labels: {
    [key: string]: {
      text: string;
      position: THREE.Vector3;
      rotation: THREE.Vector3;
    };
  };
  nextStep: number;
  key: string;
}

export const ALGORITHM_CONTENT = {
  "moving-edges": {
    content: [
      {
        main: "Swaping Edge pieces",
        pointers: [
          "We will swap the pieces marked A, B and C.",
          "Without disturbing the top face, only swap the pieces A and B.",
          "Do not worry about keeping any other pieces in position apart from those on the top face.",
        ],
        secondaryActionLabel: "Reset",
        nextActionLabel: "Done",
      },
      {
        main: "Moving the Top layer",
        pointers: [
          "Assuming from the top layer, only A and B are swapped and other pieces are undisturbed.",
          "If we now move the top layer, two other pieces will take place of A and B.",
          "We can then reverse the moves made to restore bottom layers.",
        ],
        secondaryActionLabel: "Move Top layer",
        nextActionLabel: "Reverse Moves",
      },
      {
        main: "Swapping Edge pieces",
        pointers: [
          "You swapped 3 or 4 edge pieces.",
          "Depending on number of turns made on the top layer, different pieces will be swapped.",
          "Use this algorithm while solving. Practice it a few times.",
        ],
        secondaryActionLabel: "Try Again",
        nextActionLabel: "End Chapter",
      },
    ],
    labels: {
      "-1,1,0": {
        text: "A",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "0,1,1": {
        text: "B",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "0,1,-1": {
        text: "C",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
    },
    nextStep: 3,
    key: "moving-edges",
  },
  "flipping-edges": {
    content: [
      {
        main: "Flipping Edge pieces",
        pointers: [
          "We will flip the pieces marked A, B",
          "Without disturbing the top face, only flip the piece A. (hardest exercise in this guide)",
          "Do not worry about keeping any other pieces in position apart from those on the top face.",
        ],
        secondaryActionLabel: "Reset",
        nextActionLabel: "Done",
      },
      {
        main: "Moving the Top layer",
        pointers: [
          "Assuming from the top layer, only A is flipped and other pieces are undisturbed.",
          "If we now move the top layer, another piece will take place of A.",
          "We can then reverse the moves made to restore bottom layers.",
        ],
        secondaryActionLabel: "Move Top layer",
        nextActionLabel: "Reverse Moves",
      },
      {
        main: "Flipping Edge pieces",
        pointers: [
          "You flipped 2 edge pieces.",
          "Depending on number of turns made on the top layer, different pieces will be flipped.",
          "Use this algorithm while solving. Practice it a few times.",
        ],
        secondaryActionLabel: "Try Again",
        nextActionLabel: "End Chapter",
      },
    ],
    labels: {
      "-1,1,0": {
        text: "A",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "0,1,1": {
        text: "B",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
    },
    nextStep: 4,
    key: "flipping-edges",
  },
  "moving-corners": {
    content: [
      {
        main: "Swapping Corner pieces",
        pointers: [
          "We will swap the pieces marked A, B and C.",
          "Without disturbing the top face, only swap the pieces A and B.",
          "Do not worry about keeping any other pieces in position apart from those on the top face.",
        ],
        secondaryActionLabel: "Reset",
        nextActionLabel: "Done",
      },
      {
        main: "Moving the Top layer",
        pointers: [
          "Assuming from the top layer, only A and B are swapped and other pieces are undisturbed.",
          "If we now move the top layer, two other pieces will take place of A and B.",
          "We can then reverse the moves made to restore bottom layers.",
        ],
        secondaryActionLabel: "Move Top layer",
        nextActionLabel: "Reverse Moves",
      },
      {
        main: "Swapping Corner pieces",
        pointers: [
          "You swapped 3 or 4 corner pieces.",
          "Depending on number of turns made on the top layer, different pieces will be swapped.",
          "Use this algorithm while solving. Practice it a few times.",
        ],
        secondaryActionLabel: "Try Again",
        nextActionLabel: "End Chapter",
      },
    ],
    labels: {
      "-1,1,1": {
        text: "A",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "1,1,1": {
        text: "B",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "1,1,-1": {
        text: "C",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
    },
    nextStep: 5,
    key: "moving-corners",
  },
  "flipping-corners": {
    content: [
      {
        main: "Flipping Corner pieces",
        pointers: [
          "We will flip the pieces marked A, B",
          "Without disturbing the top face, only flip the piece A.",
          "Do not worry about keeping any other pieces in position apart from those on the top face.",
        ],
        secondaryActionLabel: "Reset",
        nextActionLabel: "Done",
      },
      {
        main: "Moving the Top layer",
        pointers: [
          "Assuming from the top layer, only A is flipped and other pieces are undisturbed.",
          "If we now move the top layer, another piece will take place of A.",
          "We can then reverse the moves made to restore bottom layers.",
        ],
        secondaryActionLabel: "Move Top layer",
        nextActionLabel: "Reverse Moves",
      },
      {
        main: "Flipping Corner pieces",
        pointers: [
          "You flipped 2 corner pieces.",
          "Depending on number of turns made on the top layer, different pieces will be flipped.",
          "Use this algorithm while solving. Practice it a few times.",
        ],
        secondaryActionLabel: "Try Again",
        nextActionLabel: "End Chapter",
      },
    ],
    labels: {
      "-1,1,1": {
        text: "A",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
      "1,1,1": {
        text: "B",
        position: new THREE.Vector3(0, 0.8, 0),
        rotation: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      },
    },
    nextStep: 6,
    key: "flipping-corners",
  },
};
